package org.zerock.signmate.notification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.notification.domain.Notification;
import org.zerock.signmate.notification.repository.NotificationRepository;
import org.zerock.signmate.user.domain.User;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // 알림 생성
    public void notifyUser(User receiver, Contract contract, String message, LocalDateTime now) {
        if (receiver == null) return;

        Notification notification = Notification.builder()
                .user(receiver)
                .contract(contract)
                .message(message)
                .createdAt(LocalDateTime.now())
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    // 특정 유저의 알림 조회
    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId());
    }
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserUserIdAndIsReadFalse(user.getUserId());
    }

    // ✅ 알림 읽음 처리
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("알림을 찾을 수 없습니다."));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}