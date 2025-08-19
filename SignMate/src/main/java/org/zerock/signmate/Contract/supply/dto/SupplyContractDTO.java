package org.zerock.signmate.Contract.supply.dto;

import lombok.*;
import org.zerock.signmate.Contract.supply.domain.SupplyContract;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplyContractDTO {

    private Long id;
    private Long contractId;  // SecretDTO와 동일하게 추가

    // 갑
    private String supplierName;
    private String supplierRepresentative;

    // 을
    private String demanderName;
    private String demanderRepresentative;

    private LocalDate contractDate;
    private String deliveryLocation;

    private String deliveryTerms;
    private String inspectionAndWarranty;
    private String paymentTerms;
    private String qualityGuaranteeTerms;
    private String otherTerms;

    private String supplierSignature;
    private String demanderSignature;

    private List<SupplyItemDTO> items;



    public static SupplyContractDTO fromEntity(SupplyContract entity) {
        return SupplyContractDTO.builder()
                .id(entity.getId())
                .contractId(entity.getContract() != null ? entity.getContract().getId() : null)  // contractId 반영
                .supplierName(entity.getContract().getWriter().getName())
                .supplierRepresentative(entity.getSupplierRepresentative())
                .demanderName(entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getName() : null)
                .demanderRepresentative(entity.getDemanderRepresentative())
                .contractDate(entity.getContractDate())
                .deliveryLocation(entity.getDeliveryLocation())
                .deliveryTerms(entity.getDeliveryTerms())
                .inspectionAndWarranty(entity.getInspectionAndWarranty())
                .paymentTerms(entity.getPaymentTerms())
                .qualityGuaranteeTerms(entity.getQualityGuaranteeTerms())
                .otherTerms(entity.getOtherTerms())
                .supplierSignature(entity.getSupplierSignature())
                .demanderSignature(entity.getDemanderSignature())
                .items(entity.getItems().stream()
                        .map(SupplyItemDTO::fromEntity)
                        .collect(Collectors.toList()))
                .build();
    }
}
