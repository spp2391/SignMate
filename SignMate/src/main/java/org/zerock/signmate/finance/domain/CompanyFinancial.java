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

    // 편의용, DB 계산 안 하고 바로 사용 가능
    public Double getProfit() {
        return revenue - cost;
    }

    public Double getProfitMargin() {
        if (revenue == 0) return 0.0;
        return (revenue - cost) / revenue * 100;
    }
}

