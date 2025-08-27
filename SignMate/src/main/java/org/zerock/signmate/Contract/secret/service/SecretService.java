package org.zerock.signmate.Contract.secret.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.Repository.ContractRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.enums;
import org.zerock.signmate.Contract.secret.domain.Secret;
import org.zerock.signmate.Contract.secret.dto.SecretDTO;
import org.zerock.signmate.Contract.secret.repository.SecretRepository;
import org.zerock.signmate.notification.service.NotificationService;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SecretService {

    private final SecretRepository secretRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;
    private final NotificationService notificationService;

    @Transactional
    public SecretDTO saveSecretByContract(SecretDTO dto) {
        // 로그인 사용자
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginUser = authentication.getName();

        User loginUserEntity = userRepository.findByName(loginUser)
                .orElseThrow(() -> new EntityNotFoundException("로그인한 유저를 찾을 수 없습니다: " + loginUser));

        // 수신자
        User receiver = null;
        if (dto.getReceiverName() != null && !dto.getReceiverName().isBlank()) {
            receiver = userRepository.findByName(dto.getReceiverName())
                    .orElseThrow(() -> new EntityNotFoundException("받는 사람 유저가 없습니다: " + dto.getReceiverName()));
        }

        // Contract 조회/생성
        Contract contract;
        if (dto.getContractId() != null) {
            contract = contractRepository.findById(dto.getContractId())
                    .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + dto.getContractId()));
            // 기존 계약이라면 writer는 유지, receiver만 업데이트
            if (receiver != null) contract.setReceiver(receiver);
        } else {
            // 신규 생성 시 로그인 사용자가 writer
            contract = Contract.builder()
                    .contractType(enums.ContractType.SECRET)
                    .writer(loginUserEntity)
                    .receiver(receiver)
                    .status(enums.ContractStatus.DRAFT)
                    .writerSignature(dto.getWriterSignature())
                    .receiverSignature(dto.getReceiverSignature())
                    .build();
            contractRepository.save(contract);
        }

        // DRAFT 상태라면 진행중으로 변경
        if (contract.getStatus() == enums.ContractStatus.DRAFT) {
            contract.setStatus(enums.ContractStatus.IN_PROGRESS);
        }
        contractRepository.save(contract);

        // Secret 조회/생성 (Contract 기준)
        Secret secret = secretRepository.findByContract(contract)
                .orElseGet(() -> Secret.builder().contract(contract).build());

        // DTO 값 적용
        secret.setDiscloserRepresentative(dto.getDiscloserRepresentative());
        secret.setDiscloserAddress(dto.getDiscloserAddress());
        secret.setReceiverRepresentative(dto.getReceiverRepresentative());
        secret.setReceiverAddress(dto.getReceiverAddress());
        secret.setPurpose(dto.getPurpose());
        secret.setEffectiveDate(dto.getEffectiveDate() != null ? dto.getEffectiveDate() : contract.getCreatedAt());
        secret.setContractDurationMonths(dto.getContractDurationMonths());
        secret.setConfidentialityDurationYears(dto.getConfidentialityDurationYears());
        secret.setGoverningLaw(dto.getGoverningLaw());
        secret.setWriterSignature(dto.getWriterSignature());
        secret.setReceiverSignature(dto.getReceiverSignature());

        Secret savedSecret = secretRepository.save(secret);

        LocalDateTime now = LocalDateTime.now();

        if (secret.getWriterSignature() != null && secret.getReceiverSignature() != null) {
            // 서명 완료: 계약 완료 상태
            contract.setStatus(enums.ContractStatus.COMPLETED);
            contractRepository.save(contract);
            String msg = "비밀유지계약서가 완료되었습니다.";
            notificationService.notifyUser(contract.getWriter(), contract, msg, now);
            if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
                notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
            }
        } else {
            // 작성/수정 중
            String msg = dto.getWriterName()+"이 비밀유지계약서를 작성하였습니다. 서명해 주시길 바랍니다.";
            notificationService.notifyUser(contract.getWriter(), contract, msg, now);
            if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
                notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
            }
        }

        return SecretDTO.fromEntity(savedSecret);

    }

    // ContractId 기준 조회
    public SecretDTO findByContractId(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 계약서 ID: " + contractId));
        Secret secret = secretRepository.findByContract(contract)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 Secret이 존재하지 않습니다. contractId=" + contractId));
        return SecretDTO.fromEntity(secret);
    }
    @Transactional
    public void deleteByContractId(Long contractId, Authentication authentication) {
        String username = authentication.getName();
        User loginUser = userRepository.findByName(username)
                .orElseThrow(() -> new RuntimeException("로그인 유저가 없습니다"));

        Secret secret = secretRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 Secret이 존재하지 않습니다. contractId=" + contractId));

        // 3. writer 권한 체크
        if (!secret.getContract().getWriter().equals(loginUser)) {
            throw new RuntimeException("삭제 권한이 없습니다. 작성자만 삭제할 수 있습니다.");
        }
        secretRepository.delete(secret);
    }
}
