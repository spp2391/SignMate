package org.zerock.signmate.unified.mapper;

import org.springframework.stereotype.Component;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.unified.dto.UnifiedContractDto;
import org.zerock.signmate.Contract.business.domain.BusinessOutsourcingContract;
import org.zerock.signmate.Contract.newservice.domain.ServiceContractDocument;
import org.zerock.signmate.Contract.secret.domain.Secret;
import org.zerock.signmate.Contract.supply.domain.SupplyContract;
import org.zerock.signmate.Contract.standard.domain.Standard;

import java.time.LocalDate;

@Component
public class UnifiedContractMapper {

    // 기존 서비스 계약
    public static UnifiedContractDto fromService(ServiceContractDocument entity, Contract contract) {
        return UnifiedContractDto.builder()
                .id(entity.getId())
                .contractId(entity.getContract() != null ? entity.getContract().getId() : null)
                .contractType("SERVICE")
                .writerName(entity.getContract() != null && entity.getContract().getWriter() != null ? entity.getContract().getWriter().getName() : null)
                .receiverName(entity.getContract() != null && entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getName() : null)
                .contractStartDate(contract.getCreatedAt())
                .contractEndDate(contract.getUpdatedAt())
                .Address(entity.getContractorAddress())
                .status(String.valueOf(contract.getStatus()))
                .writerId(entity.getContract() != null && entity.getContract().getWriter() != null ? entity.getContract().getWriter().getUserId() : null)
                .receiverId(entity.getContract() != null && entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getUserId() : null)
                .build();
    }

    // 표준 계약
    public static UnifiedContractDto fromStandard(Standard entity, Contract contract) {
        return UnifiedContractDto.builder()
                .id(entity.getId())
                .contractId(entity.getContract() != null ? entity.getContract().getId() : null)
                .contractType("EMPLOYMENT")
                .writerName(entity.getContract() != null && entity.getContract().getWriter() != null ? entity.getContract().getWriter().getName() : null)
                .receiverName(entity.getContract() != null && entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getName() : null)
                .contractStartDate(contract.getCreatedAt())
                .contractEndDate(contract.getUpdatedAt())
                .Address(entity.getEmployerAddress())
                .status(String.valueOf(contract.getStatus()))
                .writerId(entity.getContract() != null && entity.getContract().getWriter() != null ? entity.getContract().getWriter().getUserId() : null)
                .receiverId(entity.getContract() != null && entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getUserId() : null)
                .build();
    }

    // BusinessOutsourcing 계약
    public static UnifiedContractDto fromBusiness(BusinessOutsourcingContract entity, Contract contract) {
        return UnifiedContractDto.builder()
                .id(entity.getId())
                .contractId(entity.getContract() != null ? entity.getContract().getId() : null)
                .contractType("OUTSOURCING")
                .writerName(entity.getContract() != null && entity.getContract().getWriter() != null ? entity.getContract().getWriter().getName() : null)
                .receiverName(entity.getContract() != null && entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getName() : null)
                .contractStartDate(contract.getCreatedAt())
                .contractEndDate(contract.getUpdatedAt())
                .totalAmount(entity.getTotalPaymentAmount() != null ? entity.getTotalPaymentAmount().toString() : null)
                .Address(entity.getContractorAddress())
                .status(String.valueOf(contract.getStatus()))
                .writerId(entity.getContract() != null && entity.getContract().getWriter() != null ? entity.getContract().getWriter().getUserId() : null)
                .receiverId(entity.getContract() != null && entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getUserId() : null)
                .build();
    }

    // Secret 계약
    public static UnifiedContractDto fromSecret(Secret entity, Contract contract) {
        return UnifiedContractDto.builder()
                .id(entity.getId())
                .contractId(entity.getContract() != null ? entity.getContract().getId() : null)
                .contractType("SECRET")
                .writerName(entity.getContract() != null && entity.getContract().getWriter() != null ? entity.getContract().getWriter().getName() : null)
                .receiverName(entity.getContract() != null && entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getName() : null)
                .contractStartDate(contract.getCreatedAt())
                .contractEndDate(contract.getUpdatedAt())
                .status(String.valueOf(contract.getStatus()))
                .Address(entity.getReceiverAddress() != null ? entity.getReceiverAddress() : null)
                .writerId(entity.getContract() != null && entity.getContract().getWriter() != null ? entity.getContract().getWriter().getUserId() : null)
                .receiverId(entity.getContract() != null && entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getUserId() : null)
                .build();
    }

    // Supply 계약
    public static UnifiedContractDto fromSupply(SupplyContract entity, Contract contract) {
        return UnifiedContractDto.builder()
                .id(entity.getId())
                .contractId(entity.getContract() != null ? entity.getContract().getId() : null)
                .contractType("SUPPLY")
                .writerName(entity.getSupplierName())
                .receiverName(entity.getDemanderName())
                .Address(entity.getDeliveryLocation())
                .contractStartDate(contract.getCreatedAt())
                .contractEndDate(contract.getUpdatedAt())
                .status(String.valueOf(contract.getStatus()))
                .totalAmount(null)
                .writerId(entity.getContract() != null && entity.getContract().getWriter() != null ? entity.getContract().getWriter().getUserId() : null)
                .receiverId(entity.getContract() != null && entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getUserId() : null)
                .build();
    }

    // 🔹 통합 toDto 메서드
//    public UnifiedContractDto toDto(Object entity) {
//        if (entity instanceof Standard s) return fromStandard(s);
//        if (entity instanceof BusinessOutsourcingContract b) return fromBusiness(b);
//        if (entity instanceof Secret sec) return fromSecret(sec);
//        if (entity instanceof SupplyContract sp) return fromSupply(sp);
//        if (entity instanceof ServiceContractDto svc) return fromService(svc);
//        throw new IllegalArgumentException("Unknown contract type: " + entity.getClass());
//    }
}
