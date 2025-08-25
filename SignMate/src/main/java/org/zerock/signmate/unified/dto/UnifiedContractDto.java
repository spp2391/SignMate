package org.zerock.signmate.unified.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnifiedContractDto {

    private Long id;                  // 각 계약서 PK
    private Long contractId;          // 공통 Contract PK
    private String contractType;      // 계약서 종류 (SERVICE, STANDARD, SUPPLY, SECRET 등)

    private String writerName;        // 작성자
    private String receiverName;      // 상대방
    private String Address;
    private String company;

//    private String clientName;        // 서비스/공급/기타 계약 시 필요
//    private String projectName;       // 프로젝트명 등

    private LocalDate contractStartDate;
    private LocalDate contractEndDate;

//    private String workDescription;   // 업무 내용
//    private Boolean deliverOriginalFiles; // 서비스 계약 특화

    private String totalAmount;       // 금액 관련
    private String advancePayment;
    private String interimPayment;
    private String finalPayment;
    private String paymentTerms;
    private Boolean taxInvoice;
    private String paymentMethod;

    private String status;            // 계약 상태 문자열
    private LocalDate contractDate;

    private Long writerId;
    private Long receiverId;

    // ===== getType() 추가 =====
    public String getType() {
        return contractType;
    }
}
