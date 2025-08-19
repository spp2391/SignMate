package org.zerock.signmate.Contract.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract.Repository.NotificationRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.notification.domain.Notification;
import org.zerock.signmate.Contract.domain.ServiceContract;
import org.zerock.signmate.Contract.dto.ServiceContractDto;
import org.zerock.signmate.Contract.Repository.ContractRepository;
import org.zerock.signmate.Contract.service.ContractService;
import org.zerock.signmate.Contract.Repository.ServiceContractRepository;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/service-contracts")
@RequiredArgsConstructor
public class ContractController {


    private final ServiceContractRepository serviceContractRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;
    private final NotificationRepository notificationRepository;
    private final ContractService contractService;

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
        contractService.addContract(dto);
        return ResponseEntity.ok("계약서 생성 및 알림 전송 완료");
    }

    // 계약서 단일 조회
    @GetMapping("/{contractId}")
    public ResponseEntity<ServiceContractDto> getServiceContract(@PathVariable Long contractId) {
        ServiceContractDto dto = contractService.searchContractId(contractId);
        return ResponseEntity.ok(dto);
    }


    // 계약서 수정
    @PutMapping("/{contractId}")
    public ResponseEntity<?> updateServiceContract(@PathVariable Long contractId, @RequestBody ServiceContractDto dto) {
        if (!contractId.equals(dto.getContractId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "URL ID와 요청 데이터 ID가 일치하지 않습니다."));
        }

        ServiceContract serviceContract = serviceContractRepository.findByContract_Id(contractId)
                .orElseThrow(() -> new RuntimeException("계약서를 찾을 수 없습니다. contractId=" + contractId));

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

