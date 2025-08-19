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
import org.zerock.signmate.Contract.domain.enums.ContractType;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessOutsourcingContractService {

    private final BusinessOutsourcingContractRepository contractRepository;
    private final BusinessOutsourcingTaskRepository taskRepository;
    private final ContractRepository mainContractRepository;
    private final UserRepository userRepository;

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
        Contract mainContract = dto.getContractId() == null
                ? Contract.builder()
                .contractType(ContractType.SERVICE)
                .writer(writer)
                .receiver(receiver)
                .build()
                : mainContractRepository.findById(dto.getContractId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + dto.getContractId()));

        mainContract.setWriter(writer);
        mainContract.setReceiver(receiver);
        mainContractRepository.save(mainContract);

        // BusinessOutsourcingContract 생성 또는 조회
        BusinessOutsourcingContract contract = dto.getId() == null
                ? BusinessOutsourcingContract.builder().contract(mainContract).build()
                : contractRepository.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 BusinessOutsourcingContract ID: " + dto.getId()));

        // BusinessOutsourcingContract 필드 복사
        contract.setContract(mainContract);
        contract.setClientName(dto.getClientName());
        contract.setClientAddress(dto.getClientAddress());
        contract.setClientRepresentative(dto.getClientRepresentative());
        contract.setClientContact(dto.getClientContact());
        contract.setContractorName(dto.getContractorName());
        contract.setContractorAddress(dto.getContractorAddress());
        contract.setContractorRepresentative(dto.getContractorRepresentative());
        contract.setContractorContact(dto.getContractorContact());
        contract.setContractStartDate(dto.getContractStartDate());
        contract.setContractEndDate(dto.getContractEndDate());
        contract.setTotalPaymentAmount(dto.getTotalPaymentAmount());
        contract.setTaskDescription(dto.getTaskDescription());
        contract.setGoverningLaw(dto.getGoverningLaw());
        contract.setSignatureDate(dto.getSignatureDate());
        contract.setWriterSignature(dto.getWriterSignature());
        contract.setReceiverSignature(dto.getReceiverSignature());

        // 업무 내역 처리
        contract.getTasks().clear();
        if (dto.getTasks() != null) {
            List<BusinessOutsourcingTask> tasks = dto.getTasks().stream().map(taskDto -> {
                return BusinessOutsourcingTask.builder()
                        .contract(contract)
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

            contract.getTasks().addAll(tasks);
        }

        return BusinessOutsourcingContractDTO.fromEntity(contractRepository.save(contract));
    }

    public BusinessOutsourcingContractDTO findById(Long id) {
        return contractRepository.findById(id)
                .map(BusinessOutsourcingContractDTO::fromEntity)
                .orElse(null);
    }

    public void deleteById(Long id) {
        contractRepository.deleteById(id);
    }

    public BusinessOutsourcingContractDTO findByContractId(Long contractId) {
        Contract mainContract = mainContractRepository.findById(contractId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + contractId));

        BusinessOutsourcingContract contract = contractRepository.findByContract(mainContract)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 BusinessOutsourcingContract가 존재하지 않습니다. contractId=" + contractId));

        return BusinessOutsourcingContractDTO.fromEntity(contract);
    }
}
