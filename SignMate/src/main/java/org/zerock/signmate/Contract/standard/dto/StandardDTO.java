package org.zerock.signmate.Contract.standard.dto;

import lombok.*;
import org.zerock.signmate.Contract.standard.domain.Standard;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StandardDTO {

    private Long id;
    private Long contractId;

    // 사업주
    private String employerName;             // 회사명
    private String employerRepresentative;   // 대표자
    private String employerAddress;          // 사업주 주소

    // 근로자
    private String employeeName;             // 근로자 성명
    private String employeeAddress;          // 근로자 주소
    private String employeeContact;          // 근로자 연락처

    // 근로개시일
    private Integer workStartYear;
    private Integer workStartMonth;
    private Integer workStartDay;

    // 근무 장소
    private String workLocation;

    // 업무 내용
    private String workDescription;

    // 소정 근로시간
    private Integer workStartHour;
    private Integer workEndHour;

    // 휴게시간
    private Integer breakHour;
    private Integer breakMinute;

    // 근무일 및 주휴일
    private String workDays;
    private String weeklyHoliday;

    // 임금
    private String wageAmount;
    private String bonus;
    private String otherAllowance;
    private String wagePaymentDate;
    private String paymentMethod;

    // 사회보험
    private Boolean nationalPension;
    private Boolean healthInsurance;
    private Boolean employmentInsurance;
    private Boolean industrialAccidentInsurance;

    // 서명 (base64)
    private String writerSignature;
    private String receiverSignature;

    public static StandardDTO fromEntity(Standard entity) {
        return StandardDTO.builder()
                .id(entity.getId())
                .contractId(entity.getContract().getId())
                .employerName(entity.getContract().getWriter().getName())
                .employerRepresentative(entity.getEmployerRepresentative())
                .employerAddress(entity.getEmployerAddress())
                .employeeName(entity.getContract().getReceiver()!= null ? entity.getContract().getReceiver().getName() : null)
                .employeeAddress(entity.getEmployeeAddress())
                .employeeContact(entity.getEmployeeContact())
                .workStartYear(entity.getWorkStartYear())
                .workStartMonth(entity.getWorkStartMonth())
                .workStartDay(entity.getWorkStartDay())
                .workLocation(entity.getWorkLocation())
                .workDescription(entity.getWorkDescription())
                .workStartHour(entity.getWorkStartHour())
                .workEndHour(entity.getWorkEndHour())
                .breakHour(entity.getBreakHour())
                .breakMinute(entity.getBreakMinute())
                .workDays(entity.getWorkDays())
                .weeklyHoliday(entity.getWeeklyHoliday())
                .wageAmount(entity.getWageAmount())
                .bonus(entity.getBonus())
                .otherAllowance(entity.getOtherAllowance())
                .wagePaymentDate(entity.getWagePaymentDate())
                .paymentMethod(entity.getPaymentMethod())
                .nationalPension(entity.getNationalPension())
                .healthInsurance(entity.getHealthInsurance())
                .employmentInsurance(entity.getEmploymentInsurance())
                .industrialAccidentInsurance(entity.getIndustrialAccidentInsurance())
                .writerSignature(entity.getWriterSignature())
                .receiverSignature(entity.getReceiverSignature())
                .build();
    }
}
