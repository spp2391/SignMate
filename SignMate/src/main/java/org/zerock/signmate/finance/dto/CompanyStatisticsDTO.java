package org.zerock.signmate.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyStatisticsDTO {
    private String companyName;

    // 기업 활동 지표
    private long relationshipLength;        // 거래 관계 지속 기간 (일)
    private long activeContracts;           // 진행 중 계약 수
    private double averageContractDuration; // 평균 계약 기간 (일)
    private double averageProposalToSignDays; // 계약 진행 속도 (제안→서명 평균 일수)

    // 재무 지표
    private double profitMargin;             // 이익률 (%)
    private double totalCost;                // 총 비용
    private double annualRevenueGrowth;      // 연 매출 성장률 (%)
    private double contractMarginRate;       // 계약별 마진율 (%)
}
