package org.zerock.signmate.Contract.supply.dto;
import lombok.*;
import org.zerock.signmate.Contract.supply.domain.SupplyItem;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplyItemDTO {

    private Long id;
    private String itemName;
    private String specification;
    private String unit;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal amount;
    private String remarks;

    public static SupplyItemDTO fromEntity(SupplyItem entity) {
        return SupplyItemDTO.builder()
                .id(entity.getId())
                .itemName(entity.getItemName())
                .specification(entity.getSpecification())
                .unit(entity.getUnit())
                .quantity(entity.getQuantity())
                .unitPrice(entity.getUnitPrice())
                .amount(entity.getAmount())
                .remarks(entity.getRemarks())
                .build();
    }
}
