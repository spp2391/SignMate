package org.zerock.signmate.Contract.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.domain.Signature;

import java.util.List;

public interface SignatureRepository extends JpaRepository<Signature, Long> {

    // 특정 계약서의 모든 서명 조회
    List<Signature> findByContractId(Long contractId);

    // 계약서 + writer 서명만 조회
    List<Signature> findByContractIdAndWriterIsNotNull(Long contractId);

    // 계약서 + receiver 서명만 조회
    List<Signature> findByContractIdAndReceiverIsNotNull(Long contractId);

}