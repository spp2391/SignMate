package org.zerock.signmate.finance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.signmate.finance.domain.CompanyFinancial;

import java.util.List;

public interface CompanyFinancialRepository extends JpaRepository<CompanyFinancial, Long> {
    List<CompanyFinancial> findByCompanyNameOrderByPeriodStartAsc(String companyName);
}
