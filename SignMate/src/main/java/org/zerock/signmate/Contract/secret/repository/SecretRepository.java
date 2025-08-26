package org.zerock.signmate.Contract.secret.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.ServiceContract;
import org.zerock.signmate.Contract.secret.domain.Secret;

import java.util.Optional;

public interface SecretRepository extends JpaRepository<Secret, Long> {
    Optional<ServiceContract> findByContract_Id(Long contractId);
    Optional<Secret> findByContractId(Long contractId);
    Optional<Secret> findByContract(Contract contract);
//    @Query("SELECT c FROM Contract c WHERE c.writer.userId=:userId OR c.receiver.userId=:receiverUserId")
    Iterable<Secret> findByContract_Writer_UserIdOrContract_Receiver_UserId(Long userId, Long receiverUserId);

//    Iterable<Secret> findByContract_Writer_UserId(Long userId);
//    Iterable<Secret> findByContract_Receiver_UserId(Long userId);

}
