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
import org.zerock.signmate.notification.service.NotificationService;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;
import org.zerock.signmate.visualization.repository.StandardEmploymentContractRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StandardService {

    private final StandardRepository standardRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;
    private final NotificationService notificationService;

    // 로그인된 사용자 가져오기
    private final StandardEmploymentContractRepository standardRepo;

    public List<Standard> getMyContracts(User loginUser) {
        return standardRepo.findByContract_Writer(loginUser);
    }

    @Transactional
    public StandardDTO addOrUpdateStandard(StandardDTO dto) {
        // 1. 로그인 사용자
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String loginUser = authentication.getName();

        User loginUserEntity = userRepository.findByName(loginUser)
                .orElseThrow(() -> new EntityNotFoundException("로그인 유저를 찾을 수 없습니다: " + loginUser));

        // 2. 수신자(근로자) 유저 조회
        User receiver = null;
        if (dto.getEmployeeName() != null && !dto.getEmployeeName().isBlank()) {
            receiver = userRepository.findByName(dto.getEmployeeName())
                    .orElseThrow(() -> new EntityNotFoundException("근로자 유저가 없습니다: " + dto.getEmployeeName()));
        }

        // 3. 계약서 조회 or 신규 생성
        Contract contract;
        if (dto.getContractId() != null) {
            contract = contractRepository.findById(dto.getContractId())
                    .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 계약서 ID: " + dto.getContractId()));
            // 기존 계약이라면 writer 유지, receiver만 업데이트
            if (receiver != null) contract.setReceiver(receiver);
        } else {
            // 신규 생성 시 로그인 유저가 writer
            contract = Contract.builder()
                    .contractType(enums.ContractType.EMPLOYMENT)
                    .writer(loginUserEntity)
                    .receiver(receiver)
                    .status(enums.ContractStatus.DRAFT)
                    .build();
            contractRepository.save(contract);
        }

        // DRAFT 상태라면 IN_PROGRESS로 변경
        if (contract.getStatus() == enums.ContractStatus.DRAFT) {
            contract.setStatus(enums.ContractStatus.IN_PROGRESS);
            contractRepository.save(contract);
        }

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

        // 6. 로그인 사용자에 따라 서명 설정
        if (loginUserEntity.equals(contract.getWriter())) {
            standard.setWriterSignature(dto.getWriterSignature());
        } else if (loginUserEntity.equals(contract.getReceiver())) {
            standard.setReceiverSignature(dto.getReceiverSignature());
        }

        Standard savedStandard = standardRepository.save(standard);

        // 7. 알림 처리
        LocalDateTime now = LocalDateTime.now();
        String msg;
        if (standard.getWriterSignature() != null && standard.getReceiverSignature() != null) {
            contract.setStatus(enums.ContractStatus.COMPLETED);
            contractRepository.save(contract);
            msg = "고용계약서가 완료되었습니다.";
        } else {
            msg = "고용계약서가 작성/수정되었습니다.";
        }

        notificationService.notifyUser(contract.getWriter(), contract, msg, now);
        if (contract.getReceiver() != null && !contract.getReceiver().equals(contract.getWriter())) {
            notificationService.notifyUser(contract.getReceiver(), contract, msg, now);
        }

        return StandardDTO.fromEntity(savedStandard);
    }

    // ContractId로 Standard 조회
    public StandardDTO findByContractId(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 계약서 ID: " + contractId));
        Standard standard = standardRepository.findByContract(contract)
                .orElseThrow(() -> new RuntimeException("해당 계약서에 Standard가 존재하지 않습니다. contractId=" + contractId));
        return StandardDTO.fromEntity(standard);
    }

    // ID로 조회
    public StandardDTO findById(Long id) {
        Optional<Standard> opt = standardRepository.findById(id);
        return opt.map(StandardDTO::fromEntity).orElse(null);
    }

    // ID로 삭제
    public void deleteById(Long id) {
        standardRepository.deleteById(id);
    }
}
