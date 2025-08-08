package org.zerock.signmate.Contract.service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.domain.Contract;

public interface ContractRepository extends JpaRepository<Contract, Long> {
}