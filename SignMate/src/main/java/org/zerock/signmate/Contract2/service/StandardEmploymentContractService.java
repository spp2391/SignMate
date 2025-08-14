package org.zerock.signmate.Contract2.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract2.domain.StandardEmploymentContract;
import org.zerock.signmate.Contract2.repository.StandardEmploymentContractRepository;

@Service
@RequiredArgsConstructor
public class StandardEmploymentContractService {

    private final StandardEmploymentContractRepository contractRepo;

    // 활성 계약 수 계산
    public long countActiveContracts(String companyName) {
        return contractRepo.findActiveByEmployerName(companyName).size();
    }

    // 예시: 계약 평균 기간 계산
    public double calculateAverageContractDuration(String companyName) {
        var activeContracts = contractRepo.findByEmployerName(companyName);
        return activeContracts.stream()
                .mapToLong(c -> c.getContractDurationDays())
                .average()
                .orElse(0.0);
    }
}
