package org.zerock.signmate.Contract.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.Repository.ContractRepository;
import org.zerock.signmate.Contract.Repository.NotificationRepository;
import org.zerock.signmate.Contract.Repository.ServiceContractRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.Notification;
import org.zerock.signmate.Contract.domain.enums;
import org.zerock.signmate.Contract.dto.ServiceContractDto;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ServiceContractRepository serviceContractRepository;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository; // 반드시 추가
    private final NotificationRepository notificationRepository;

    @Transactional
    public ServiceContractDto save(ServiceContractDto dto) {
        ServiceContract entity;

        if (dto.getId() != null) {
            // 수정: 기존 엔티티 조회 후 업데이트
            entity = serviceContractRepository.findById(dto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 서비스 계약서 ID입니다: " + dto.getId()));
        } else {
            // 새로 생성: Contract 먼저 조회
            if (dto.getContractId() == null) {
                throw new IllegalArgumentException("계약서 ID가 필요합니다.");
            }
            Contract contract = contractRepository.findById(dto.getContractId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계약서 ID입니다: " + dto.getContractId()));

            // DTO의 writerName과 receiverName으로 User 찾아서 Contract에 세팅
            User writer = userRepository.findByName(dto.getWriterName())
                    .orElseThrow(() -> new IllegalArgumentException("작성자 유저가 없습니다: " + dto.getWriterName()));

            User receiver = null;
            if (dto.getReceiverName() != null && !dto.getReceiverName().isEmpty()) {
                receiver = userRepository.findByName(dto.getReceiverName())
                        .orElseThrow(() -> new IllegalArgumentException("받는 사람 유저가 없습니다: " + dto.getReceiverName()));
            }

            contract.setWriter(writer);
            contract.setReceiver(receiver);

            entity = ServiceContract.builder()
                    .contract(contract)
                    .build();
        }

        // 필드 일괄 업데이트
        entity.setClientName(dto.getClientName());
        entity.setProjectName(dto.getProjectName());
        entity.setContractStartDate(dto.getContractStartDate());
        entity.setContractEndDate(dto.getContractEndDate());
        entity.setTotalAmount(dto.getTotalAmount());
        entity.setAdvancePayment(dto.getAdvancePayment());
        entity.setInterimPayment(dto.getInterimPayment());
        entity.setFinalPayment(dto.getFinalPayment());
        entity.setPaymentTerms(dto.getPaymentTerms());
        entity.setTaxInvoice(dto.getTaxInvoice());
        entity.setPaymentMethod(dto.getPaymentMethod());
        entity.setWorkDescription(dto.getWorkDescription());
        entity.setDeliverOriginalFiles(dto.getDeliverOriginalFiles());
        entity.setRevisionCount(dto.getRevisionCount());
        entity.setDeliveryDeadline(dto.getDeliveryDeadline());
        entity.setOtherNotes(dto.getOtherNotes());
        entity.setContractDate(dto.getContractDate());

        ServiceContract saved = serviceContractRepository.save(entity);

        return toDto(saved);
    }

    public void addContract(ServiceContractDto dto){
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
    }

    public ServiceContractDto findById(Long id) {
        Optional<ServiceContract> opt = serviceContractRepository.findById(id);
        return opt.map(this::toDto).orElse(null);
    }

    private ServiceContractDto toDto(ServiceContract entity) {
        return ServiceContractDto.builder()
                .id(entity.getId())
                .clientName(entity.getClientName())
                .projectName(entity.getProjectName())
                .contractStartDate(entity.getContractStartDate())
                .contractEndDate(entity.getContractEndDate())
                .totalAmount(entity.getTotalAmount())
                .advancePayment(entity.getAdvancePayment())
                .interimPayment(entity.getInterimPayment())
                .finalPayment(entity.getFinalPayment())
                .paymentTerms(entity.getPaymentTerms())
                .taxInvoice(entity.getTaxInvoice())
                .paymentMethod(entity.getPaymentMethod())
                .workDescription(entity.getWorkDescription())
                .deliverOriginalFiles(entity.getDeliverOriginalFiles())
                .revisionCount(entity.getRevisionCount())
                .deliveryDeadline(entity.getDeliveryDeadline())
                .otherNotes(entity.getOtherNotes())
                .contractDate(entity.getContractDate())
                .build();
    }

    public ServiceContractDto searchContractId(Long contractId){
        ServiceContract serviceContract = serviceContractRepository.findByContract_Id(contractId)
                .orElseThrow(() -> new RuntimeException("계약서를 찾을 수 없습니다. contractId=" + contractId));
        Contract contract = contractRepository.findById(contractId).get();
        ServiceContractDto dto = ServiceContractDto.fromEntity(serviceContract);
        dto.setWriterId(contract.getWriter().getUserId());
        if(contract.getReceiver() != null){
            dto.setReceiverId(contract.getReceiver().getUserId());
        }
        return dto;
    }

}
