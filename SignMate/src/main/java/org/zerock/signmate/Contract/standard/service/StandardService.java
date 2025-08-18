package org.zerock.signmate.Contract.standard.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.zerock.signmate.Contract.Repository.ContractRepository;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.enums;
import org.zerock.signmate.Contract.standard.domain.Standard;
import org.zerock.signmate.Contract.standard.dto.StandardDTO;
import org.zerock.signmate.Contract.standard.repository.StandardRepository;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StandardService {

    private final StandardRepository standardRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;

    @Transactional
    public StandardDTO addOrUpdateStandard(StandardDTO dto) {
        // 1. 작성자(사업주) 유저 조회

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginEmail = authentication.getName();

        User writer = userRepository.findByName(dto.getEmployerName())
                .orElseThrow(() -> new EntityNotFoundException("작성자(사업주) 유저가 없습니다: " + dto.getEmployerName()));

        // 2. 수신자(근로자) 유저 조회
        User receiver = null;
        if (dto.getEmployeeName() != null && !dto.getEmployeeName().isBlank()) {
            receiver = userRepository.findByName(dto.getEmployeeName())
                    .orElseThrow(() -> new EntityNotFoundException("근로자 유저가 없습니다: " + dto.getEmployeeName()));
        }

        // 3. 계약서 조회 or 생성
        Contract contract = dto.getContractId() == null
                ? Contract.builder()
                .contractType(enums.ContractType.EMPLOYMENT) // ✅ 고용계약
                .writer(writer)
                .receiver(receiver)
                .build()
                : contractRepository.findById(dto.getContractId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + dto.getContractId()));

        contract.setWriter(writer);
        contract.setReceiver(receiver);
        contractRepository.save(contract);

        // 4. Standard 조회 or 신규 생성
        Standard standard = standardRepository.findByContract(contract)
                .orElseGet(() -> Standard.builder().contract(contract).build());

        // 5. DTO → Entity 필드 복사
        standard.setEmployerName(dto.getEmployerName());
        standard.setEmployerRepresentative(dto.getEmployerRepresentative());
        standard.setEmployerAddress(dto.getEmployerAddress());

        standard.setEmployeeName(dto.getEmployeeName());
        standard.setEmployeeAddress(dto.getEmployeeAddress());
        standard.setEmployeeContact(dto.getEmployeeContact());

        standard.setWorkStartYear(dto.getWorkStartYear());
        standard.setWorkStartMonth(dto.getWorkStartMonth());
        standard.setWorkStartDay(dto.getWorkStartDay());

        standard.setWorkLocation(dto.getWorkLocation());
        standard.setWorkDescription(dto.getWorkDescription());

        standard.setWorkStartHour(dto.getWorkStartHour());
        standard.setWorkEndHour(dto.getWorkEndHour());

        standard.setBreakHour(dto.getBreakHour());
        standard.setBreakMinute(dto.getBreakMinute());

        standard.setWorkDays(dto.getWorkDays());
        standard.setWeeklyHoliday(dto.getWeeklyHoliday());

        standard.setWageAmount(dto.getWageAmount());
        standard.setBonus(dto.getBonus());
        standard.setOtherAllowance(dto.getOtherAllowance());
        standard.setWagePaymentDate(dto.getWagePaymentDate());
        standard.setPaymentMethod(dto.getPaymentMethod());

        standard.setNationalPension(dto.getNationalPension());
        standard.setHealthInsurance(dto.getHealthInsurance());
        standard.setEmploymentInsurance(dto.getEmploymentInsurance());
        standard.setIndustrialAccidentInsurance(dto.getIndustrialAccidentInsurance());

        standard.setWriterSignature(dto.getWriterSignature());
        standard.setReceiverSignature(dto.getReceiverSignature());

        // 6. 저장 후 DTO 변환 반환
        return StandardDTO.fromEntity(standardRepository.save(standard));
    }

    public StandardDTO findById(Long id) {
        Optional<Standard> opt = standardRepository.findById(id);
        return opt.map(StandardDTO::fromEntity).orElse(null);
    }

    public void deleteById(Long id) {
        standardRepository.deleteById(id);
    }

    // ContractId로 Standard 조회
    public StandardDTO findByContractId(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 계약서 ID: " + contractId));
        Standard standard = standardRepository.findByContract(contract)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 Standard가 존재하지 않습니다. contractId=" + contractId));
        return StandardDTO.fromEntity(standard);
    }
}
