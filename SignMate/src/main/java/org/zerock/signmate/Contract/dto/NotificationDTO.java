package org.zerock.signmate.Contract.dto;



import lombok.*;
import org.zerock.signmate.notification.domain.Notification;
import org.zerock.signmate.Contract.domain.Contract;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {

    private Long notificationId;
    private Long contractId;
    private LocalDateTime createdAt;

    public static NotificationDTO fromEntity(Notification notification) {
        Contract contract = notification.getContract();
        return NotificationDTO.builder()
                .notificationId(notification.getNotificationId())
                .contractId(contract != null ? contract.getId() : null)
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
