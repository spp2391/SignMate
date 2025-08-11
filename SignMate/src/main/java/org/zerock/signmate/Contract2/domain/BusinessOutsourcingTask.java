package org.zerock.signmate.Contract2.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "business_outsourcing_task")
public class BusinessOutsourcingTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 업무위탁 계약과 다대일 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id")
    private BusinessOutsourcingContract contract;

    private String category;        // 구분
    private BigDecimal unitPrice;   // 단가
    private Integer quantity;       // 수량
    private String perUnit;         // 1인/1건당 (단위 설명)
    private BigDecimal paymentAmount; // 지급액
    private String taskType;        // 업무구분
    private String remarks;         // 비고
}
