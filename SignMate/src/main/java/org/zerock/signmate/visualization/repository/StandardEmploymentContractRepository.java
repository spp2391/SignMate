// src/main/java/org/zerock/signmate/visualization/repository/StandardEmploymentContractRepository.java
package org.zerock.signmate.visualization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.standard.domain.Standard;
import org.zerock.signmate.Contract.domain.enums.ContractStatus;

import java.util.List;

public interface StandardEmploymentContractRepository
        extends JpaRepository<Standard, Long> {

    List<Standard> findByEmployerName(String employerName);
    long countByEmployerName(String employerName);
    long countByEmployerNameAndStatus(String employerName, ContractStatus status);
}
