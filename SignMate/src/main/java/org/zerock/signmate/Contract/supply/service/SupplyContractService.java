package org.zerock.signmate.Contract.supply.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.Repository.ContractRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.enums;
import org.zerock.signmate.Contract.domain.enums.ContractType;
import org.zerock.signmate.Contract.supply.domain.SupplyContract;
import org.zerock.signmate.Contract.supply.domain.SupplyItem;
import org.zerock.signmate.Contract.supply.dto.SupplyContractDTO;
import org.zerock.signmate.Contract.supply.repository.SupplyContractRepository;
import org.zerock.signmate.Contract.supply.repository.SupplyItemRepository;
import org.zerock.signmate.notification.service.NotificationService;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplyContractService {

    private final SupplyContractRepository supplyContractRepository;
    private final SupplyItemRepository supplyItemRepository;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public SupplyContractDTO addOrUpdateContract(SupplyContractDTO dto) {

        // 작성자(공급자) User 조회
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginUser = authentication.getName();

        User writer = userRepository.findByName(loginUser)
                .orElseThrow(() -> new EntityNotFoundException("로그인한 유저를 찾을 수 없습니다: " + loginUser));

        // 수신자(수요자) User 조회
        User receiver = null;
        if (dto.getDemanderName() != null && !dto.getDemanderName().isBlank()) {
            receiver = userRepository.findByName(dto.getDemanderName())
                    .orElseThrow(() -> new EntityNotFoundException("받는 사람 유저가 없습니다: " + dto.getDemanderName()));
        }

        // Contract 엔티티 생성 또는 조회
        Contract contract = dto.getContractId() == null
                ? Contract.builder()
                .contractType(ContractType.SUPPLY)
                .writer(writer)
                .receiver(receiver)
                .build()
                : contractRepository.findById(dto.getContractId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + dto.getContractId()));

        // writer/receiver 세팅 후 저장
        contract.setWriter(writer);
        contract.setReceiver(receiver);
        contractRepository.save(contract);

        // SupplyContract 생성 또는 조회
        SupplyContract supplyContract = dto.getId() == null
                ? SupplyContract.builder().contract(contract).build()
                : supplyContractRepository.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 SupplyContract ID: " + dto.getId()));

        // SupplyContract 필드 복사
        supplyContract.setContract(contract);
        supplyContract.setSupplierName(dto.getSupplierName());
        supplyContract.setSupplierRepresentative(dto.getSupplierRepresentative());
        supplyContract.setDemanderName(dto.getDemanderName());
        supplyContract.setDemanderRepresentative(dto.getDemanderRepresentative());
        supplyContract.setContractDate(dto.getContractDate());
        supplyContract.setDeliveryLocation(dto.getDeliveryLocation());
        supplyContract.setDeliveryTerms(dto.getDeliveryTerms());
        supplyContract.setInspectionAndWarranty(dto.getInspectionAndWarranty());
        supplyContract.setPaymentTerms(dto.getPaymentTerms());
        supplyContract.setQualityGuaranteeTerms(dto.getQualityGuaranteeTerms());
        supplyContract.setOtherTerms(dto.getOtherTerms());
        supplyContract.setSupplierSignature(dto.getSupplierSignature());
        supplyContract.setDemanderSignature(dto.getDemanderSignature());

        // items 처리
        supplyContract.getItems().clear();
        if (dto.getItems() != null) {
            List<SupplyItem> items = dto.getItems().stream().map(itemDto -> {
                SupplyItem item = SupplyItem.builder()
                        .supplyContract(supplyContract)
                        .itemName(itemDto.getItemName())
                        .specification(itemDto.getSpecification())
                        .unit(itemDto.getUnit())
                        .quantity(itemDto.getQuantity())
                        .unitPrice(itemDto.getUnitPrice())
                        .amount(itemDto.getAmount())
                        .remarks(itemDto.getRemarks())
                        .build();
                return item;
            }).collect(Collectors.toList());
            supplyContract.getItems().addAll(items);
        }

        SupplyContract saved = supplyContractRepository.save(supplyContract);
        LocalDateTime now = LocalDateTime.now();

        if (supplyContract.getSupplierSignature() != null && supplyContract.getDemanderSignature() != null) {
            // 서명 완료: 계약 완료 상태
            contract.setStatus(enums.ContractStatus.COMPLETED);
            contractRepository.save(contract);
            String msg = "자재/물품 공급계약서가 완료되었습니다.";
            notificationService.notifyUser(contract.getWriter(), contract, msg, now);
            if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
                notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
            }
        } else {
            // 작성/수정 중
            String msg = "자재/물품 공급계약서가 작성/수정되었습니다.";
            notificationService.notifyUser(contract.getWriter(), contract, msg, now);
            if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
                notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
            }
        }

        return SupplyContractDTO.fromEntity(saved);
    }

    public SupplyContractDTO findById(Long id) {
        return supplyContractRepository.findById(id)
                .map(SupplyContractDTO::fromEntity)
                .orElse(null);
    }

    public void deleteById(Long id) {
        supplyContractRepository.deleteById(id);
    }

    public SupplyContractDTO findByContractId(Long contractId) {
        Contract contractEntity = contractRepository.findById(contractId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + contractId));

        SupplyContract supplyContract = supplyContractRepository.findByContract(contractEntity)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 SupplyContract가 존재하지 않습니다. contractId=" + contractId));

        return SupplyContractDTO.fromEntity(supplyContract);
    }
}
