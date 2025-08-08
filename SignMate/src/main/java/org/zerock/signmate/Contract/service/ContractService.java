package org.zerock.signmate.Contract.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.ServiceContract;
import org.zerock.signmate.Contract.dto.ServiceContractDto;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ServiceContractRepository serviceContractRepository;
    private final ContractRepository contractRepository;

    @Transactional
    public ServiceContractDto save(ServiceContractDto dto) {
        Contract contract = contractRepository.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계약서 ID입니다: " + dto.getId()));

        ServiceContract entity = ServiceContract.builder()

                .contract(contract)
                .clientName(dto.getClientName())
                .projectName(dto.getProjectName())
                .contractStartDate(dto.getContractStartDate())
                .contractEndDate(dto.getContractEndDate())
                .totalAmount(dto.getTotalAmount())
                .advancePayment(dto.getAdvancePayment())
                .interimPayment(dto.getInterimPayment())
                .finalPayment(dto.getFinalPayment())
                .paymentTerms(dto.getPaymentTerms())
                .taxInvoice(dto.getTaxInvoice())
                .paymentMethod(dto.getPaymentMethod())
                .workDescription(dto.getWorkDescription())
                .deliverOriginalFiles(dto.getDeliverOriginalFiles())
                .revisionCount(dto.getRevisionCount())
                .deliveryDeadline(dto.getDeliveryDeadline())
                .otherNotes(dto.getOtherNotes())
                .contractDate(dto.getContractDate())
                .build();

        ServiceContract saved = serviceContractRepository.save(entity);

        return toDto(saved);
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
}
