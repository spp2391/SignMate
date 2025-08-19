package org.zerock.signmate.Contract.secret.dto;

import lombok.*;
import org.zerock.signmate.Contract.secret.domain.Secret;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecretDTO {
    private Long id;
    private Long contractId;

    // 1. 당사자 정보
    private String writerName;               // User writer의 ID
    private String discloserRepresentative;
    private String discloserAddress;

    private String receiverName;             // User receiver의 ID
    private String receiverRepresentative;
    private String receiverAddress;

    // 2. 목적 (#7)
    private String purpose;

    // 6. 계약기간 - 발효일 (#8), 계약기간 개월수 (#9)
    private LocalDate effectiveDate;
    private Integer contractDurationMonths;

    // 7. 존속기간 (#10)
    private Integer confidentialityDurationYears;

    // 10. 준거법 및 관할 (#11)
    private String governingLaw;

    // 서명(base64)
    private String writerSignature;
    private String receiverSignature;

    public static SecretDTO fromEntity(Secret entity) {
        return SecretDTO.builder()
                .id(entity.getId())
                .contractId(entity.getContract().getId())
                .writerName(entity.getContract().getWriter().getName())
                .receiverName(entity.getContract().getReceiver() != null ? entity.getContract().getReceiver().getName() : null)
                .discloserRepresentative(entity.getDiscloserRepresentative())
                .discloserAddress(entity.getDiscloserAddress())
                .receiverRepresentative(entity.getReceiverRepresentative())
                .receiverAddress(entity.getReceiverAddress())
                .purpose(entity.getPurpose())
                .effectiveDate(entity.getEffectiveDate())
                .contractDurationMonths(entity.getContractDurationMonths())
                .confidentialityDurationYears(entity.getConfidentialityDurationYears())
                .governingLaw(entity.getGoverningLaw())
                .writerSignature(entity.getWriterSignature())
                .receiverSignature(entity.getReceiverSignature())
                .build();
    }
}
