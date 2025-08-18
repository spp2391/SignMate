// src/main/java/org/zerock/signmate/visualization/dto/CompanyOverviewDTO.java
package org.zerock.signmate.visualization.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyOverviewDTO {

    private String companyName;

    // 문서 개수
    private long employmentCount;
    private long serviceCount;
    private long outsourcingCount;
    private long supplyCount;
    private long ndaCount;
    private long totalDocumentCount;

    // 활성(진행중/서명됨) 개수
    private long activeEmploymentCount;
    private long activeServiceCount;
    private long activeOutsourcingCount;
    private long activeSupplyCount;
    private long activeNdaCount;
    private long totalActiveCount;

    // 기간/진행 속도 (일 단위 평균)
    private Double avgEmploymentDurationDays;
    private Double avgEmploymentProposalToSignDays;
    private Double avgServiceDurationDays;
    private Double avgOutsourcingDurationDays;

    // 금액 합계(원)
    private Double totalServiceAmount;
    private Double totalOutsourcingAmount;
    private Double totalSupplyAmount; // SupplyItem.amount 합계
    private Double grandTotalAmount;  // 위 금액 합계
}

