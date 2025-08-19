package org.zerock.signmate.notification.dto;

import lombok.*;
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

    public static NotificationDTO fromEntity(Notification n) {
        return NotificationDTO.builder()
                .notificationId(n.getNotificationId())
                .message(n.getMessage())
                .contractId(n.getContract().getId())
                .createdAt(n.getCreatedAt())
                .build();
    }
}