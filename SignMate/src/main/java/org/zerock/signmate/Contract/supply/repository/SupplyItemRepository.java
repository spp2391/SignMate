package org.zerock.signmate.Contract.supply.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.Contract.supply.domain.SupplyItem;

import java.util.List;

public interface SupplyItemRepository extends JpaRepository<SupplyItem, Long> {

    List<SupplyItem> findBySupplyContractId(Long contractId);

}