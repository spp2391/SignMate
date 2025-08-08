package org.zerock.signmate.Contract.service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.ServiceContract;

import java.util.Optional;

public interface ServiceContractRepository extends JpaRepository<ServiceContract, Long> {
    Optional<ServiceContract> findByContract(Contract contract);
}