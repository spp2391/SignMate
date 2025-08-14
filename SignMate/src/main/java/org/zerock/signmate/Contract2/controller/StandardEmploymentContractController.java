package org.zerock.signmate.Contract2.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.Contract2.service.StandardEmploymentContractService;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class StandardEmploymentContractController {

    private final StandardEmploymentContractService contractService;

    // 활성 계약 수 조회
    @GetMapping("/active-count")
    public long getActiveContracts(@RequestParam String companyName) {
        return contractService.countActiveContracts(companyName);
    }

    // 평균 계약 기간 조회
    @GetMapping("/average-duration")
    public double getAverageDuration(@RequestParam String companyName) {
        return contractService.calculateAverageContractDuration(companyName);
    }
}
