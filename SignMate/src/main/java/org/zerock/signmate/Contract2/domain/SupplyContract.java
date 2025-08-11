package org.zerock.signmate.Contract2.domain;

import jakarta.persistence.*;
import lombok.*;
import org.zerock.signmate.Contract.domain.CommonEntity;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "supply_contract")
public class SupplyContract extends CommonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 공급자(갑)
    private String supplierName;           // 공급자 명칭
    private String supplierRepresentative; // 공급자 대표자명

    // 수요자(을)
    private String demanderName;            // 수요자 명칭
    private String demanderRepresentative; // 수요자 대표자명

    private LocalDate contractDate;         // 계약일자
    private String deliveryLocation;        // 인도 장소

    @Column(columnDefinition = "TEXT")
    private String itemListDescription;    // 품목 내역 표 요약 (실제로 품목별 상세는 별도 테이블 권장)

    @Column(columnDefinition = "TEXT")
    private String deliveryTerms;           // 인도조건

    @Column(columnDefinition = "TEXT")
    private String inspectionAndWarranty;  // 검수 및 하자보수 관련 조건

    @Column(columnDefinition = "TEXT")
    private String paymentTerms;            // 대금 및 지급 조건

    @Column(columnDefinition = "TEXT")
    private String qualityGuaranteeTerms;  // 품질보증 등 조건

    @Column(columnDefinition = "TEXT")
    private String otherTerms;              // 기타 조항

}
