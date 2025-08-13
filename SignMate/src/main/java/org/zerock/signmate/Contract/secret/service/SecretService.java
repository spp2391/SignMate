package org.zerock.signmate.Contract.secret.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.Repository.ContractRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.enums;
import org.zerock.signmate.Contract.secret.domain.Secret;
import org.zerock.signmate.Contract.secret.dto.SecretDTO;
import org.zerock.signmate.Contract.secret.repository.SecretRepository;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SecretService {

    private final SecretRepository secretRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;

    @Transactional
    public SecretDTO addOrUpdateSecret(SecretDTO dto) {

        // 1) 작성자/수신자 조회
        User writer = userRepository.findByName(dto.getWriterName())
                .orElseThrow(() -> new RuntimeException("작성자 유저가 없습니다: " + dto.getWriterName()));

        User receiver = null;
        if (dto.getReceiverName() != null && !dto.getReceiverName().isEmpty()) {
            receiver = userRepository.findByName(dto.getReceiverName())
                    .orElseThrow(() -> new RuntimeException("받는 사람 유저가 없습니다: " + dto.getReceiverName()));
        }

        // 2) Contract 생성 또는 조회
        Contract contract;
        if (dto.getContractId() == null) {
            contract = Contract.builder()
                    .contractType(enums.ContractType.SERVICE)
                    .writer(writer)
                    .receiver(receiver)
                    .build();
            contractRepository.save(contract);
        } else {
            contract = contractRepository.findById(dto.getContractId())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 계약서 ID: " + dto.getContractId()));
            contract.setWriter(writer);
            contract.setReceiver(receiver);
        }

        // 3) 기존 Secret 조회, 없으면 새 Secret 생성
        Secret secret = secretRepository.findByContract(contract)
                .orElse(Secret.builder().contract(contract).build());

        // 4) Secret 필드 업데이트
        secret.setDiscloserRepresentative(dto.getDiscloserRepresentative() != null ? dto.getDiscloserRepresentative() : "");
        secret.setDiscloserAddress(dto.getDiscloserAddress() != null ? dto.getDiscloserAddress() : "");
        secret.setReceiverRepresentative(dto.getReceiverRepresentative() != null ? dto.getReceiverRepresentative() : "");
        secret.setReceiverAddress(dto.getReceiverAddress() != null ? dto.getReceiverAddress() : "");
        secret.setPurpose(dto.getPurpose() != null ? dto.getPurpose() : "");
        secret.setEffectiveDate(dto.getEffectiveDate());
        secret.setContractDurationMonths(dto.getContractDurationMonths() != null ? dto.getContractDurationMonths() : 0);
        secret.setConfidentialityDurationYears(dto.getConfidentialityDurationYears() != null ? dto.getConfidentialityDurationYears() : 0);
        secret.setGoverningLaw(dto.getGoverningLaw() != null ? dto.getGoverningLaw() : "");
        secret.setWriterSignature(dto.getWriterSignature() != null ? dto.getWriterSignature() : "");
        secret.setReceiverSignature(dto.getReceiverSignature() != null ? dto.getReceiverSignature() : "");

        // 5) Secret 저장
        Secret saved = secretRepository.save(secret);

        return SecretDTO.fromEntity(saved);
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
