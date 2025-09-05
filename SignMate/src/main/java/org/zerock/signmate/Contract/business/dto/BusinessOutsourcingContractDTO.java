package org.zerock.signmate.Contract.business.dto;

import lombok.*;
import org.zerock.signmate.Contract.business.domain.BusinessOutsourcingContract;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessOutsourcingContractDTO {

    private Long id;
    private Long contractId; // Contract 연동 ID

    // 갑 (위탁자)
    private String clientName;
    private String clientAddress;
    private String clientRepresentative;
    private String clientContact;

    // 을 (수탁자)
    private String contractorName;
    private String contractorAddress;
    private String contractorRepresentative;
    private String contractorContact;

    // 계약 기간
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;

    // 총 지급액
    private BigDecimal totalPaymentAmount;

    // 업무 내용
    private String taskDescription;

    private String governingLaw;
    private LocalDate signatureDate;
    private String writerSignature;
    private String receiverSignature;

    // 업무 내역
    @Builder.Default
    private List<BusinessOutsourcingTaskDTO> tasks = new ArrayList<>();
    public static BusinessOutsourcingContractDTO fromEntity(BusinessOutsourcingContract entity) {
        return BusinessOutsourcingContractDTO.builder()
                .id(entity.getId())
                .contractId(entity.getContract() != null ? entity.getContract().getId() : null)
                .clientName(entity.getContract().getWriter().getName())
                .clientAddress(entity.getClientAddress())
                .clientRepresentative(entity.getClientRepresentative())
                .clientContact(entity.getClientContact())
                .contractorName(entity.getContract().getReceiver()!= null ? entity.getContract().getReceiver().getName() : null)
                .contractorAddress(entity.getContractorAddress())
                .contractorRepresentative(entity.getContractorRepresentative())
                .contractorContact(entity.getContractorContact())
                .contractStartDate(entity.getContractStartDate())
                .contractEndDate(entity.getContractEndDate())
                .totalPaymentAmount(entity.getTotalPaymentAmount())
                .taskDescription(entity.getTaskDescription())
                .governingLaw(entity.getGoverningLaw())
                .signatureDate(entity.getSignatureDate())
                .writerSignature(entity.getWriterSignature())
                .receiverSignature(entity.getReceiverSignature())
                .tasks(entity.getTasks() != null
                        ? entity.getTasks().stream()
                        .map(BusinessOutsourcingTaskDTO::fromEntity)
                        .collect(Collectors.toList())
                        : new ArrayList<>())
                .build();
    }
}
