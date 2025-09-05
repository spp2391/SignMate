package org.zerock.signmate.Contract.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignatureRequest {
    private Long contractId;
    private Long signerId;
    private String signatureImage;
    private String signatureHash;
    private String role;

    public Long getContractId() { return contractId; }
    public void setContractId(Long contractId) { this.contractId = contractId; }

    public Long getSignerId() { return signerId; }
    public void setSignerId(Long signerId) { this.signerId = signerId; }

    public String getSignatureImage() { return signatureImage; }
    public void setSignatureImage(String signatureImage) { this.signatureImage = signatureImage; }

    public String getSignatureHash() { return signatureHash; }
    public void setSignatureHash(String signatureHash) { this.signatureHash = signatureHash; }
}
