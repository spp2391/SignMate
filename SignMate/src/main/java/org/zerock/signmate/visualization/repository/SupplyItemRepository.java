// src/main/java/org/zerock/signmate/visualization/repository/SupplyItemRepository.java
package org.zerock.signmate.visualization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.zerock.signmate.Contract.supply.domain.SupplyItem;

public interface SupplyItemRepository extends JpaRepository<SupplyItem, Long> {

    @Query("""
        SELECT COALESCE(SUM(i.amount), 0)
        FROM SupplyItem i
        JOIN i.supplyContract c
        WHERE c.supplierName = :company
           OR c.demanderName = :company
    """)
    Double sumAmountByCompany(String company);
}
