package org.zerock.signmate.finance.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.zerock.signmate.finance.dto.CompanyStatisticsDTO;
import org.zerock.signmate.finance.service.StatisticsService;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/{companyName}")
    public CompanyStatisticsDTO getCompanyStatistics(@PathVariable String companyName) {
        return statisticsService.getCompanyStatistics(companyName);
    }
}
