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
        // 1. 로그인 사용자 (작성자 = 공급자)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginUser = authentication.getName();

        User writer = userRepository.findByName(loginUser)
                .orElseThrow(() -> new EntityNotFoundException("로그인한 유저를 찾을 수 없습니다: " + loginUser));

        // 2. 수요자 조회
        User receiver = null;
        if (dto.getDemanderName() != null && !dto.getDemanderName().isBlank()) {
            receiver = userRepository.findByName(dto.getDemanderName())
                    .orElseThrow(() -> new EntityNotFoundException("받는 사람 유저가 없습니다: " + dto.getDemanderName()));
        }

        // 3. Contract 생성 또는 조회
        Contract contract;
        if (dto.getContractId() != null) {
            contract = contractRepository.findById(dto.getContractId())
                    .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + dto.getContractId()));
            contract.setReceiver(receiver);
        } else {
            contract = Contract.builder()
                    .contractType(ContractType.SUPPLY)
                    .writer(writer)
                    .receiver(receiver)
                    .status(enums.ContractStatus.DRAFT)
                    .build();
            contractRepository.save(contract);
        }

        // DRAFT → IN_PROGRESS 자동 전환
        if (contract.getStatus() == enums.ContractStatus.DRAFT) {
            contract.setStatus(enums.ContractStatus.IN_PROGRESS);
            contractRepository.save(contract);
        }

        // 4. SupplyContract 생성 또는 조회
        SupplyContract supplyContract = supplyContractRepository.findByContract(contract)
                .orElseGet(() -> SupplyContract.builder().contract(contract).build());

        // 5. DTO → Entity 매핑
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

        // 서명 처리
        if (writer.equals(contract.getWriter())) {
            supplyContract.setSupplierSignature(dto.getSupplierSignature());
        } else if (writer.equals(contract.getReceiver())) {
            supplyContract.setDemanderSignature(dto.getDemanderSignature());
        }

        // 6. SupplyItem 리스트 처리
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

        // 7. 알림 처리
        LocalDateTime now = LocalDateTime.now();
        String msg;
        if (supplyContract.getSupplierSignature() != null && supplyContract.getDemanderSignature() != null) {
            contract.setStatus(enums.ContractStatus.COMPLETED);
            contractRepository.save(contract);
            msg = "자재/물품 공급계약서가 완료되었습니다.";
        } else {
            msg = dto.getSupplierName() + "이 자재/물품 공급계약서를 작성하였습니다. 서명해 주시길 바랍니다.";
        }

        notificationService.notifyUser(contract.getWriter(), contract, msg, now);
        if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
            notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
        }

        return SupplyContractDTO.fromEntity(saved);
    }

    public SupplyContractDTO findByContractId(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 계약서 ID: " + contractId));
        SupplyContract supplyContract = supplyContractRepository.findByContract(contract)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 SupplyContract가 존재하지 않습니다. contractId=" + contractId));
        return SupplyContractDTO.fromEntity(supplyContract);
    }

    public SupplyContractDTO findById(Long id) {
        return supplyContractRepository.findById(id)
                .map(SupplyContractDTO::fromEntity)
                .orElse(null);
    }

    @Transactional
    public void deleteById(Long id, Authentication authentication) {
        // 로그인 유저 확인
        String username = authentication.getName();
        User loginUser = userRepository.findByName(username)
                .orElseThrow(() -> new RuntimeException("로그인 유저가 없습니다"));

        // SupplyContract 조회
        SupplyContract supplyContract = supplyContractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("삭제할 SupplyContract가 없습니다. id=" + id));

        // 작성자 검증
        if (!supplyContract.getContract().getWriter().equals(loginUser)) {
            throw new RuntimeException("삭제 권한이 없습니다. 작성자만 삭제할 수 있습니다.");
        }

        supplyContractRepository.delete(supplyContract);
    }
}
