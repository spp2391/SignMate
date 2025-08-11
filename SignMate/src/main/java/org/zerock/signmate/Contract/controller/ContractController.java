package org.zerock.signmate.Contract.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.Notification;
import org.zerock.signmate.Contract.domain.ServiceContract;
import org.zerock.signmate.Contract.domain.enums;
import org.zerock.signmate.Contract.dto.ServiceContractDto;
import org.zerock.signmate.Contract.service.ContractRepository;
import org.zerock.signmate.Contract.service.ContractService;
import org.zerock.signmate.Contract.service.ServiceContractRepository;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/service-contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;
    private final ServiceContractRepository serviceContractRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;
    private final NotificationRepository notificationRepository;

//    @PostMapping
//    public ResponseEntity<?> saveContract(@RequestBody ServiceContractDto dto) {
//        try {
//            ServiceContractDto savedDto = contractService.save(dto);
//            return ResponseEntity.ok(savedDto);
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(Map.of("message", "서버 오류"));
//        }
//    }
    @PostMapping
    public ResponseEntity<?> createServiceContract(@RequestBody ServiceContractDto dto) {

        // 1. 작성자 User 찾기 (계약자 이름으로)
        User writer = userRepository.findByName(dto.getWriterName())
                .orElseThrow(() -> new RuntimeException("작성자(계약자) 유저가 없습니다."));

        // 2. 받는 사람 User 찾기
        User receiver = userRepository.findByName(dto.getReceiverName())
                .orElseThrow(() -> new RuntimeException("받는 사람 유저가 없습니다."));

        // 3. Contract 엔티티 생성 및 저장
        Contract contract = Contract.builder()
                .contractType(enums.ContractType.SERVICE)
                .writer(writer)
                .build();
        contractRepository.save(contract);

        // 4. ServiceContract 상세정보 저장
        ServiceContract serviceContract = ServiceContract.builder()
                .contract(contract)
                .clientName(dto.getClientName())
                .projectName(dto.getProjectName())
                .contractStartDate(dto.getContractStartDate())
                .totalAmount(dto.getTotalAmount())
                .paymentTerms(dto.getPaymentTerms())
                .status(enums.ContractStatus.DRAFT)
                .build();
        serviceContractRepository.save(serviceContract);

        // 5. 알림(Notification) 생성 (받는 사람에게)
        Notification notification = Notification.builder()
                .user(receiver)    // 받는 사람
                .contract(contract)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);

        Notification notificationToWriter = Notification.builder()
                .user(writer)    // 작성자
                .contract(contract)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notificationToWriter);

        return ResponseEntity.ok("계약서 생성 및 알림 전송 완료");
    }
    // 계약서 단일 조회
    @GetMapping("/{id}")
    public ResponseEntity<ServiceContractDto> getServiceContract(@PathVariable Long id) {
        ServiceContract serviceContract = serviceContractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("계약서를 찾을 수 없습니다. id=" + id));
        ServiceContractDto dto = ServiceContractDto.fromEntity(serviceContract);
        return ResponseEntity.ok(dto);
    }

    // 계약서 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updateServiceContract(@PathVariable Long id, @RequestBody ServiceContractDto dto) {
        if (!id.equals(dto.getId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "URL ID와 요청 데이터 ID가 일치하지 않습니다."));
        }

        ServiceContract serviceContract = serviceContractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("계약서를 찾을 수 없습니다. id=" + id));

        User writer = userRepository.findByName(dto.getWriterName())
                .orElseThrow(() -> new RuntimeException("작성자 유저가 없습니다."));
        User receiver = userRepository.findByName(dto.getReceiverName())
                .orElseThrow(() -> new RuntimeException("받는 사람 유저가 없습니다."));

        Contract contract = serviceContract.getContract();
        contract.setWriter(writer);
        contract.setReceiver(receiver);
        contractRepository.save(contract);

        serviceContract.setClientName(dto.getClientName());
        serviceContract.setProjectName(dto.getProjectName());
        serviceContract.setContractStartDate(dto.getContractStartDate());
        serviceContract.setContractEndDate(dto.getContractEndDate());
        serviceContract.setTotalAmount(dto.getTotalAmount());
        serviceContract.setPaymentTerms(dto.getPaymentTerms());
        // 상태 변경 필요하면 아래 추가
        // serviceContract.setStatus(enums.ContractStatus.valueOf(dto.getStatus()));

        serviceContractRepository.save(serviceContract);

        Notification notification = Notification.builder()
                .user(receiver)
                .contract(contract)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);

        return ResponseEntity.ok("계약서가 성공적으로 수정되었습니다.");
    }




}

