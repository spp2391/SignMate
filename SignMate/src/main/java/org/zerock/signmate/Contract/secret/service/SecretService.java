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
        // 로그인한 사용자 가져오기
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

        // Contract 생성 or 조회
        Contract contract = dto.getContractId() == null
                ? Contract.builder()
                .contractType(enums.ContractType.SERVICE)
                .writer(writer)
                .receiver(receiver)
                .build()
                : contractRepository.findById(dto.getContractId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + dto.getContractId()));

        contract.setWriter(writer);
        contract.setReceiver(receiver);
        contractRepository.save(contract);

        // Secret 생성 or 조회
        Secret secret = secretRepository.findByContract(contract)
                .orElseGet(() -> Secret.builder().contract(contract).build());

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

        return SecretDTO.fromEntity(secretRepository.save(secret));
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
