package org.zerock.signmate.Contract.business.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.business.domain.BusinessOutsourcingContract;
import org.zerock.signmate.Contract.domain.Contract;

import java.util.Optional;

public interface BusinessOutsourcingContractRepository extends JpaRepository<BusinessOutsourcingContract, Long> {
    Optional<BusinessOutsourcingContract> findByContract(Contract contract);
}
