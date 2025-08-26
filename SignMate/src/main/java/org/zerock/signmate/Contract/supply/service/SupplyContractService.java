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
        // 로그인 사용자 (작성자 = 공급자)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginUser = authentication.getName();

        User writer = userRepository.findByName(loginUser)
                .orElseThrow(() -> new EntityNotFoundException("로그인한 유저를 찾을 수 없습니다: " + loginUser));

        // 수요자 조회
        User receiver = null;
        if (dto.getDemanderName() != null && !dto.getDemanderName().isBlank()) {
            receiver = userRepository.findByName(dto.getDemanderName())
                    .orElseThrow(() -> new EntityNotFoundException("받는 사람 유저가 없습니다: " + dto.getDemanderName()));
        }

        // Contract 생성 또는 조회
        Contract contract;
        if (dto.getContractId() == null) {
            contract = Contract.builder()
                    .contractType(ContractType.SUPPLY)
                    .writer(writer)
                    .receiver(receiver)
                    .status(enums.ContractStatus.DRAFT)
                    .build();
        } else {
            contract = contractRepository.findById(dto.getContractId())
                    .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + dto.getContractId()));
            contract.setWriter(writer);
            contract.setReceiver(receiver);
        }

        // DRAFT → IN_PROGRESS 자동 전환
        if (contract.getStatus() == enums.ContractStatus.DRAFT) {
            contract.setStatus(enums.ContractStatus.IN_PROGRESS);
        }
        contractRepository.save(contract);

        // SupplyContract 생성 또는 조회
        SupplyContract supplyContract = dto.getId() == null
                ? SupplyContract.builder().contract(contract).build()
                : supplyContractRepository.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 SupplyContract ID: " + dto.getId()));

        // 필드 복사
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

        // SupplyItem 처리
        supplyContract.getItems().clear();
        if (dto.getItems() != null) {
            List<SupplyItem> items = dto.getItems().stream().map(itemDto ->
                    SupplyItem.builder()
                            .supplyContract(supplyContract)
                            .itemName(itemDto.getItemName())
                            .specification(itemDto.getSpecification())
                            .unit(itemDto.getUnit())
                            .quantity(itemDto.getQuantity())
                            .unitPrice(itemDto.getUnitPrice())
                            .amount(itemDto.getAmount())
                            .remarks(itemDto.getRemarks())
                            .build()
            ).collect(Collectors.toList());
            supplyContract.getItems().addAll(items);
        }

        SupplyContract saved = supplyContractRepository.save(supplyContract);

        // 상태별 알림 처리
        LocalDateTime now = LocalDateTime.now();
        if (supplyContract.getSupplierSignature() != null && supplyContract.getDemanderSignature() != null) {
            contract.setStatus(enums.ContractStatus.COMPLETED);
            contractRepository.save(contract);
            String msg = "자재/물품 공급계약서가 완료되었습니다.";
            notificationService.notifyUser(contract.getWriter(), contract, msg, now);
            if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
                notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
            }
        } else {
            String msg = dto.getDemanderName()+"이 자재/물품 공급계약서를 작성하였습니다. 서명해 주시길 바랍니다.";
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

    @Transactional
    public void deleteByContractId(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + contractId));
        SupplyContract supplyContract = supplyContractRepository.findByContract(contract)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 SupplyContract가 존재하지 않습니다. contractId=" + contractId));
        supplyContractRepository.delete(supplyContract);
        contractRepository.delete(contract);
    }

    public SupplyContractDTO findByContractId(Long contractId) {
        Contract contractEntity = contractRepository.findById(contractId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + contractId));
        SupplyContract supplyContract = supplyContractRepository.findByContract(contractEntity)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 SupplyContract가 존재하지 않습니다. contractId=" + contractId));
        return SupplyContractDTO.fromEntity(supplyContract);
    }
}
