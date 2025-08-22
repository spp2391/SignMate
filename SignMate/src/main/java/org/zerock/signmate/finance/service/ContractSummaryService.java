//package org.zerock.signmate.finance.service;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.zerock.signmate.Contract2.domain.SupplyContract;
//import org.zerock.signmate.Contract2.domain.SupplyItem;
//import org.zerock.signmate.Contract.Repository.SupplyContractRepository;
//import org.zerock.signmate.Contract2.domain.StandardEmploymentContract;
//import org.zerock.signmate.Contract2.repository.StandardEmploymentContractRepository;
//import org.zerock.signmate.finance.dto.CompanyContractSummaryDTO;
//import org.zerock.signmate.Contract.domain.enums.ContractStatus;
//
//import java.math.BigDecimal;
//import java.util.*;
//import java.util.stream.Collectors;
//import java.util.stream.Stream;
//
//@Service
//@RequiredArgsConstructor
//public class ContractSummaryService {
//
//    private final SupplyContractRepository supplyContractRepository;
//    private final StandardEmploymentContractRepository employmentContractRepository;
//
//    public List<CompanyContractSummaryDTO> getCompanyContractSummary() {
//
//        // 1. 모든 계약 가져오기
//        List<SupplyContract> supplyContracts = supplyContractRepository.findAll();
//        List<StandardEmploymentContract> employmentContracts = employmentContractRepository.findAll();
//
//        // 2. 기업 단위로 그룹화 (SupplyContract: supplierName, EmploymentContract: employerName)
//        Map<String, List<Object>> companyMap = new HashMap<>();
//
//        supplyContracts.forEach(c ->
//                companyMap.computeIfAbsent(c.getSupplierName(), k -> new ArrayList<>()).add(c)
//        );
//
//        employmentContracts.forEach(c ->
//                companyMap.computeIfAbsent(c.getEmployerName(), k -> new ArrayList<>()).add(c)
//        );
//
//        // 3. DTO 생성
//        List<CompanyContractSummaryDTO> summaries = new ArrayList<>();
//
//        for (Map.Entry<String, List<Object>> entry : companyMap.entrySet()) {
//            String company = entry.getKey();
//            List<Object> contracts = entry.getValue();
//
//            int totalContracts = contracts.size();
//            int draftCount = 0, signedCount = 0, terminatedCount = 0;
//            int totalItems = 0;
//            BigDecimal totalAmount = BigDecimal.ZERO;
//            double totalDurationDays = 0;
//
//            for (Object c : contracts) {
//                if (c instanceof SupplyContract sc) {
//                    // 상태
//                    if (sc.getStatus() == ContractStatus.DRAFT) draftCount++;
//                    else if (sc.getStatus() == ContractStatus.SIGNED) signedCount++;
//                    else if (sc.getStatus() == ContractStatus.TERMINATED) terminatedCount++;
//
//                    // 금액 합계
//                    totalAmount = totalAmount.add(
//                            sc.getItems().stream()
//                                    .map(i -> i.getAmount() != null ? i.getAmount() : BigDecimal.ZERO)
//                                    .reduce(BigDecimal.ZERO, BigDecimal::add)
//                    );
//
//                    // 하위 항목 수
//                    totalItems += sc.getItems().size();
//
//                    // 평균 기간
//                    totalDurationDays += sc.getContractDurationDays(); // SupplyContract에 편의 메서드 추가 필요
//                }
//                else if (c instanceof StandardEmploymentContract ec) {
//                    // 상태
//                    if (ec.getStatus() == ContractStatus.DRAFT) draftCount++;
//                    else if (ec.getStatus() == ContractStatus.ACTIVE) signedCount++;
//                    else if (ec.getStatus() == ContractStatus.TERMINATED) terminatedCount++;
//
//                    // 금액 (임금 문자열 파싱 예시)
//                    totalAmount = totalAmount.add(parseWageToBigDecimal(ec.getWageAmount()));
//
//                    // 하위 항목 없음
//                    totalItems += 0;
//
//                    // 평균 기간
//                    totalDurationDays += ec.getContractDurationDays();
//                }
//            }
//
//            double avgDuration = totalContracts > 0 ? totalDurationDays / totalContracts : 0;
//
//            summaries.add(
//                    CompanyContractSummaryDTO.builder()
//                            .company(company)
//                            .totalContracts(totalContracts)
//                            .totalAmount(totalAmount)
//                            .draftCount(draftCount)
//                            .signedCount(signedCount)
//                            .terminatedCount(terminatedCount)
//                            .totalItems(totalItems)
//                            .avgContractDurationDays(avgDuration)
//                            .build()
//            );
//        }
//
//        return summaries;
//    }
//
//    // 임금 문자열 → BigDecimal 변환 (예: "3,000,000원" → 3000000)
//    private BigDecimal parseWageToBigDecimal(String wage) {
//        if (wage == null || wage.isEmpty()) return BigDecimal.ZERO;
//        try {
//            String numeric = wage.replaceAll("[^0-9]", "");
//            return new BigDecimal(numeric);
//        } catch (Exception e) {
//            return BigDecimal.ZERO;
//        }
//    }
//}
