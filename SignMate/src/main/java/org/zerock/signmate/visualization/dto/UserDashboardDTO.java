package org.zerock.signmate.visualization.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDashboardDTO {
    private long totalContracts;        // 전체 계약 개수
    private long activeContracts;       // 진행중 계약
    private long completedContracts;    // 종료된 계약

    private long standardCount;
    private long secretCount;
    private long supplyCount;
    private long outsourcingCount;

    private Double totalAmount;         // 총 계약 금액 (옵션)
}
