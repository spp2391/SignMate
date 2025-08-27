package org.zerock.signmate.Contract.newservice.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.Repository.ContractRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.enums.ContractStatus;
import org.zerock.signmate.Contract.domain.enums.ContractType;
import org.zerock.signmate.Contract.newservice.domain.ServiceContractDocument;
import org.zerock.signmate.Contract.newservice.dto.NewServiceDTO;
import org.zerock.signmate.Contract.newservice.repository.ServiceContractDocumentRepository;
import org.zerock.signmate.notification.service.NotificationService;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewServiceService {

    private final ServiceContractDocumentRepository documentRepository;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public NewServiceDTO saveContractByContract(NewServiceDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginUser = authentication.getName();

        User writer = userRepository.findByName(loginUser)
                .orElseThrow(() -> new EntityNotFoundException("로그인한 유저를 찾을 수 없습니다: " + loginUser));

        // 수신자 조회
        User receiver = null;
        if (dto.getContractorName() != null && !dto.getContractorName().isBlank()) {
            receiver = userRepository.findByName(dto.getContractorName())
                    .orElseThrow(() -> new EntityNotFoundException("수신자 유저가 없습니다: " + dto.getContractorName()));
        }

        // Contract 조회 또는 새로 생성
        Contract contract;
        if (dto.getContractId() != null) {
            contract = contractRepository.findById(dto.getContractId())
                    .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + dto.getContractId()));
            if (receiver != null) contract.setReceiver(receiver);
        } else {
            contract = Contract.builder()
                    .contractType(ContractType.SERVICE)
                    .writer(writer)
                    .receiver(receiver)
                    .status(ContractStatus.DRAFT)
                    .build();
            contractRepository.save(contract);
        }

        if (contract.getStatus() == ContractStatus.DRAFT) {
            contract.setStatus(ContractStatus.IN_PROGRESS);
        }
        contractRepository.save(contract);

        // ServiceContractDocument 조회 또는 새로 생성
        ServiceContractDocument document = documentRepository.findByContract(contract)
                .orElseGet(() -> ServiceContractDocument.builder().contract(contract).build());

        // DTO 필드 적용
        document.setContract(contract);
        document.setClientName(dto.getClientName());
        document.setClientRepresentative(dto.getClientRepresentative());
        document.setClientAddress(dto.getClientAddress());

        document.setContractorName(dto.getContractorName());
        document.setContractorRepresentative(dto.getContractorRepresentative());
        document.setContractorAddress(dto.getContractorAddress());

        document.setProjectName(dto.getProjectName());
        document.setContractStartDate(dto.getContractStartDate());
        document.setContractEndDate(dto.getContractEndDate());
        document.setContractAmount(dto.getContractAmount());
        document.setScopeOfWork(dto.getScopeOfWork());
        document.setDeliverablesAcceptanceCriteria(dto.getDeliverablesAcceptanceCriteria());
        document.setDepositAmount(dto.getDepositAmount());
        document.setInterimPaymentAmount(dto.getInterimPaymentAmount());
        document.setFinalPaymentDueDays(dto.getFinalPaymentDueDays());
        document.setWarrantyMonths(dto.getWarrantyMonths());
        document.setDelayPenaltyRate(dto.getDelayPenaltyRate());
        document.setSignatureDate(dto.getSignatureDate());

        document.setWriterSignature(dto.getWriterSignature());
        document.setReceiverSignature(dto.getReceiverSignature());

        ServiceContractDocument saved = documentRepository.save(document);

        // Notification 처리
        LocalDateTime now = LocalDateTime.now();
        if (document.getWriterSignature() != null && document.getReceiverSignature() != null) {
            contract.setStatus(ContractStatus.COMPLETED);
            contractRepository.save(contract);

            String msg = dto.getClientName()+"이 용역 계약서를 보냈습니다.";
            notificationService.notifyUser(contract.getWriter(), contract, msg, now);
            if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
                notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
            }
        } else {
            String msg = dto.getClientName()+"이 용역 계약서를 작성하였습니다. 서명해 주시길 바랍니다.";
            notificationService.notifyUser(contract.getWriter(), contract, msg, now);
            if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
                notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
            }
        }

        return NewServiceDTO.fromEntity(saved);
    }

    public NewServiceDTO findByContractId(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + contractId));
        ServiceContractDocument document = documentRepository.findByContract(contract)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 ServiceContractDocument가 존재하지 않습니다. contractId=" + contractId));
        return NewServiceDTO.fromEntity(document);
    }

    @Transactional
    public void deleteByContractId(Long contractId, Authentication authentication) {
        String username = authentication.getName();
        User loginUser = userRepository.findByName(username)
                .orElseThrow(() -> new RuntimeException("로그인 유저가 없습니다"));

        ServiceContractDocument document = documentRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 ServiceContractDocument가 존재하지 않습니다. contractId=" + contractId));
        if (!document.getContract().getWriter().equals(loginUser)) {
            throw new RuntimeException("삭제 권한이 없습니다. 작성자만 삭제할 수 있습니다.");
        }
        documentRepository.delete(document);
    }

    public NewServiceDTO findById(Long id) {
        return documentRepository.findById(id)
                .map(NewServiceDTO::fromEntity)
                .orElse(null);
    }
}
