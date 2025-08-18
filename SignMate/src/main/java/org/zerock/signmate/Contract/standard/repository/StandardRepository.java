package org.zerock.signmate.Contract.standard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.secret.domain.Secret;
import org.zerock.signmate.Contract.standard.domain.Standard;

import java.util.Optional;

public interface StandardRepository extends JpaRepository<Standard, Long> {
    Optional<Standard> findByContract(Contract contract);

    Iterable<Object> findByWriterId(Long userId);
}
