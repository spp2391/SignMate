package org.zerock.signmate.Contract.newservice.service;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.Repository.ContractRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.enums;
import org.zerock.signmate.Contract.newservice.domain.ServiceContractDocument;
import org.zerock.signmate.Contract.newservice.dto.NewServiceDTO;

import org.zerock.signmate.Contract.newservice.repository.ServiceContractDocumentRepository;
import org.zerock.signmate.notification.service.NotificationService;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NewServiceService {

    private final ServiceContractDocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;
    private final NotificationService notificationService;

    @Transactional
    public NewServiceDTO addOrUpdateDocument(NewServiceDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginUser = authentication.getName();

        User writer = userRepository.findByName(loginUser)
                .orElseThrow(() -> new EntityNotFoundException("로그인한 유저를 찾을 수 없습니다: " + loginUser));

        User receiver = null;
        if (dto.getContractorName() != null && !dto.getContractorName().isBlank()) {
            receiver = userRepository.findByName(dto.getContractorName())
                    .orElseThrow(() -> new EntityNotFoundException("수행자(Receiver) 유저가 없습니다: " + dto.getContractorName()));
        }

        Contract contract = dto.getContractId() == null
                ? Contract.builder()
                .contractType(org.zerock.signmate.Contract.domain.enums.ContractType.SERVICE)
                .writer(writer)
                .receiver(receiver)
                .build()
                : contractRepository.findById(dto.getContractId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + dto.getContractId()));

        contract.setWriter(writer);
        contract.setReceiver(receiver);
        contractRepository.save(contract);

        ServiceContractDocument document = documentRepository.findByContract(contract)
                .orElseGet(() -> ServiceContractDocument.builder().contract(contract).build());

        // 필드 복사
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

        LocalDateTime now = LocalDateTime.now();
        if (document.getWriterSignature() != null && document.getReceiverSignature() != null) {
            // 서명 완료: 계약 완료 상태
            contract.setStatus(enums.ContractStatus.COMPLETED);
            contractRepository.save(contract);
            String msg = "용역계약서가 완료되었습니다.";
            notificationService.notifyUser(contract.getWriter(), contract, msg, now);
            if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
                notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
            }
        } else {
            // 작성/수정 중
            String msg = "용역계약서가 작성/수정되었습니다.";
            notificationService.notifyUser(contract.getWriter(), contract, msg, now);
            if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
                notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
            }
        }

        return NewServiceDTO.fromEntity(saved);
    }

    public NewServiceDTO findById(Long id) {
        Optional<ServiceContractDocument> opt = documentRepository.findById(id);
        return opt.map(NewServiceDTO::fromEntity).orElse(null);
    }

    public void deleteById(Long id) {
        documentRepository.deleteById(id);
    }

    public NewServiceDTO findByContractId(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 계약서 ID: " + contractId));
        ServiceContractDocument document = documentRepository.findByContract(contract)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 ServiceContractDocument가 존재하지 않습니다. contractId=" + contractId));
        return NewServiceDTO.fromEntity(document);
    }
}

