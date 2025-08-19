package org.zerock.signmate.Contract.standard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.standard.domain.Standard;

import java.util.List;
import java.util.Optional;

public interface StandardRepository extends JpaRepository<Standard, Long> {
    Optional<Standard> findByContract(Contract contract);

    List<Standard> findByContract_Writer_UserId(Long writerId);
}
