package org.zerock.signmate.Contract2.domain;

import jakarta.persistence.*;
import lombok.*;
import org.zerock.signmate.Contract.domain.CommonEntity;
import org.zerock.signmate.Contract.domain.enums;

import java.time.LocalDate;

@Entity
@Table(name = "nda_contract")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NDAContract extends CommonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 공개자(갑)
    private String discloserName;
    private String discloserRepresentative;
    private String discloserAddress;

    // 수신자(을)
    private String recipientName;
    private String recipientRepresentative;
    private String recipientAddress;

    // 목적 및 법적 조건
    @Column(columnDefinition = "TEXT")
    private String purpose;
    private LocalDate effectiveDate;           // 발효일
    private Integer contractPeriodMonths;      // 계약기간(개월)
    private Integer confidentialityYears;      // 비밀유지 존속기간(년)
//    private LocalDate contractEndDate;         // 계약 종료일
//    private LocalDate confidentialityEndDate;  // 비밀유지 종료일
    private String governingLaw;               // 준거법

    // 서명 정보
    private String signatureMethod;            // 서명 방식(전자서명, 도장 등)
    private LocalDate discloserSignDate;
    private LocalDate recipientSignDate;

    // 상태 및 이력
    @Enumerated(EnumType.STRING)
    private enums.ContractStatus status;       // DRAFT, SIGNED, TERMINATED
    private Integer version;                   // 계약 버전

    // 부가 정보
    private String attachmentUrl;              // 서명본/원본 파일 경로
}
