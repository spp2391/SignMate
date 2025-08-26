package org.zerock.signmate.Contract.newservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.newservice.domain.ServiceContractDocument;
import org.zerock.signmate.Contract.secret.domain.Secret;

import java.util.Optional;

@Repository("visualizationServiceContractRepo")
public interface ServiceContractDocumentRepository extends JpaRepository<ServiceContractDocument, Long> {
    Optional<ServiceContractDocument> findByContract(Contract contract);

//    Iterable<ServiceContractDocument> findByContract_Writer_UserIdOrContract_Receiver_UserId(Long userId, Long receiverUserId);
    Iterable<ServiceContractDocument> findByContract_Writer_UserId(Long userId);
    Iterable<ServiceContractDocument> findByContract_Receiver_UserId(Long userId);
}
