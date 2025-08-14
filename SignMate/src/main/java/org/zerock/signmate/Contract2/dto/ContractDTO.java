package org.zerock.signmate.Contract2.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractDTO {
    private Long id;
    private String employerName;
    private String employeeName;
    private LocalDate workStartDate;
    private LocalDate workEndDate;
    private Double contractAmount;
    private String status;
}
