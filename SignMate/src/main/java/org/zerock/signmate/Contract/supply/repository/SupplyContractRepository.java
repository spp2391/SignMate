package org.zerock.signmate.Contract.supply.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.supply.domain.SupplyContract;

import java.util.Optional;

public interface SupplyContractRepository extends JpaRepository<SupplyContract, Long> {

    Optional<SupplyContract> findById(Long id);

    // Contract 객체 기준 조회
    Optional<SupplyContract> findByContract(Contract contract);

}
