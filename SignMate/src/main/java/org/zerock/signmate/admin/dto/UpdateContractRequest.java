package org.zerock.signmate.admin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateContractRequest {
    private String status;       // enums.ContractStatus 의 name 값
    private String type;         // enums.ContractType 의 name 값
    private Long writerId;       // 작성자 변경 시
    private Long receiverId;     // 수신자 변경 시
    private String writerSignature;   // base64
    private String receiverSignature; // base64
}
