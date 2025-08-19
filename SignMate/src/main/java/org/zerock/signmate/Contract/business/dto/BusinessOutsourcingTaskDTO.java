package org.zerock.signmate.Contract.business.dto;

import lombok.*;
import org.zerock.signmate.Contract.business.domain.BusinessOutsourcingTask;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessOutsourcingTaskDTO {

    private Long id;
    private Long contractId; // 상위 계약서 ID

    private String category;
    private BigDecimal unitPrice;
    private Integer quantity;
    private String perUnit;
    private BigDecimal paymentAmount;
    private String taskType;
    private String remarks;
    private Boolean deleted;

    public static BusinessOutsourcingTaskDTO fromEntity(BusinessOutsourcingTask entity) {
        return BusinessOutsourcingTaskDTO.builder()
                .id(entity.getId())
                .contractId(entity.getContract() != null ? entity.getContract().getId() : null)
                .category(entity.getCategory())
                .unitPrice(entity.getUnitPrice())
                .quantity(entity.getQuantity())
                .perUnit(entity.getPerUnit())
                .paymentAmount(entity.getPaymentAmount())
                .taskType(entity.getTaskType())
                .remarks(entity.getRemarks())
                .deleted(entity.getDeleted())
                .build();
    }
}
