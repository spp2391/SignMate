package org.zerock.signmate.finance.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "company_financials")
public class CompanyFinancial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;        // 기업명
    private LocalDate periodStart;     // 회계 기간 시작일
    private LocalDate periodEnd;       // 회계 기간 종료일

    private Double revenue;            // 매출
    private Double cost;               // 비용

    // ======================
    // 편의 메서드
    // ======================
    public Double getProfit() {
        if (revenue == null || cost == null) return 0.0;
        return revenue - cost;
    }

    public Double getProfitMargin() {
        if (revenue == null || revenue == 0) return 0.0;
        return (revenue - cost) / revenue * 100;
    }

    public double getTotalCost() {
        return cost != null ? cost : 0.0;
    }
}
