package org.zerock.signmate.Contract2.domain;

import jakarta.persistence.*;
import lombok.*;
import org.zerock.signmate.Contract.domain.CommonEntity;
import org.zerock.signmate.Contract.domain.enums;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "service_contract_document")
public class ServiceContractDocument extends CommonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 발주자(갑) 정보
    private String clientName;                // 발주자 명칭
    private String clientRepresentative;     // 발주자 대표자명
    private String clientAddress;             // 발주자 주소

    // 수행자(을) 정보
    private String contractorName;            // 수행자 명칭
    private String contractorRepresentative; // 수행자 대표자명
    private String contractorAddress;         // 수행자 주소

    private String projectName;                // 프로젝트명

    private LocalDate contractStartDate;      // 계약기간 시작일
    private LocalDate contractEndDate;        // 계약기간 종료일

    private BigDecimal contractAmount;        // 계약금액

    @Column(columnDefinition = "TEXT")
    private String scopeOfWork;               // 과업 범위

    @Column(columnDefinition = "TEXT")
    private String deliverablesAcceptanceCriteria; // 산출물/검수 기준

    // 대금지급
    private BigDecimal depositAmount;         // 계약금
    private BigDecimal interimPaymentAmount;  // 중도금
    private Integer finalPaymentDueDays;      // 잔금 지급기한 (검수 완료 후 n일 이내 지급)

    private Integer warrantyMonths;           // 하자보수 기간 (개월)

    /**
     * 지체상금 비율 (예: 0.05 = 5%)
     */
    private BigDecimal delayPenaltyRate;      // 지체상금 비율 (계약금액 대비 %)

    private LocalDate signatureDate;  // 서명일

    // 전자서명 (Base64 인코딩 이미지)
    @Lob
    @Column(name = "client_signature")
    private String clientSignature;           // 발주자 서명 (base64)

    @Lob
    @Column(name = "contractor_signature")
    private String contractorSignature;       // 수행자 서명 (base64)


}
