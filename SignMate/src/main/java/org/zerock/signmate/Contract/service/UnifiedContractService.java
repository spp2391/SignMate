package org.zerock.signmate.Contract.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.business.domain.BusinessOutsourcingContract;
//import org.zerock.signmate.Contract.business.repository.BusinessOutsourcingRepository;
import org.zerock.signmate.Contract.mapper.UnifiedContractMapper;
import org.zerock.signmate.Contract.supply.domain.SupplyContract;
import org.zerock.signmate.Contract.supply.repository.SupplyContractRepository;
import org.zerock.signmate.Contract.standard.domain.Standard;
import org.zerock.signmate.Contract.standard.repository.StandardRepository;
import org.zerock.signmate.Contract.secret.domain.Secret;
import org.zerock.signmate.Contract.secret.repository.SecretRepository;
import org.zerock.signmate.Contract.dto.UnifiedContractDto;
import org.zerock.signmate.Contract.mapper.UnifiedContractMapper;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UnifiedContractService {

    private final StandardRepository standardRepository;
//    private final BusinessOutsourcingRepository businessOutsourcingRepository;
    private final SecretRepository secretRepository;
    private final SupplyContractRepository supplyContractRepository;
    private final UnifiedContractMapper contractMapper;

    public List<UnifiedContractDto> getAllContractsForUser(Long userId) {
        List<UnifiedContractDto> result = new ArrayList<>();

        // Standard 계약서
        Iterable<Object> standardOpt = standardRepository.findByWriterId(userId);
        standardOpt.forEach(c -> result.add(UnifiedContractMapper.fromStandard((Standard) c)));

//        // BusinessOutsourcing 계약서
//        Optional<BusinessOutsourcingContract> businessOpt = businessOutsourcingRepository.findById(userId);
//        businessOpt.ifPresent(c -> result.add(UnifiedContractMapper.fromBusiness(c)));

// Secret 계약서
        Iterable<Object> secretOpt = secretRepository.findByWriterId(userId);
        secretOpt.forEach(c -> result.add(UnifiedContractMapper.fromSecret((Secret) c)));

// Supply 계약서
        Iterable<Object> supplyOpt = supplyContractRepository.findByWriterId(userId);
        supplyOpt.forEach(c -> result.add(UnifiedContractMapper.fromSupply((SupplyContract) c)));

        return result;
    }

    public long countOngoingContracts(Long userId) {
        LocalDate today = LocalDate.now();
        return getAllContractsForUser(userId).stream()
                .filter(dto -> dto.getContractEndDate() != null && dto.getContractEndDate().isAfter(today))
                .count();
    }

    public long countCompletedContracts(Long userId) {
        LocalDate today = LocalDate.now();
        return getAllContractsForUser(userId).stream()
                .filter(dto -> dto.getContractEndDate() != null && !dto.getContractEndDate().isAfter(today))
                .count();
    }

    public List<UnifiedContractDto> getAllContractsByUserId(Long userId) {
        List<UnifiedContractDto> result = new ArrayList<>();

        // Standard 계약
        standardRepository.findByWriterId(userId)
                .forEach(c -> result.add(UnifiedContractMapper.fromStandard((Standard) c)));

//        // BusinessOutsourcing 계약
//        businessOutsourcingRepository.findByWriterId(userId)
//                .forEach(c -> result.add(UnifiedContractMapper.fromBusiness(c)));

        // Secret 계약
        secretRepository.findByWriterId(userId)
                .forEach(c -> result.add(UnifiedContractMapper.fromSecret((Secret) c)));

        // Supply 계약
        supplyContractRepository.findByWriterId(userId)
                .forEach(c -> result.add(UnifiedContractMapper.fromSupply((SupplyContract) c)));

        return result;
    }
}

