package org.zerock.signmate.Contract2.domain;

import jakarta.persistence.*;
import lombok.*;
import org.zerock.signmate.Contract.domain.CommonEntity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "business_outsourcing_contract")
public class BusinessOutsourcingContract extends CommonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 갑 (발주자)
    private String clientName;             // “갑” 명칭
    private String clientAddress;          // 주소
    private String clientRepresentative;  // 대표자명
    private String clientContact;          // 연락처

    // 을 (수행자)
    private String contractorName;         // “을” 명칭
    private String contractorAddress;      // 주소
    private String contractorRepresentative; // 대표자명
    private String contractorContact;      // 연락처

    // 계약 기간
    private LocalDate contractStartDate;   // 수행기간 시작일
    private LocalDate contractEndDate;     // 수행기간 종료일

    // 업무 내용 (TEXT)
    @Column(columnDefinition = "TEXT")
    private String taskDescription;

    // 비밀유지 및 지식재산권 관련 조항
    @Column(columnDefinition = "TEXT")
    private String confidentialityAndIP;

    // 보고 및 관리 관련 조항
    @Column(columnDefinition = "TEXT")
    private String reportingAndManagement;

    // 계약 해지 조건
    @Column(columnDefinition = "TEXT")
    private String contractTermination;

    // 기타 조항
    @Column(columnDefinition = "TEXT")
    private String otherTerms;

    // 업무 내역 목록 (1:N 관계)
    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BusinessOutsourcingTask> tasks = new ArrayList<>();
}
