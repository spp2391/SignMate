// src/main/java/org/zerock/signmate/visualization/repository/SupplyContractRepository.java
package org.zerock.signmate.visualization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.supply.domain.SupplyContract;
import org.zerock.signmate.Contract.domain.enums.ContractStatus;

public interface SupplyContractRepository
        extends JpaRepository<SupplyContract, Long> {

    long countBySupplierNameOrDemanderName(String supplier, String demander);
    long countBySupplierNameAndStatusOrDemanderNameAndStatus(
            String supplier, ContractStatus s1,
            String demander, ContractStatus s2
    );
}
