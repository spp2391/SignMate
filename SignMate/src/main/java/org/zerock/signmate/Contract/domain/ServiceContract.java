package org.zerock.signmate.Contract.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
@Entity
@Table(name = "service_contract")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceContract extends CommonEntity{
    // 공통적인 칼럼들
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id")
    private Contract contract;

    private String clientName;
    private String projectName;
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private LocalDate deliveryDeadline;
    private LocalDate contractDate;
    @Enumerated(EnumType.STRING)
    private enums.ContractStatus status; // DRAFT, PENDING, SIGNED
    @Column(length = 255)
    private String url;  // 계약서 고유 링크 URL 저장


    // 개별적인 칼럼들
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
    @Column(columnDefinition = "TEXT")
    private String otherNotes;

}


