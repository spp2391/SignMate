// src/main/java/org/zerock/signmate/Contract/service/UnifiedContractService.java
package org.zerock.signmate.Contract.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.business.repository.BusinessOutsourcingContractRepository;
import org.zerock.signmate.Contract.dto.UnifiedContractDto;
import org.zerock.signmate.Contract.dto.UserDashboardDTO;
import org.zerock.signmate.Contract.newservice.repository.ServiceContractDocumentRepository;
import org.zerock.signmate.Contract.secret.repository.SecretRepository;
import org.zerock.signmate.Contract.standard.repository.StandardRepository;
import org.zerock.signmate.Contract.supply.repository.SupplyContractRepository;
import org.zerock.signmate.Contract.mapper.UnifiedContractMapper;
import org.zerock.signmate.Contract.secret.domain.Secret;
import org.zerock.signmate.Contract.standard.domain.Standard;
import org.zerock.signmate.Contract.supply.domain.SupplyContract;

import java.time.LocalDate;
import java.time.temporal.IsoFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UnifiedContractService {

    private final StandardRepository standardRepository;
    private final SecretRepository secretRepository;
    // 비지니스아웃소싱 계약서 작성해야함
    private final SupplyContractRepository supplyContractRepository;
    private final UnifiedContractMapper contractMapper; // 사용 안하면 제거해도 됨
    private final ServiceContractDocumentRepository serviceContractDocumentRepository;
    private final BusinessOutsourcingContractRepository businessOutsourcingContractRepository;

    public List<UnifiedContractDto> getAllContractsForUser(Long userId) {
        List<UnifiedContractDto> result = new ArrayList<>();

        // Standard
        standardRepository.findByContract_Writer_UserId(userId)
                .forEach(c -> result.add(UnifiedContractMapper.fromStandard(c, c.getContract())));
        standardRepository.findByContract_Receiver_UserId(userId)
                        .forEach(c -> result.add(UnifiedContractMapper.fromStandard(c, c.getContract())));


        // Secret
        secretRepository.findByContract_Writer_UserId(userId)
                .forEach(c -> result.add(UnifiedContractMapper.fromSecret(c, c.getContract())));
        secretRepository.findByContract_Receiver_UserId(userId)
                .forEach(c -> result.add(UnifiedContractMapper.fromSecret(c, c.getContract())));

        // Supply
        supplyContractRepository.findByContract_Writer_UserId(userId)
                .forEach(c -> result.add(UnifiedContractMapper.fromSupply(c, c.getContract())));
        supplyContractRepository.findByContract_Receiver_UserId(userId)
                .forEach(c -> result.add(UnifiedContractMapper.fromSupply(c, c.getContract())));

        // Service
        serviceContractDocumentRepository.findByContract_Writer_UserId(userId)
                .forEach(c -> result.add(UnifiedContractMapper.fromService(c, c.getContract())));
        serviceContractDocumentRepository.findByContract_Receiver_UserId(userId)
                .forEach(c -> result.add(UnifiedContractMapper.fromService(c, c.getContract())));

        // BusinessOutsourcing
        businessOutsourcingContractRepository.findByContract_Writer_UserId(userId)
                .forEach(c -> result.add(UnifiedContractMapper.fromBusiness(c, c.getContract())));
        businessOutsourcingContractRepository.findByContract_Receiver_UserId(userId)
                .forEach(c -> result.add(UnifiedContractMapper.fromBusiness(c, c.getContract())));

        // 필요 시 Service/Outsourcing도 이어서 추가
        return result;
    }

    public UserDashboardDTO getUserDashboard(Long userId) {
        List<UnifiedContractDto> contracts = getAllContractsForUser(userId);
        LocalDate today = LocalDate.now();

        long total = contracts.size();
        long active = contracts.stream()
                .filter(c -> c.getContractEndDate() != null && c.getContractEndDate().isAfter(today))
                .count();
        long completed = contracts.stream()
                .filter(c -> c.getContractEndDate() != null && !c.getContractEndDate().isAfter(today))
                .count();

        // 타입별 개수
        Map<String, Long> countsByType = contracts.stream()
                .collect(Collectors.groupingBy(
                        c -> safeUpper(c.getContractType()),
                        Collectors.counting()
                ));

        // 타입별 금액 합
        Map<String, Double> amountsByType = contracts.stream()
                .collect(Collectors.groupingBy(
                        c -> safeUpper(c.getContractType()),
                        Collectors.summingDouble(c -> parseAmount(c.getTotalAmount()))
                ));

        double totalAmount = amountsByType.values().stream().mapToDouble(Double::doubleValue).sum();

        // 주간별 계약 수 (ISO 주 기준)
        Map<String, Long> weeklyCounts = contracts.stream()
                .filter(c -> c.getContractStartDate() != null)
                .collect(Collectors.groupingBy(
                        c -> c.getContractStartDate().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR) + "주차",
                        Collectors.counting()
                ));

        // 년/월별 계약 수
        Map<String, Long> monthlyCounts = contracts.stream()
                .filter(c -> c.getContractStartDate() != null)
                .collect(Collectors.groupingBy(
                        c -> c.getContractStartDate().getYear() + "-" +
                                String.format("%02d", c.getContractStartDate().getMonthValue()),
                        Collectors.counting()
                ));

        return UserDashboardDTO.builder()
                .totalContracts(total)
                .activeContracts(active)
                .completedContracts(completed)
                .totalAmount(round0(totalAmount))
                .countsByType(countsByType)
                .amountsByType(amountsByType)
                .weeklyCounts(weeklyCounts)
                .monthlyCounts(monthlyCounts)
                .build();
    }

    private static String safeUpper(String s) {
        return s == null ? "UNKNOWN" : s.toUpperCase(Locale.ROOT);
    }

    // "1,200,000원", " 3,400 ", null 등 안전 파싱
    private static double parseAmount(String raw) {
        if (raw == null) return 0.0;
        String cleaned = raw.replaceAll("[^0-9.\\-]", "");
        if (cleaned.isBlank()) return 0.0;
        try {
            return Double.parseDouble(cleaned);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private static double round0(double v) {
        return Math.round(v);
    }
}
