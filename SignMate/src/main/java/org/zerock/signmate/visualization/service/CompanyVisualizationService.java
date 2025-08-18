// src/main/java/org/zerock/signmate/visualization/service/CompanyVisualizationService.java
package org.zerock.signmate.visualization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.business.domain.BusinessOutsourcingContract;
import org.zerock.signmate.Contract.domain.enums.ContractStatus;
import org.zerock.signmate.Contract.domain.*;
import org.zerock.signmate.Contract.newservice.domain.ServiceContractDocument;
import org.zerock.signmate.Contract.standard.domain.Standard;
import org.zerock.signmate.visualization.dto.CompanyOverviewDTO;
import org.zerock.signmate.visualization.repository.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyVisualizationService {

    private final StandardEmploymentContractRepository employmentRepo;
    private final ServiceContractDocumentRepository serviceRepo;
    private final BusinessOutsourcingContractRepository outsourcingRepo;
    private final SupplyContractRepository supplyRepo;
    private final SupplyItemRepository supplyItemRepo;
    private final NDAContractRepository ndaRepo;


    public CompanyOverviewDTO getCompanyOverview(String companyName) {

        // 1) Employment
        List<Standard> emps = employmentRepo.findByEmployerName(companyName);
        long empCount = emps.size();
        long empActive = employmentRepo.countByEmployerNameAndStatus(companyName, ContractStatus.ACTIVE);

        // 2) Service (clientName/contractorName 둘 다 매칭)
        List<ServiceContractDocument> services = serviceRepo.findByClientNameOrContractorName(companyName, companyName);
        long svcCount = serviceRepo.countByClientNameOrContractorName(companyName, companyName);
        long svcActive = serviceRepo.countByClientNameAndStatusOrContractorNameAndStatus(
                companyName, ContractStatus.SIGNED, companyName, ContractStatus.SIGNED
        );
        Double svcAvgDuration = services.stream()
                .mapToLong(s -> daysBetweenSafe(s.getContractStartDate(), s.getContractEndDate()))
                .filter(d -> d > 0)
                .average().orElse(0.0);
        Double svcTotalAmount = services.stream()
                .map(s -> s.getContractAmount() == null ? 0.0 : s.getContractAmount().doubleValue())
                .reduce(0.0, Double::sum);

        // 3) Outsourcing
        List<BusinessOutsourcingContract> outs = outsourcingRepo.findByClientNameOrContractorName(companyName, companyName);
        long outCount = outsourcingRepo.countByClientNameOrContractorName(companyName, companyName);
        long outActive = outsourcingRepo.countByClientNameAndStatusOrContractorNameAndStatus(
                companyName, ContractStatus.SIGNED, companyName, ContractStatus.SIGNED
        );
        Double outAvgDuration = outs.stream()
                .mapToLong(o -> daysBetweenSafe(o.getContractStartDate(), o.getContractEndDate()))
                .filter(d -> d > 0)
                .average().orElse(0.0);
        Double outTotalAmount = outs.stream()
                .map(o -> o.getTotalPaymentAmount() == null ? 0.0 : o.getTotalPaymentAmount().doubleValue())
                .reduce(0.0, Double::sum);

        // 4) Supply: 개수 + 금액(아이템 합)
        long supCount = supplyRepo.countBySupplierNameOrDemanderName(companyName, companyName);
        long supActive = supplyRepo.countBySupplierNameAndStatusOrDemanderNameAndStatus(
                companyName, ContractStatus.SIGNED, companyName, ContractStatus.SIGNED
        );
        Double supTotalAmount = supplyItemRepo.sumAmountByCompany(companyName);

        // 5) NDA
        long ndaCount = ndaRepo.countByDiscloserNameOrRecipientName(companyName, companyName);
        long ndaActive = ndaRepo.countByDiscloserNameAndStatusOrRecipientNameAndStatus(
                companyName, ContractStatus.SIGNED, companyName, ContractStatus.SIGNED
        );

        long totalDocs = empCount + svcCount + outCount + supCount + ndaCount;
        long totalActive = empActive + svcActive + outActive + supActive + ndaActive;

        Double grandTotal = (svcTotalAmount) + (outTotalAmount) + (supTotalAmount == null ? 0.0 : supTotalAmount);

        return CompanyOverviewDTO.builder()
                .companyName(companyName)

                .employmentCount(empCount)
                .serviceCount(svcCount)
                .outsourcingCount(outCount)
                .supplyCount(supCount)
                .ndaCount(ndaCount)
                .totalDocumentCount(totalDocs)

                .activeEmploymentCount(empActive)
                .activeServiceCount(svcActive)
                .activeOutsourcingCount(outActive)
                .activeSupplyCount(supActive)
                .activeNdaCount(ndaActive)
                .totalActiveCount(totalActive)
                .avgServiceDurationDays(round1(svcAvgDuration))
                .avgOutsourcingDurationDays(round1(outAvgDuration))

                .totalServiceAmount(round0(svcTotalAmount))
                .totalOutsourcingAmount(round0(outTotalAmount))
                .totalSupplyAmount(round0(supTotalAmount == null ? 0.0 : supTotalAmount))
                .grandTotalAmount(round0(grandTotal))

                .build();
    }

    private long daysBetweenSafe(LocalDate s, LocalDate e) {
        if (s == null || e == null) return 0;
        return ChronoUnit.DAYS.between(s, e);
    }

    private Double round1(Double v) {
        return v == null ? 0.0 : Math.round(v * 10.0) / 10.0;
    }

    private Double round0(Double v) {
        return v == null ? 0.0 : (double) Math.round(v);
    }
}
