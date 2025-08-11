package org.zerock.signmate.Contract2.domain;

import jakarta.persistence.*;
import lombok.*;
import org.zerock.signmate.Contract.domain.CommonEntity;
import org.zerock.signmate.user.domain.User;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "standard_employment_contract")
public class StandardEmploymentContract extends CommonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 사업주 정보
    private String employerName;           // 사업주
    private String employerRepresentative; // 대표자
    private String employerAddress;        // 주소

    // 근로자 정보
    private String employeeName;            // 근로자명
    private String employeeAddress;         // 주소
    private String employeeContact;         // 연락처

    // 근로 조건
    private LocalDate workStartDate;        // 근로개시일

    private String workLocation;            // 근무 장소
    @Column(columnDefinition = "TEXT")
    private String workDescription;         // 업무 내용

    private LocalTime workStartTime;        // 소정근로시간 시작 시각
    private LocalTime workEndTime;          // 소정근로시간 종료 시각

    private LocalTime breakStartTime;       // 휴게시간 시작 시각
    private LocalTime breakEndTime;         // 휴게시간 종료 시각

    private String workDays;                // 근무일 (ex. "월~금")
    private String weeklyHoliday;           // 주휴일 (ex. "일요일")

    // 임금 관련
    private String wageAmount;              // 임금 (월/시간)
    private String bonus;                   // 상여금
    private String otherAllowance;          // 기타 수당(제수당 등)
    private String wagePaymentDate;         // 임금지급일
    private String paymentMethod;           // 지급방법 (예: 통장입금)

    private String annualLeavePolicy;       // 연차유급휴가 (예: 근로기준법에 따름)

    // 사회보험 적용 여부
    private Boolean nationalPension;        // 국민연금 적용 여부
    private Boolean healthInsurance;        // 건강보험 적용 여부
    private Boolean employmentInsurance;    // 고용보험 적용 여부
    private Boolean industrialAccidentInsurance; // 산재보험 적용 여부

    private Boolean contractCopyProvided;   // 근로계약서 사본 교부 여부

    @Column(columnDefinition = "TEXT")
    private String complianceClause;        // 성실한 이행 (예: 근로계약·취업규칙 준수)

    @Column(columnDefinition = "TEXT")
    private String otherTerms;               // 기타 조항
}
