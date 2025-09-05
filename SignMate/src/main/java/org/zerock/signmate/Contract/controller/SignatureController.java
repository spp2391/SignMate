package org.zerock.signmate.Contract.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.Signature;
import org.zerock.signmate.Contract.dto.SignatureRequest;
import org.zerock.signmate.Contract.Repository.ContractRepository;
import org.zerock.signmate.Contract.service.SignatureService;
import org.zerock.signmate.user.repository.UserRepository;
import org.zerock.signmate.user.domain.User;

import java.util.List;

@RestController
@RequestMapping("/api/signatures")
@RequiredArgsConstructor
public class SignatureController {

    private final SignatureService signatureService;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;

    // 서명 추가 - writer 또는 receiver 구분해서 저장
    @PostMapping
    public ResponseEntity<?> addSignature(@RequestBody SignatureRequest request) {
        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new RuntimeException("계약서를 찾을 수 없습니다. id=" + request.getContractId()));

        User signer = userRepository.findById(request.getSignerId())
                .orElseThrow(() -> new RuntimeException("서명자를 찾을 수 없습니다. id=" + request.getSignerId()));

        Signature signature;
        if ("writer".equalsIgnoreCase(request.getRole())) {
            signature = signatureService.saveWriterSignature(contract, signer, request.getSignatureImage(), request.getSignatureHash());
        } else if ("receiver".equalsIgnoreCase(request.getRole())) {
            signature = signatureService.saveReceiverSignature(contract, signer, request.getSignatureImage(), request.getSignatureHash());
        } else {
            return ResponseEntity.badRequest().body("서명 역할(role)은 'writer' 또는 'receiver'여야 합니다.");
        }

        return ResponseEntity.ok(signature);
    }

    // 계약서에 연결된 모든 서명 목록 조회
    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<Signature>> getSignaturesByContract(@PathVariable Long contractId) {
        List<Signature> signatures = signatureService.getSignaturesByContractId(contractId);
        return ResponseEntity.ok(signatures);
    }

    // writer 서명만 조회 (필요 시)
    @GetMapping("/contract/{contractId}/writer")
    public ResponseEntity<List<Signature>> getWriterSignatures(@PathVariable Long contractId) {
        List<Signature> signatures = signatureService.getWriterSignaturesByContractId(contractId);
        return ResponseEntity.ok(signatures);
    }

    // receiver 서명만 조회 (필요 시)
    @GetMapping("/contract/{contractId}/receiver")
    public ResponseEntity<List<Signature>> getReceiverSignatures(@PathVariable Long contractId) {
        List<Signature> signatures = signatureService.getReceiverSignaturesByContractId(contractId);
        return ResponseEntity.ok(signatures);
    }

}
