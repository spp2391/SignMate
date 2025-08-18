package org.zerock.signmate.Contract.supply.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "supply_item")
public class SupplyItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 자재/물품 공급계약서와 다대일 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supply_contract_id")
    private SupplyContract supplyContract;

    private String itemName;      // 품명
    private String specification; // 규격
    private String unit;          // 단위
    private Integer quantity;     // 수량
    private BigDecimal unitPrice; // 단가
    private BigDecimal amount;    // 금액
    private String remarks;       // 비고

    private Boolean deleted = false; // 삭제 여부 (soft delete용)
}

