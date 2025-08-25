package org.zerock.signmate.Contract.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.Repository.SignatureRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.Signature;
import org.zerock.signmate.user.domain.User;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SignatureService {

    private final SignatureRepository signatureRepository;

    // writer 서명 저장
    public Signature saveWriterSignature(Contract contract, User writer, String signatureImage, String signatureHash) {
        Signature signature = new Signature();
        signature.setContract(contract);
        signature.setWriter(writer);
        signature.setSignatureImage(signatureImage);
        signature.setSignatureHash(signatureHash);
        signature.setSignedAt(LocalDateTime.now());
        return signatureRepository.save(signature);
    }

    // receiver 서명 저장
    public Signature saveReceiverSignature(Contract contract, User receiver, String signatureImage, String signatureHash) {
        Signature signature = new Signature();
        signature.setContract(contract);
        signature.setReceiver(receiver);
        signature.setSignatureImage(signatureImage);
        signature.setSignatureHash(signatureHash);
        signature.setSignedAt(LocalDateTime.now());
        return signatureRepository.save(signature);
    }

    // 계약서에 연결된 모든 서명 조회
    public List<Signature> getSignaturesByContractId(Long contractId) {
        return signatureRepository.findByContractId(contractId);
    }

    // 계약서에 연결된 writer 서명만 조회
    public List<Signature> getWriterSignaturesByContractId(Long contractId) {
        return signatureRepository.findByContractIdAndWriterIsNotNull(contractId);
    }

    // 계약서에 연결된 receiver 서명만 조회
    public List<Signature> getReceiverSignaturesByContractId(Long contractId) {
        return signatureRepository.findByContractIdAndReceiverIsNotNull(contractId);
    }
}
