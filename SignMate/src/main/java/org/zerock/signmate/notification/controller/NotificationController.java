package org.zerock.signmate.notification.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.notification.domain.Notification;
import org.zerock.signmate.notification.dto.NotificationDTO;
import org.zerock.signmate.notification.service.NotificationService;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    // 현재 로그인 유저 알림 목록
    @GetMapping
    public List<NotificationDTO> getMyNotifications(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByName(username)
                .orElseThrow(() -> new RuntimeException("로그인 유저가 없습니다"));
        return notificationService.getNotificationsForUser(user)
                .stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }
    @GetMapping("/unread-count")
    public long getUnreadCount(Authentication authentication) {
        String username = authentication.getName(); // JWT에서 username 가져오기
        User user = userRepository.findByName(username)
                .orElseThrow(() -> new RuntimeException("로그인 유저가 없습니다"));
        return notificationService.getUnreadCount(user);
    }
    @PostMapping("/read/{notificationId}")
    public void markAsRead(@PathVariable Long notificationId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByName(username)
                .orElseThrow(() -> new RuntimeException("로그인 유저가 없습니다"));

        // 유저 본인 알림인지 확인
        Notification notification = notificationService.getNotificationsForUser(user)
                .stream()
                .filter(n -> n.getNotificationId().equals(notificationId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("해당 알림을 찾을 수 없습니다."));

        notificationService.markAsRead(notificationId);
    }
}
