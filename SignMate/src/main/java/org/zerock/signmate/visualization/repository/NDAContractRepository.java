// src/main/java/org/zerock/signmate/visualization/repository/NDAContractRepository.java
package org.zerock.signmate.visualization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.secret.domain.Secret;
import org.zerock.signmate.Contract.domain.enums.ContractStatus;

public interface NDAContractRepository extends JpaRepository<Secret, Long> {

    long countByDiscloserNameOrRecipientName(String discloser, String recipient);
    long countByDiscloserNameAndStatusOrRecipientNameAndStatus(
            String discloser, ContractStatus s1,
            String recipient, ContractStatus s2
    );
}
