package org.zerock.signmate.Contract.newservice.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.zerock.signmate.Contract.newservice.domain.ServiceContractDocument;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewServiceDTO {

    private Long id;
    private Long contractId;

    private String clientName;
    private String clientRepresentative;
    private String clientAddress;

    private String contractorName;
    private String contractorRepresentative;
    private String contractorAddress;

    private String projectName;

    private LocalDate contractStartDate;
    private LocalDate contractEndDate;

    private BigDecimal contractAmount;
    private String contractAmountKRW;

    private String scopeOfWork;
    private String deliverablesAcceptanceCriteria;

    private BigDecimal depositAmount;
    private BigDecimal interimPaymentAmount;
    private Integer finalPaymentDueDays;

    private Integer warrantyMonths;
    private BigDecimal delayPenaltyRate;

    private LocalDate signatureDate;

    private String writerSignature;
    private String receiverSignature;


    // SecretDTO와 동일하게 엔티티 → DTO 변환
    public static NewServiceDTO fromEntity(ServiceContractDocument entity) {
        return NewServiceDTO.builder()
                .id(entity.getId())
                .contractId(entity.getContract() != null ? entity.getContract().getId() : null)
                .clientName(entity.getContract().getWriter().getName())
                .clientRepresentative(entity.getClientRepresentative())
                .clientAddress(entity.getClientAddress())
                .contractorName(entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getName() : null)
                .contractorRepresentative(entity.getContractorRepresentative())
                .contractorAddress(entity.getContractorAddress())
                .projectName(entity.getProjectName())
                .contractStartDate(entity.getContractStartDate())
                .contractEndDate(entity.getContractEndDate())
                .contractAmount(entity.getContractAmount())
                .contractAmountKRW(entity.getContractAmountKRW())
                .scopeOfWork(entity.getScopeOfWork())
                .deliverablesAcceptanceCriteria(entity.getDeliverablesAcceptanceCriteria())
                .depositAmount(entity.getDepositAmount())
                .interimPaymentAmount(entity.getInterimPaymentAmount())
                .finalPaymentDueDays(entity.getFinalPaymentDueDays())
                .warrantyMonths(entity.getWarrantyMonths())
                .delayPenaltyRate(entity.getDelayPenaltyRate())
                .signatureDate(entity.getSignatureDate())
                .writerSignature(entity.getWriterSignature())
                .receiverSignature(entity.getReceiverSignature())
                .build();
    }
}
