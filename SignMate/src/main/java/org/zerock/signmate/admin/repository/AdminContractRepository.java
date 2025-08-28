package org.zerock.signmate.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.zerock.signmate.Contract.domain.Contract;

public interface AdminContractRepository
        extends JpaRepository<Contract, Long>, JpaSpecificationExecutor<Contract> {
}
