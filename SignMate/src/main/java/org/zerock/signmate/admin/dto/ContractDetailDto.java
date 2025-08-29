package org.zerock.signmate.admin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.zerock.signmate.Contract.domain.Contract;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ContractDetailDto {
    private Long id;
    private String status;
    private String type;
    private Long writerId;
    private Long receiverId;
    private String writerName;
    private String receiverName;
    private String writerSignature;
    private String receiverSignature;
    private Long version;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    public static ContractDetailDto from(Contract c) {
        return ContractDetailDto.builder()
                .id(c.getId())
                .status(c.getStatus() != null ? c.getStatus().name() : null)
                .type(c.getContractType() != null ? c.getContractType().name() : null)
                .writerId(c.getWriter() != null ? c.getWriter().getUserId() : null)
                .receiverId(c.getReceiver() != null ? c.getReceiver().getUserId() : null)
                .writerName(c.getWriter() != null ? c.getWriter().getName() : null)
                .receiverName(c.getReceiver() != null ? c.getReceiver().getName() : null)
                .writerSignature(c.getWriterSignature())
                .receiverSignature(c.getReceiverSignature())
                .version(c.getVersion())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
