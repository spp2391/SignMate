package org.zerock.signmate.Contract2.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.zerock.signmate.Contract.domain.CommonEntity;
import org.zerock.signmate.Contract.domain.Contract;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "nda_contract")
@EntityListeners(AuditingEntityListener.class)
public class NDAContract extends CommonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 기본 계약 정보 연동 (필요 시)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id")
    private Contract contract;

    // 문서 제목
    @Column(length = 255)
    private String documentTitle;

    // 공개자 (갑 대표자)
    @Column(length = 100)
    private String discloserName;

    @Column(length = 255)
    private String discloserAddress;

    // 수신자 (을 대표자)
    @Column(length = 100)
    private String receiverName;

    @Column(length = 255)
    private String receiverAddress;

    // 발효일
    private LocalDate effectiveDate;

    // 정보 제공 목적
    @Column(columnDefinition = "TEXT")
    private String informationPurpose;

    // 계약기간(개월)
    private Integer contractPeriodMonths;

    // 비밀유지 준수기간(년)
    private Integer confidentialityPeriodYears;

    // 준거법 (예: 대한민국 법)
    @Column(length = 100)
    private String governingLaw;

    // 추가 조항
    @Column(columnDefinition = "TEXT")
    private String additionalClauses;

    // 서명: 갑, 을 서명란
    @Column(length = 100)
    private String discloserSignature;

    @Column(length = 100)
    private String receiverSignature;

}
