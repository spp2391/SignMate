// src/main/java/org/zerock/signmate/Contract/dto/UserDashboardDTO.java
package org.zerock.signmate.Contract.dto;

import lombok.*;
import java.util.Map;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class UserDashboardDTO {
    private long totalContracts;      // 전체 개수
    private long activeContracts;     // 진행중
    private long completedContracts;  // 완료
    private double totalAmount;       // 총 금액(가능한 항목만 합산)

    // 차트용
    private Map<String, Long> countsByType;    // 타입별 개수: SERVICE/STANDARD/SUPPLY/SECRET/OUTSOURCING
    private Map<String, Double> amountsByType; // 타입별 금액 합 (있을 때만)
}
