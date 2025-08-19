// src/main/java/org/zerock/signmate/visualization/repository/BusinessOutsourcingContractRepository.java
package org.zerock.signmate.visualization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.business.domain.BusinessOutsourcingContract;
import org.zerock.signmate.Contract.domain.enums.ContractStatus;

import java.util.List;

public interface BusinessOutsourcingContractRepository
        extends JpaRepository<BusinessOutsourcingContract, Long> {

    List<BusinessOutsourcingContract> findByClientNameOrContractorName(String client, String contractor);
    long countByClientNameOrContractorName(String client, String contractor);
//    long countByClientNameAndStatusOrContractorNameAndStatus(
//            String client, ContractStatus s1,
//            String contractor, ContractStatus s2
//    );
}
