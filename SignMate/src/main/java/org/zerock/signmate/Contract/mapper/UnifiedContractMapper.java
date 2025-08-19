package org.zerock.signmate.Contract.mapper;

import org.springframework.stereotype.Component;
import org.zerock.signmate.Contract.dto.UnifiedContractDto;
import org.zerock.signmate.Contract.business.domain.BusinessOutsourcingContract;
import org.zerock.signmate.Contract.secret.domain.Secret;
import org.zerock.signmate.Contract.supply.domain.SupplyContract;
import org.zerock.signmate.Contract.standard.domain.Standard;
import org.zerock.signmate.Contract.dto.ServiceContractDto;

import java.time.LocalDate;

@Component
public class UnifiedContractMapper {

    // 기존 서비스 계약
    public UnifiedContractDto fromService(ServiceContractDto entity) {
        return UnifiedContractDto.builder()
                .id(entity.getId())
                .contractId(entity.getContractId())
                .contractType("SERVICE")
                .writerName(entity.getWriterName())
                .receiverName(entity.getReceiverName())
                .clientName(entity.getClientName())
                .projectName(entity.getProjectName())
                .contractStartDate(entity.getContractStartDate())
                .contractEndDate(entity.getContractEndDate())
                .workDescription(entity.getWorkDescription())
                .deliverOriginalFiles(entity.getDeliverOriginalFiles())
                .totalAmount(entity.getTotalAmount())
                .advancePayment(entity.getAdvancePayment())
                .interimPayment(entity.getInterimPayment())
                .finalPayment(entity.getFinalPayment())
                .paymentTerms(entity.getPaymentTerms())
                .taxInvoice(entity.getTaxInvoice())
                .paymentMethod(entity.getPaymentMethod())
                .status(entity.getStatus())
                .contractDate(entity.getContractDate())
                .writerId(entity.getWriterId())
                .receiverId(entity.getReceiverId())
                .build();
    }

    // 표준 계약
    public static UnifiedContractDto fromStandard(Standard entity) {
        return UnifiedContractDto.builder()
                .id(entity.getId())
                .contractId(entity.getContract() != null ? entity.getContract().getId() : null)
                .contractType("STANDARD")
                .writerName(entity.getContract() != null && entity.getContract().getWriter() != null ? entity.getContract().getWriter().getName() : null)
                .receiverName(entity.getContract() != null && entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getName() : null)
                .workDescription(entity.getWorkDescription())
                .contractStartDate(LocalDate.of(entity.getWorkStartYear(), entity.getWorkStartMonth(), entity.getWorkStartDay()))

                .status(null)
                .writerId(entity.getContract() != null && entity.getContract().getWriter() != null ? entity.getContract().getWriter().getUserId() : null)
                .receiverId(entity.getContract() != null && entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getUserId() : null)
                .build();
    }

    // BusinessOutsourcing 계약
    public UnifiedContractDto fromBusiness(BusinessOutsourcingContract entity) {
        return UnifiedContractDto.builder()
                .id(entity.getId())
                .contractId(entity.getContract() != null ? entity.getContract().getId() : null)
                .contractType("BUSINESS_OUTSOURCING")
                .writerName(entity.getContractorName())
                .receiverName(entity.getClientName())
                .clientName(entity.getClientName())
                .projectName(null)
                .contractStartDate(entity.getContractStartDate())
                .contractEndDate(entity.getContractEndDate())
                .workDescription(entity.getTaskDescription())
                .totalAmount(entity.getTotalPaymentAmount() != null ? entity.getTotalPaymentAmount().toString() : null)
                .status(null)
                .contractDate(entity.getSignatureDate())
                .writerId(entity.getContract() != null && entity.getContract().getWriter() != null ? entity.getContract().getWriter().getUserId() : null)
                .receiverId(entity.getContract() != null && entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getUserId() : null)
                .build();
    }

    // Secret 계약
    public static UnifiedContractDto fromSecret(Secret entity) {
        LocalDate endDate = null;
        if (entity.getEffectiveDate() != null && entity.getContractDurationMonths() != null) {
            endDate = entity.getEffectiveDate().plusMonths(entity.getContractDurationMonths());
        }

        return UnifiedContractDto.builder()
                .id(entity.getId())
                .contractId(entity.getContract() != null ? entity.getContract().getId() : null)
                .contractType("SECRET")
                .writerName(entity.getDiscloserRepresentative())
                .receiverName(entity.getReceiverRepresentative())
                .workDescription(entity.getPurpose())
                .contractStartDate(entity.getEffectiveDate())
                .contractEndDate(endDate)
                .status(null)
                .contractDate(null)
                .writerId(entity.getContract() != null && entity.getContract().getWriter() != null ? entity.getContract().getWriter().getUserId() : null)
                .receiverId(entity.getContract() != null && entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getUserId() : null)
                .build();
    }

    // Supply 계약
    public static UnifiedContractDto fromSupply(SupplyContract entity) {
        return UnifiedContractDto.builder()
                .id(entity.getId())
                .contractId(entity.getContract() != null ? entity.getContract().getId() : null)
                .contractType("SUPPLY")
                .writerName(entity.getSupplierName())
                .receiverName(entity.getDemanderName())
                .workDescription(entity.getDeliveryTerms())
                .contractStartDate(entity.getContractDate())
                .contractEndDate(entity.getContractDate())
                .totalAmount(null)
                .status(null)
                .contractDate(entity.getContractDate())
                .writerId(entity.getContract() != null && entity.getContract().getWriter() != null ? entity.getContract().getWriter().getUserId() : null)
                .receiverId(entity.getContract() != null && entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getUserId() : null)
                .build();
    }

    // 🔹 통합 toDto 메서드
    public UnifiedContractDto toDto(Object entity) {
        if (entity instanceof Standard s) return fromStandard(s);
        if (entity instanceof BusinessOutsourcingContract b) return fromBusiness(b);
        if (entity instanceof Secret sec) return fromSecret(sec);
        if (entity instanceof SupplyContract sp) return fromSupply(sp);
        if (entity instanceof ServiceContractDto svc) return fromService(svc);
        throw new IllegalArgumentException("Unknown contract type: " + entity.getClass());
    }
}
