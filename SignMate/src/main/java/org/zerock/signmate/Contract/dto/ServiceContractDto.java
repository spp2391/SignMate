package org.zerock.signmate.Contract.dto;

import lombok.*;
import org.zerock.signmate.Contract.domain.ServiceContract;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceContractDto {
    private Long id;
    private Long contractId;

    private String writerName;
    private String receiverName;

    private String clientName;
    private String projectName;

    private LocalDate contractStartDate;
    private LocalDate contractEndDate;

    private String totalAmount;
    private String advancePayment;
    private String interimPayment;
    private String finalPayment;

    private String paymentTerms;

    private Boolean taxInvoice;
    private String paymentMethod;

    private String workDescription;
    private Boolean deliverOriginalFiles;

    private Integer revisionCount;
    private LocalDate deliveryDeadline;

    private String otherNotes;

    private LocalDate contractDate;

    private String status; // enum을 String으로 변환해서 전달

    private Long writerId;

    private Long receiverId;

    public static ServiceContractDto fromEntity(ServiceContract entity) {
        return ServiceContractDto.builder()
                .id(entity.getId())
                .contractId(entity.getContract().getId())
                .writerName(entity.getContract().getWriter().getName())
                .receiverName(entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getName() : null)
                .clientName(entity.getClientName())
                .projectName(entity.getProjectName())
                .contractStartDate(entity.getContractStartDate())
                .contractEndDate(entity.getContractEndDate())
                .totalAmount(entity.getTotalAmount())
                .advancePayment(entity.getAdvancePayment())
                .interimPayment(entity.getInterimPayment())
                .finalPayment(entity.getFinalPayment())
                .paymentTerms(entity.getPaymentTerms())
                .taxInvoice(entity.getTaxInvoice())
                .paymentMethod(entity.getPaymentMethod())
                .workDescription(entity.getWorkDescription())
                .deliverOriginalFiles(entity.getDeliverOriginalFiles())
                .revisionCount(entity.getRevisionCount())
                .deliveryDeadline(entity.getDeliveryDeadline())
                .otherNotes(entity.getOtherNotes())
                .contractDate(entity.getContractDate())
                .status(entity.getStatus() != null ? entity.getStatus().toString() : null)
                .build();
    }
}
