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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SecretService {

    private final SecretRepository secretRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;
    private final NotificationService notificationService;

    @Transactional
    public SecretDTO addOrUpdateSecret(SecretDTO dto) {
        // 로그인한 사용자
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginUser = authentication.getName();

        User writer = userRepository.findByName(loginUser)
                .orElseThrow(() -> new EntityNotFoundException("로그인한 유저를 찾을 수 없습니다: " + loginUser));

        // 수신자 (옵션)
        User receiver = null;
        if (dto.getReceiverName() != null && !dto.getReceiverName().isBlank()) {
            receiver = userRepository.findByName(dto.getReceiverName())
                    .orElseThrow(() -> new EntityNotFoundException("받는 사람 유저가 없습니다: " + dto.getReceiverName()));
        }

        // ================= Contract 조회 / 생성 =================
        Contract contract;
        if (dto.getContractId() != null) {
            // 기존 Contract 조회
            contract = contractRepository.findById(dto.getContractId())
                    .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + dto.getContractId()));
        } else {
            // 새 Contract 생성
            contract = Contract.builder()
                    .contractType(enums.ContractType.SERVICE)
                    .writer(writer)
                    .receiver(receiver)
                    .status(enums.ContractStatus.DRAFT)
                    .build();
            contractRepository.save(contract); // DB 저장
        }

        contract.setWriter(writer);
        contract.setReceiver(receiver);

        if (contract.getStatus() == enums.ContractStatus.DRAFT) {
            contract.setStatus(enums.ContractStatus.IN_PROGRESS);
        }
        contractRepository.save(contract);

        // ================= Secret 조회 / 생성 =================
        Secret secret;
        if (dto.getId() != null) {
            secret = secretRepository.findById(dto.getId())
                    .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 Secret ID: " + dto.getId()));
        } else {
            // ContractId로 기존 Secret 조회
            secret = secretRepository.findByContractId(contract.getId())
                    .orElseGet(() -> Secret.builder().contract(contract).build());
        }

        // DTO 값 적용
        secret.setDiscloserRepresentative(dto.getDiscloserRepresentative());
        secret.setDiscloserAddress(dto.getDiscloserAddress());
        secret.setReceiverRepresentative(dto.getReceiverRepresentative());
        secret.setReceiverAddress(dto.getReceiverAddress());
        secret.setPurpose(dto.getPurpose());
        secret.setEffectiveDate(dto.getEffectiveDate());
        secret.setContractDurationMonths(dto.getContractDurationMonths());
        secret.setConfidentialityDurationYears(dto.getConfidentialityDurationYears());
        secret.setGoverningLaw(dto.getGoverningLaw());
        secret.setWriterSignature(dto.getWriterSignature());
        secret.setReceiverSignature(dto.getReceiverSignature());

        Secret savedSecret = secretRepository.save(secret);

        // Notification 발송
        LocalDateTime now = LocalDateTime.now();
        String msg = "비밀유지계약서를 작성/수정했습니다.";

        // 작성자에게 알림
        notificationService.notifyUser(writer, contract, msg, now);

        // 수신자가 존재하고 작성자와 다르면 알림
        if (receiver != null && !receiver.equals(writer)) {
            notificationService.notifyUser(receiver, contract, msg, now);
        }

        // ================= 서명 완료 시 Contract 상태 변경 =================
        if (secret.getWriterSignature() != null && secret.getReceiverSignature() != null) {
            contract.setStatus(enums.ContractStatus.COMPLETED);
            contractRepository.save(contract);
        }

        return SecretDTO.fromEntity(savedSecret);
    }




    public SecretDTO findById(Long id) {
        Optional<Secret> opt = secretRepository.findById(id);
        return opt.map(SecretDTO::fromEntity).orElse(null);
    }

    public void deleteById(Long id) {
        secretRepository.deleteById(id);
    }

    // ContractId로 Secret 조회
    public SecretDTO findByContractId(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 계약서 ID: " + contractId));
        Secret secret = secretRepository.findByContract(contract)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 Secret이 존재하지 않습니다. contractId=" + contractId));
        return SecretDTO.fromEntity(secret);
    }
}
