package org.zerock.signmate.Contract.business.domain;

import jakarta.persistence.*;
import lombok.*;
import org.zerock.signmate.Contract.domain.CommonEntity;
import org.zerock.signmate.Contract.domain.Contract;

import java.math.BigDecimal;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id")
    private Contract contract;

    // 갑 (위탁자)
    private String clientName;             // “갑” 명칭
    private String clientAddress;          // 주소
    private String clientRepresentative;  // 대표자명
    private String clientContact;          // 연락처

    // 을 (수탁자)
    private String contractorName;         // “을” 명칭
    private String contractorAddress;      // 주소
    private String contractorRepresentative; // 대표자명
    private String contractorContact;      // 연락처

    // 계약 기간
    private LocalDate contractStartDate;   // 수행기간 시작일
    private LocalDate contractEndDate;     // 수행기간 종료일

    // 총 지급액 (합계)
    private BigDecimal totalPaymentAmount;

    // 업무 내용
    @Column(columnDefinition = "TEXT")
    private String taskDescription;

    private String governingLaw;  // 준거법 (예: "대한민국 법")

    private LocalDate signatureDate;  // 서명일

    @Lob
    @Column(name = "writer_signature", columnDefinition = "LONGTEXT")
    private String writerSignature;  // base64

    @Lob
    @Column(name = "receiver_signature", columnDefinition = "LONGTEXT")
    private String receiverSignature; // base64

    // 정산 내역 목록 (1:N 관계)
    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BusinessOutsourcingTask> tasks = new ArrayList<>();

    // 상태 및 이력

}
