package org.zerock.signmate.Contract.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
@Entity
@Table(name = "service_contract")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // 자동 증가 PK
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", unique = true)  // FK 컬럼명, unique 제약도 걸어 1:1 보장
    private Contract contract;

    private String clientName;
    private String projectName;

    private LocalDate contractStartDate;
    private LocalDate contractEndDate;

    private String totalAmount;
    private String advancePayment;
    private String interimPayment;
    private String finalPayment;

    @Column(columnDefinition = "TEXT")
    private String paymentTerms;

    private Boolean taxInvoice;
    private String paymentMethod;

    @Column(columnDefinition = "TEXT")
    private String workDescription;
    private Boolean deliverOriginalFiles;

    private Integer revisionCount;
    private LocalDate deliveryDeadline;

    @Column(columnDefinition = "TEXT")
    private String otherNotes;

    private LocalDate contractDate;
}


