package org.zerock.signmate.Contract.supply.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zerock.signmate.Contract.supply.domain.SupplyItem;

import java.util.List;

@Repository("supplyItemVisualizationRepository")
public interface SupplyItemRepository extends JpaRepository<SupplyItem, Long> {

    List<SupplyItem> findBySupplyContractId(Long contractId);

}