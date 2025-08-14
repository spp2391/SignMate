package org.zerock.signmate.finance.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract2.domain.StandardEmploymentContract;
import org.zerock.signmate.Contract2.repository.StandardEmploymentContractRepository;
import org.zerock.signmate.finance.domain.CompanyFinancial;
import org.zerock.signmate.finance.repository.CompanyFinancialRepository;

import java.util.List;
import java.util.OptionalDouble;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final StandardEmploymentContractRepository contractRepo;
    private final CompanyFinancialRepository financialRepo;

    // =====================================
    // 1. 계약 관계 지속 기간 (오늘 기준, 일 단위)
    // =====================================
    public long getRelationshipLength(String companyName) {
        List<StandardEmploymentContract> contracts = contractRepo.findByEmployerName(companyName);
        if (contracts.isEmpty()) return 0;

        return contracts.stream()
                .mapToLong(StandardEmploymentContract::getRelationshipLengthDays)
                .max()  // 가장 오래된 계약 기준
                .orElse(0);
    }

    // =====================================
    // 2. 활성 계약 수
    // =====================================
    public long getActiveContracts(String companyName) {
        List<StandardEmploymentContract> contracts = contractRepo.findByEmployerName(companyName);
        return contracts.stream()
                .filter(c -> c.getStatus() != null && c.getStatus().name().equals("ACTIVE"))
                .count();
    }

    // =====================================
    // 3. 평균 계약 기간 (일 단위)
    // =====================================
    public double getAverageContractDuration(String companyName) {
        List<StandardEmploymentContract> contracts = contractRepo.findByEmployerName(companyName);
        if (contracts.isEmpty()) return 0.0;

        OptionalDouble avg = contracts.stream()
                .filter(c -> c.getWorkEndDate() != null)
                .mapToLong(StandardEmploymentContract::getContractDurationDays)
                .average();

        return avg.orElse(0.0);
    }

    // =====================================
    // 4. 계약 진행 속도 (제안 → 서명, 일 단위)
    // =====================================
    public double getAverageProposalToSignedDays(String companyName) {
        List<StandardEmploymentContract> contracts = contractRepo.findByEmployerName(companyName);
        if (contracts.isEmpty()) return 0.0;

        OptionalDouble avg = contracts.stream()
                .filter(c -> c.getProposalDate() != null && c.getSignedDate() != null)
                .mapToLong(StandardEmploymentContract::getProposalToSignedDays)
                .average();

        return avg.orElse(0.0);
    }

    // =====================================
    // 5. 최근 재무 데이터 기반 수익률
    // =====================================
    public double getProfitMargin(String companyName) {
        List<CompanyFinancial> financials = financialRepo.findByCompanyNameOrderByPeriodStartAsc(companyName);
        if (financials.isEmpty()) return 0.0;

        CompanyFinancial latest = financials.get(financials.size() - 1);
        return latest.getProfitMargin();
    }
}
