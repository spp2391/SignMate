//package org.zerock.signmate.finance.controller;
//
//import org.springframework.web.bind.annotation.*;
//import org.zerock.signmate.finance.dto.CompanyStatisticsDTO;
//import org.zerock.signmate.finance.service.StatisticsService;
//
//@RestController
//@RequestMapping("/api/statistics")
//@CrossOrigin(origins = "http://localhost:3001") // React dev server 허용
//public class StatisticsController {
//
//    private final StatisticsService statisticsService;
//
//    public StatisticsController(StatisticsService statisticsService) {
//        this.statisticsService = statisticsService;
//    }
//
//    @GetMapping("/{companyName}")
//    public CompanyStatisticsDTO getStatistics(@PathVariable String companyName) {
//        return statisticsService.getCompanyStatistics(companyName);
//    }
//}
