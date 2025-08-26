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
import org.zerock.signmate.Contract.business.repository.BusinessOutsourcingContractRepository;
import org.zerock.signmate.Contract.business.repository.BusinessOutsourcingTaskRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.enums.ContractStatus;
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

    private final BusinessOutsourcingContractRepository contractRepository;
    private final BusinessOutsourcingTaskRepository taskRepository;
    private final ContractRepository mainContractRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public BusinessOutsourcingContractDTO saveContractByContract(BusinessOutsourcingContractDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginUser = authentication.getName();

        User writer = userRepository.findByName(loginUser)
                .orElseThrow(() -> new EntityNotFoundException("로그인한 유저를 찾을 수 없습니다: " + loginUser));

        // 수신자 조회
        User receiver = null;
        if (dto.getContractorName() != null && !dto.getContractorName().isBlank()) {
            receiver = userRepository.findByName(dto.getContractorName())
                    .orElseThrow(() -> new EntityNotFoundException("받는 사람 유저가 없습니다: " + dto.getContractorName()));
        }

        // Contract 조회/생성
        Contract contract;
        if (dto.getContractId() != null) {
            contract = mainContractRepository.findById(dto.getContractId())
                    .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + dto.getContractId()));
            if (receiver != null) contract.setReceiver(receiver);
        } else {
            contract = Contract.builder()
                    .contractType(ContractType.OUTSOURCING)
                    .writer(writer)
                    .receiver(receiver)
                    .status(ContractStatus.DRAFT)
                    .build();
            mainContractRepository.save(contract);
        }

        if (contract.getStatus() == ContractStatus.DRAFT) {
            contract.setStatus(ContractStatus.IN_PROGRESS);
        }
        mainContractRepository.save(contract);

        // BusinessOutsourcingContract 조회/생성
        BusinessOutsourcingContract boc = contractRepository.findByContract(contract)
                .orElseGet(() -> BusinessOutsourcingContract.builder().contract(contract).build());

        // DTO 값 적용
        boc.setContract(contract);
        boc.setClientName(dto.getClientName());
        boc.setClientAddress(dto.getClientAddress());
        boc.setClientRepresentative(dto.getClientRepresentative());
        boc.setClientContact(dto.getClientContact());
        boc.setContractorName(dto.getContractorName());
        boc.setContractorAddress(dto.getContractorAddress());
        boc.setContractorRepresentative(dto.getContractorRepresentative());
        boc.setContractorContact(dto.getContractorContact());
        boc.setContractStartDate(dto.getContractStartDate());
        boc.setContractEndDate(dto.getContractEndDate());
        boc.setTotalPaymentAmount(dto.getTotalPaymentAmount());
        boc.setTaskDescription(dto.getTaskDescription());
        boc.setGoverningLaw(dto.getGoverningLaw());
        boc.setWriterSignature(dto.getWriterSignature());
        boc.setReceiverSignature(dto.getReceiverSignature());

        // 업무 내역 처리
        boc.getTasks().clear();
        if (dto.getTasks() != null) {
            List<BusinessOutsourcingTask> tasks = dto.getTasks().stream().map(taskDto -> {
                return BusinessOutsourcingTask.builder()
                        .contract(boc)
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
            boc.getTasks().addAll(tasks);
        }

        BusinessOutsourcingContract saved = contractRepository.save(boc);
        LocalDateTime now = LocalDateTime.now();

        if (boc.getWriterSignature() != null && boc.getReceiverSignature() != null) {
            contract.setStatus(ContractStatus.COMPLETED);
            mainContractRepository.save(contract);
            String msg = "업무위탁 계약서가 완료되었습니다.";
            notificationService.notifyUser(contract.getWriter(), contract, msg, now);
            if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
                notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
            }
        } else {
            String msg = "업무위탁 계약서가 작성/수정되었습니다.";
            notificationService.notifyUser(contract.getWriter(), contract, msg, now);
            if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
                notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
            }
        }

        return BusinessOutsourcingContractDTO.fromEntity(saved);
    }

    public BusinessOutsourcingContractDTO findByContractId(Long contractId) {
        Contract contract = mainContractRepository.findById(contractId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + contractId));
        BusinessOutsourcingContract boc = contractRepository.findByContract(contract)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 BusinessOutsourcingContract가 존재하지 않습니다. contractId=" + contractId));
        return BusinessOutsourcingContractDTO.fromEntity(boc);
    }

    public void deleteByContractId(Long contractId) {
        Contract contract = mainContractRepository.findById(contractId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + contractId));
        BusinessOutsourcingContract boc = contractRepository.findByContract(contract)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 BusinessOutsourcingContract가 존재하지 않습니다. contractId=" + contractId));
        contractRepository.delete(boc);
    }

    public BusinessOutsourcingContractDTO findById(Long id) {
        return contractRepository.findById(id)
                .map(BusinessOutsourcingContractDTO::fromEntity)
                .orElse(null);
    }
}
