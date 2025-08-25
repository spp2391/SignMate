package org.zerock.signmate.finance.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CompanyContractSummaryDTO {
    private String company;               // 기업명
    private int totalContracts;           // 전체 계약 건수
    private BigDecimal totalAmount;       // 전체 계약 금액
    private int draftCount;               // DRAFT 건수
    private int signedCount;              // SIGNED/ACTIVE 건수
    private int terminatedCount;          // TERMINATED 건수
    private int totalItems;               // SupplyItem/Task 등 하위 항목 합계
    private double avgContractDurationDays; // 계약 기간 평균
}
