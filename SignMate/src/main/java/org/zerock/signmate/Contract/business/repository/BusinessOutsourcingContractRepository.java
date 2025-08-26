package org.zerock.signmate.Contract.business.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.business.domain.BusinessOutsourcingContract;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.newservice.domain.ServiceContractDocument;

import java.util.Optional;

public interface BusinessOutsourcingContractRepository extends JpaRepository<BusinessOutsourcingContract, Long> {
    Optional<BusinessOutsourcingContract> findByContract(Contract contract);

    Iterable<BusinessOutsourcingContract> findByContract_Writer_UserIdOrContract_Receiver_UserId(Long userId, Long receiverUserId);
}
