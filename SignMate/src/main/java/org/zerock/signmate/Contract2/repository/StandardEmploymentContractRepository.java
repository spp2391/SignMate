package org.zerock.signmate.Contract2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zerock.signmate.Contract2.domain.StandardEmploymentContract;
import org.zerock.signmate.Contract.domain.enums.ContractStatus;

import java.util.List;

@Repository
public interface StandardEmploymentContractRepository extends JpaRepository<StandardEmploymentContract, Long> {

    List<StandardEmploymentContract> findByEmployerName(String employerName);

    // ACTIVE 계약만 조회하는 커스텀 메서드
    default List<StandardEmploymentContract> findActiveByEmployerName(String employerName) {
        return findByEmployerName(employerName).stream()
                .filter(c -> c.getStatus() == ContractStatus.SIGNED
                        && (c.getWorkEndDate() == null || c.getWorkEndDate().isAfter(java.time.LocalDate.now())))
                .toList();
    }
}
