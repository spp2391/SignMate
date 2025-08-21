//package org.zerock.signmate.finance.service;
//
//import lombok.RequiredArgsConstructor;
//import org.hibernate.stat.Statistics;
//import org.springframework.stereotype.Service;
//
//import org.zerock.signmate.finance.domain.CompanyFinancial;
//import org.zerock.signmate.finance.repository.CompanyFinancialRepository;
//import org.zerock.signmate.finance.dto.CompanyStatisticsDTO;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class StatisticsService {
//
//    private final StandardEmploymentContractRepository contractRepo;
//    private final CompanyFinancialRepository financialRepo;
//
//    public CompanyStatisticsDTO getCompanyStatistics(String companyName) {
//        List<StandardEmploymentContract> contracts = contractRepo.findByEmployerName(companyName);
//        List<CompanyFinancial> financials = financialRepo.findByCompanyNameOrderByPeriodStartAsc(companyName);
//
//        // ----------------------
//        // 계약 관련 계산
//        // ----------------------
//        long relationshipLength = contracts.stream()
//                .mapToLong(StandardEmploymentContract::getRelationshipLengthDays)
//                .max()
//                .orElse(0);
//
//        long activeContracts = contracts.stream()
//                .filter(c -> c.getStatus() != null && c.getStatus().name().equals("ACTIVE"))
//                .count();
//
//        double avgContractDuration = contracts.stream()
//                .filter(c -> c.getWorkEndDate() != null)
//                .mapToLong(StandardEmploymentContract::getContractDurationDays)
//                .average()
//                .orElse(0.0);
//
//        double avgProposalToSignDays = contracts.stream()
//                .filter(c -> c.getProposalDate() != null && c.getSignedDate() != null)
//                .mapToLong(StandardEmploymentContract::getProposalToSignedDays)
//                .average()
//                .orElse(0.0);
//
//        // ----------------------
//        // 재무 관련 계산
//        // ----------------------
//        double profitMargin = 0.0;
//        double totalCost = 0.0;
//        double contractMarginRate = 0.0;
//        double annualRevenueGrowth = 0.0;
//
//        if (!financials.isEmpty()) {
//            CompanyFinancial latest = financials.get(financials.size() - 1);
//            profitMargin = latest.getProfitMargin();
//            totalCost = latest.getCost() != null ? latest.getCost() : 0.0;
//            contractMarginRate = latest.getProfitMargin(); // 단순 최신 마진율
//        }
//
//        if (financials.size() >= 2) {
//            CompanyFinancial lastYear = financials.get(financials.size() - 2);
//            CompanyFinancial thisYear = financials.get(financials.size() - 1);
//
//            if (lastYear.getRevenue() != null && lastYear.getRevenue() > 0) {
//                annualRevenueGrowth =
//                        ((thisYear.getRevenue() - lastYear.getRevenue()) / lastYear.getRevenue()) * 100;
//            }
//        }
//
//        // ----------------------
//        // DTO 빌드
//        // ----------------------
//        return CompanyStatisticsDTO.builder()
//                .companyName(companyName)
//                .relationshipLength(relationshipLength)
//                .activeContracts(activeContracts)
//                .averageContractDuration(avgContractDuration)
//                .averageProposalToSignDays(avgProposalToSignDays)
//                .profitMargin(profitMargin)
//                .totalCost(totalCost)
//                .annualRevenueGrowth(annualRevenueGrowth)
//                .contractMarginRate(contractMarginRate)
//                .build();
//    }
//}
