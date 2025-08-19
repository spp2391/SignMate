package org.zerock.signmate.Contract.business.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.business.domain.BusinessOutsourcingTask;

import java.util.List;

public interface BusinessOutsourcingTaskRepository extends JpaRepository<BusinessOutsourcingTask, Long> {
    List<BusinessOutsourcingTask> findByContractId(Long contractId);

}
