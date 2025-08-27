package org.zerock.signmate.admin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.zerock.signmate.Contract.domain.Contract;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ContractListDto {
    private Long id;
    private String title;        // 화면용: "EMPLOYMENT 계약"
    private String status;       // enums.ContractStatus
    private String type;         // enums.ContractType
    private String writerName;   // 작성자 이름
    private String receiverName; // 상대자 이름
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    public static ContractListDto from(Contract c) {
        String typeStr = c.getContractType() != null ? c.getContractType().name() : "-";
        String statusStr = c.getStatus() != null ? c.getStatus().name() : "-";
        String writerName = c.getWriter() != null
                ? (c.getWriter().getName() != null ? c.getWriter().getName() : c.getWriter().getEmail())
                : "-";
        String receiverName = c.getReceiver() != null
                ? (c.getReceiver().getName() != null ? c.getReceiver().getName() : c.getReceiver().getEmail())
                : "-";

        return ContractListDto.builder()
                .id(c.getId())
                .title(typeStr + " 계약")
                .status(statusStr)
                .type(typeStr)
                .writerName(writerName)
                .receiverName(receiverName)
                .createdAt(c.getCreatedAt())
                .build();
    }
}
