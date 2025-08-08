package org.zerock.signmate.Contract.service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.domain.ServiceContract;

public interface ServiceContractRepository extends JpaRepository<ServiceContract, Long> {
}