package org.zerock.signmate.Contract.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "contract_id")
    private Contract contract;

    @Enumerated(EnumType.STRING)
    private NotificationType type; // SIGN_REQUEST, SIGNED, REMINDER

    @Column(length = 500)
    private String message;

    private boolean isRead;

    private LocalDateTime createdAt;

    public enum NotificationType { SIGN_REQUEST, SIGNED, REMINDER }
}
