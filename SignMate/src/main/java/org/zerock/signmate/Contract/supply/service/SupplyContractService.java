package org.zerock.signmate.Contract.supply.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.Repository.ContractRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.enums.ContractType;
import org.zerock.signmate.Contract.supply.domain.SupplyContract;
import org.zerock.signmate.Contract.supply.domain.SupplyItem;
import org.zerock.signmate.Contract.supply.dto.SupplyContractDTO;
import org.zerock.signmate.Contract.supply.repository.SupplyContractRepository;
import org.zerock.signmate.Contract.supply.repository.SupplyItemRepository;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplyContractService {

    private final SupplyContractRepository supplyContractRepository;
    private final SupplyItemRepository supplyItemRepository;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;

    @Transactional
    public SupplyContractDTO addOrUpdateContract(SupplyContractDTO dto) {

        // 작성자(공급자) User 조회
        User writer = userRepository.findByName(dto.getSupplierName())
                .orElseThrow(() -> new EntityNotFoundException("작성자 유저가 없습니다: " + dto.getSupplierName()));

        // 수신자(수요자) User 조회
        User receiver = null;
        if (dto.getDemanderName() != null && !dto.getDemanderName().isBlank()) {
            receiver = userRepository.findByName(dto.getDemanderName())
                    .orElseThrow(() -> new EntityNotFoundException("받는 사람 유저가 없습니다: " + dto.getDemanderName()));
        }

        // Contract 엔티티 생성 또는 조회
        Contract contractEntity = dto.getContractId() == null
                ? Contract.builder()
                .contractType(ContractType.SERVICE)
                .writer(writer)
                .receiver(receiver)
                .build()
                : contractRepository.findById(dto.getContractId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + dto.getContractId()));

        // writer/receiver 세팅 후 저장
        contractEntity.setWriter(writer);
        contractEntity.setReceiver(receiver);
        contractRepository.save(contractEntity);

        // SupplyContract 생성 또는 조회
        SupplyContract supplyContract = dto.getId() == null
                ? SupplyContract.builder().contract(contractEntity).build()
                : supplyContractRepository.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 SupplyContract ID: " + dto.getId()));

        // SupplyContract 필드 복사
        supplyContract.setContract(contractEntity);
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

        return SupplyContractDTO.fromEntity(supplyContractRepository.save(supplyContract));
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
