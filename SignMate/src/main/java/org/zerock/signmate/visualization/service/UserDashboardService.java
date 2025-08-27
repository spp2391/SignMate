// src/main/java/org/zerock/signmate/visualization/service/UserDashboardService.java
package org.zerock.signmate.visualization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.business.repository.BusinessOutsourcingContractRepository;
import org.zerock.signmate.Contract.dto.UnifiedContractDto;
import org.zerock.signmate.visualization.dto.UserDashboardDTO;
import org.zerock.signmate.visualization.repository.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDashboardService {

    private final StandardEmploymentContractRepository employmentRepo;
    private final ServiceContractDocumentRepository serviceRepo;
    private final BusinessOutsourcingContractRepository outsourcingRepo;
    private final SupplyContractRepository supplyRepo;
    private final NDAContractRepository ndaRepo;



    public UserDashboardDTO getUserDashboard(Long userId) {
        List<UnifiedContractDto> contracts = getAllContractsForUser(userId);

        long total = contracts.size();
        long active = contracts.stream()
                .filter(c -> c.getContractEndDate() != null && c.getContractEndDate().isAfter(LocalDateTime.now()))
                .count();
        long completed = contracts.stream()
                .filter(c -> c.getContractEndDate() != null && !c.getContractEndDate().isAfter(LocalDateTime.now()))
                .count();

        long standardCount = contracts.stream().filter(c -> "STANDARD".equals(c.getType())).count();
        long secretCount   = contracts.stream().filter(c -> "SECRET".equals(c.getType())).count();
        long supplyCount   = contracts.stream().filter(c -> "SUPPLY".equals(c.getType())).count();
        long outsourcingCount = contracts.stream().filter(c -> "OUTSOURCING".equals(c.getType())).count();

        double totalAmount = contracts.stream()
                .mapToDouble(c -> {
                    try {
                        return c.getTotalAmount() == null ? 0.0 : Double.parseDouble(c.getTotalAmount());
                    } catch (NumberFormatException e) {
                        return 0.0;
                    }
                })
                .sum();

        return UserDashboardDTO.builder()
                .totalContracts(total)
                .activeContracts(active)
                .completedContracts(completed)
                .standardCount(standardCount)
                .secretCount(secretCount)
                .supplyCount(supplyCount)
                .outsourcingCount(outsourcingCount)
                .totalAmount(totalAmount)
                .build();
    }

    // 여기서 실제로 DB에서 유저 기준 모든 계약 가져오기
    private List<UnifiedContractDto> getAllContractsForUser(Long userId) {
        // 예: 각 Repository에서 writerId 또는 receiverId로 조회 후 DTO 변환
        // 예시 반환 (실제 구현에서는 Repository 호출 필요)
        return List.of();
    }
}
