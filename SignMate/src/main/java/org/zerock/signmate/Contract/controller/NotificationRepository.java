package org.zerock.signmate.Contract.controller;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.Repository;
import org.zerock.signmate.Contract.domain.Notification;
import org.zerock.signmate.user.domain.User;

import java.util.List;

interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser(User user);

}
