// src/main/java/org/zerock/signmate/visualization/repository/ServiceContractDocumentRepository.java
package org.zerock.signmate.visualization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.domain.enums.ContractStatus;
import org.zerock.signmate.Contract.newservice.domain.ServiceContractDocument;

import java.util.List;

public interface ServiceContractDocumentRepository
        extends JpaRepository<ServiceContractDocument, Long> {

    List<ServiceContractDocument> findByClientNameOrContractorName(String client, String contractor);
    long countByClientNameOrContractorName(String client, String contractor);
//    long countByClientNameAndStatusOrContractorNameAndStatus(
//            String client, ContractStatus s1,
//            String contractor, ContractStatus s2
//    );
}
