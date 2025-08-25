package org.zerock.signmate.notification.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.notification.domain.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long>{
    List<Notification> findByUserUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserUserIdAndIsReadFalse(Long userId);
}
