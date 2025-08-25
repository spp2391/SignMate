package org.zerock.signmate.notification.dto;

import lombok.*;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.notification.domain.Notification;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationDTO {
    private Long notificationId;
    private String message;
    private Long contractId;
    private LocalDateTime createdAt;
    private boolean isRead;
    private String contractType;
    public static NotificationDTO fromEntity(Notification n) {
        Contract contract = n.getContract();
        return NotificationDTO.builder()
                .notificationId(n.getNotificationId())
                .message(n.getMessage())
                .contractId(n.getContract().getId())
                .createdAt(n.getCreatedAt())
                .isRead(n.isRead())
                .contractType(
                        contract != null && contract.getContractType() != null
                                ? contract.getContractType().name().toLowerCase()
                                : null
                )
                .build();
    }
}