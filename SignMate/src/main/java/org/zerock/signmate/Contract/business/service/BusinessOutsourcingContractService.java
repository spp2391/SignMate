package org.zerock.signmate.Contract.business.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.Repository.ContractRepository;
import org.zerock.signmate.Contract.business.domain.BusinessOutsourcingContract;
import org.zerock.signmate.Contract.business.domain.BusinessOutsourcingTask;
import org.zerock.signmate.Contract.business.dto.BusinessOutsourcingContractDTO;
import org.zerock.signmate.Contract.business.dto.BusinessOutsourcingTaskDTO;
import org.zerock.signmate.Contract.business.repository.BusinessOutsourcingContractRepository;
import org.zerock.signmate.Contract.business.repository.BusinessOutsourcingTaskRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.enums;
import org.zerock.signmate.Contract.domain.enums.ContractType;
import org.zerock.signmate.notification.service.NotificationService;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessOutsourcingContractService {

    private final BusinessOutsourcingContractRepository businessOutsourcingContractRepository;
    private final BusinessOutsourcingTaskRepository taskRepository;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public BusinessOutsourcingContractDTO addOrUpdateContract(BusinessOutsourcingContractDTO dto, boolean force) {

        // 작성자(갑) User 조회
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginUser = authentication.getName();

        User writer = userRepository.findByName(loginUser)
                .orElseThrow(() -> new EntityNotFoundException("로그인한 유저를 찾을 수 없습니다: " + loginUser));

        if (!force && dto.getClientName() != null && !dto.getClientName().equals(writer.getName())) {
            throw new SecurityException("작성자명이 로그인 계정과 다릅니다. 본인이 맞습니까?");
        }
        // 수신자(을) User 조회
        User receiver = null;
        if (dto.getContractorName() != null && !dto.getContractorName().isBlank()) {
            receiver = userRepository.findByName(dto.getContractorName())
                    .orElseThrow(() -> new EntityNotFoundException("받는 사람 유저가 없습니다: " + dto.getContractorName()));
        }

        // Contract 엔티티 생성 또는 조회
        Contract contract = dto.getContractId() == null
                ? Contract.builder()
                .contractType(ContractType.OUTSOURCING)
                .writer(writer)
                .receiver(receiver)
                .build()
                : contractRepository.findById(dto.getContractId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + dto.getContractId()));

        contract.setWriter(writer);
        contract.setReceiver(receiver);
        contractRepository.save(contract);

        // BusinessOutsourcingContract 생성 또는 조회
        BusinessOutsourcingContract businessOutsourcingContract = dto.getId() == null
                ? BusinessOutsourcingContract.builder().contract(contract).build()
                : businessOutsourcingContractRepository.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 BusinessOutsourcingContract ID: " + dto.getId()));

        // BusinessOutsourcingContract 필드 복사
        businessOutsourcingContract.setContract(contract);
        businessOutsourcingContract.setClientName(dto.getClientName());
        businessOutsourcingContract.setClientAddress(dto.getClientAddress());
        businessOutsourcingContract.setClientRepresentative(dto.getClientRepresentative());
        businessOutsourcingContract.setClientContact(dto.getClientContact());
        businessOutsourcingContract.setContractorName(dto.getContractorName());
        businessOutsourcingContract.setContractorAddress(dto.getContractorAddress());
        businessOutsourcingContract.setContractorRepresentative(dto.getContractorRepresentative());
        businessOutsourcingContract.setContractorContact(dto.getContractorContact());
        businessOutsourcingContract.setContractStartDate(dto.getContractStartDate());
        businessOutsourcingContract.setContractEndDate(dto.getContractEndDate());
        businessOutsourcingContract.setTotalPaymentAmount(dto.getTotalPaymentAmount());
        businessOutsourcingContract.setTaskDescription(dto.getTaskDescription());
        businessOutsourcingContract.setGoverningLaw(dto.getGoverningLaw());
        businessOutsourcingContract.setSignatureDate(dto.getSignatureDate());
        businessOutsourcingContract.setWriterSignature(dto.getWriterSignature());
        businessOutsourcingContract.setReceiverSignature(dto.getReceiverSignature());



        // 업무 내역 처리
        businessOutsourcingContract.getTasks().clear();
        if (dto.getTasks() != null) {
            List<BusinessOutsourcingTask> tasks = dto.getTasks().stream().map(taskDto -> {
                return BusinessOutsourcingTask.builder()
                        .contract(businessOutsourcingContract)
                        .category(taskDto.getCategory())
                        .unitPrice(taskDto.getUnitPrice())
                        .quantity(taskDto.getQuantity())
                        .perUnit(taskDto.getPerUnit())
                        .paymentAmount(taskDto.getPaymentAmount())
                        .taskType(taskDto.getTaskType())
                        .remarks(taskDto.getRemarks())
                        .deleted(taskDto.getDeleted())
                        .build();
            }).collect(Collectors.toList());

            businessOutsourcingContract.getTasks().addAll(tasks);
        }

        BusinessOutsourcingContract saved = businessOutsourcingContractRepository.save(businessOutsourcingContract);

        LocalDateTime now = LocalDateTime.now();

        if (businessOutsourcingContract.getWriterSignature() != null && businessOutsourcingContract.getReceiverSignature() != null) {
            // 서명 완료: 계약 완료 상태
            contract.setStatus(enums.ContractStatus.COMPLETED);
            contractRepository.save(contract);
            String msg = "업무위탁 계약서가 완료되었습니다.";
            notificationService.notifyUser(contract.getWriter(), contract, msg, now);
            if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
                notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
            }
        } else {
            // 작성/수정 중
            String msg = "업무위탁 계약서가 작성/수정되었습니다.";
            notificationService.notifyUser(contract.getWriter(), contract, msg, now);
            if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
                notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
            }
        }

        return BusinessOutsourcingContractDTO.fromEntity(saved);
    }

    public BusinessOutsourcingContractDTO findById(Long id) {
        return businessOutsourcingContractRepository.findById(id)
                .map(BusinessOutsourcingContractDTO::fromEntity)
                .orElse(null);
    }

    public void deleteById(Long id) {
        contractRepository.deleteById(id);
    }

    public BusinessOutsourcingContractDTO findByContractId(Long contractId) {
        Contract mainContract = contractRepository.findById(contractId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + contractId));

        BusinessOutsourcingContract contract = businessOutsourcingContractRepository.findByContract(mainContract)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 BusinessOutsourcingContract가 존재하지 않습니다. contractId=" + contractId));

        return BusinessOutsourcingContractDTO.fromEntity(contract);
    }
}
