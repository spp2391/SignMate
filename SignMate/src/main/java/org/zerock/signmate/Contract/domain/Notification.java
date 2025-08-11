package org.zerock.signmate.Contract.domain;

import jakarta.persistence.*;
import lombok.*;
import org.zerock.signmate.user.domain.User;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "notification")
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // 알림 수신자

    @ManyToOne
    @JoinColumn(name = "contract_id")
    private Contract contract;


    private LocalDateTime createdAt;





}

