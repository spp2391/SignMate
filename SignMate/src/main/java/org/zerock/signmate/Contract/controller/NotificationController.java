package org.zerock.signmate.Contract.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.signmate.Contract.Repository.NotificationRepository;
import org.zerock.signmate.notification.domain.Notification;
import org.zerock.signmate.Contract.domain.ServiceContract;
import org.zerock.signmate.Contract.dto.NotificationDTO;
import org.zerock.signmate.Contract.dto.ServiceContractDto;
import org.zerock.signmate.Contract.Repository.ServiceContractRepository;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mailbox")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ServiceContractRepository serviceContractRepository;

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getMailbox() {
        User user = userRepository.findByName("김철수")
                .orElseThrow(() -> new RuntimeException("김철수 유저 없음"));
        System.out.println("User found: " + user);

        List<Notification> notifications = notificationRepository.findByUser(user);
        System.out.println("Notification count: " + notifications.size());

        List<NotificationDTO> dtoList = notifications.stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }
    // 영희 메일함
    @GetMapping("/younghee")
    public ResponseEntity<List<NotificationDTO>> getYoungheeMailbox() {
        User user = userRepository.findByName("이영희")
                .orElseThrow(() -> new RuntimeException("영희 유저 없음"));
        System.out.println("User found: " + user);

        List<Notification> notifications = notificationRepository.findByUser(user);
        System.out.println("Notification count: " + notifications.size());

        List<NotificationDTO> dtoList = notifications.stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/api/service-contracts/{contractId}")
    public ResponseEntity<ServiceContractDto> getServiceContract(@PathVariable Long contractId) {
        ServiceContract serviceContract = serviceContractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("계약서가 없습니다."));

        // Entity -> DTO 변환
        ServiceContractDto dto = ServiceContractDto.fromEntity(serviceContract);

        return ResponseEntity.ok(dto);
    }
}
