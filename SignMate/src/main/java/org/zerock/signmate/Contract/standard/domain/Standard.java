package org.zerock.signmate.Contract.standard.domain;

import jakarta.persistence.*;
import lombok.*;
import org.zerock.signmate.Contract.domain.CommonEntity;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.user.domain.User;

import java.time.temporal.ChronoUnit;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "standard_employment_contract")
public class Standard extends CommonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id")
    private Contract contract;

    // 사업주 / 회사명
    private String employerName;             // #1 사업주(회사명)
    private String employerRepresentative;  // #30 대표자
    private String employerAddress;          // #31 사업주 주소

    // 근로자
    private String employeeName;             // #2 근로자 성명
    private String employeeAddress;          // #33 근로자 주소
    private String employeeContact;          // #34 근로자 연락처

    // 근로개시일 (년/월/일)
    private Integer workStartYear;           // #3 근로개시 년
    private Integer workStartMonth;          // #4 근로개시 월
    private Integer workStartDay;            // #5 근로개시 일

    // 근무 장소
    private String workLocation;             // #6 근무 장소

    // 업무 내용
    @Column(columnDefinition = "TEXT")
    private String workDescription;          // #7 업무 내용

    // 소정 근로시간
    private Integer workStartHour;           // #8 소정근로 시작 시 (정수시)
    private Integer workEndHour;             // #9 소정근로 종료 시 (정수시)

    // 휴게시간
    private Integer breakHour;                // #10 휴게(시)
    private Integer breakMinute;              // #11 휴게(분)

    // 근무일 및 주휴일
    private String workDays;                  // #12 근무일 (예: 월~금)
    private String weeklyHoliday;             // #13 주휴일 (예: 일)

    // 임금
    private String wageAmount;                // #14 임금 (월/시급)
    private String bonus;                     // #15 상여금 (있을 시 금액/율)
    private String otherAllowance;            // #16 기타수당 (제수당 등)
    private String wagePaymentDate;           // #17 임금지급일 (예: 매월 n일)
    private String paymentMethod;             // #18 지급방법 (예: 통장입금)

    // 사회보험 적용 여부
    private Boolean nationalPension;          // #23 국민연금
    private Boolean healthInsurance;          // #24 건강보험
    private Boolean employmentInsurance;      // #25 고용보험
    private Boolean industrialAccidentInsurance; // #26 산재보험

    // 전자서명 - 사업주, 근로자 (Base64 문자열 저장)
    @Lob
    @Column(name = "writer_signature", columnDefinition = "LONGTEXT")
    private String writerSignature;  // base64

    @Lob
    @Column(name = "receiver_signature", columnDefinition = "LONGTEXT")
    private String receiverSignature; // base64

//    // 내 문서 조회시에 필요
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "writer_id", nullable = false)
//    private User writer;
}
