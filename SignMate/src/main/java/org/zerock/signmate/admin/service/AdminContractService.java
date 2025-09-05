package org.zerock.signmate.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.signmate.admin.dto.ContractDetailDto;
import org.zerock.signmate.admin.dto.ContractListDto;
import org.zerock.signmate.admin.dto.UpdateContractRequest;
import org.zerock.signmate.admin.repository.AdminContractRepository;
import org.zerock.signmate.admin.repository.ContractSpecs;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.enums;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminContractService {

    private final AdminContractRepository repo;
    private final UserRepository userRepo;

    /** 목록 조회 (keyword, type, statusCSV 필터) */
    public Page<ContractListDto> list(String keyword, String type, String statusCsv, Pageable pageable) {
        List<String> statuses = (statusCsv == null || statusCsv.isBlank())
                ? List.of()
                : Arrays.stream(statusCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        Specification<Contract> spec = Specification
                .where(ContractSpecs.keywordLike(keyword))
                .and(ContractSpecs.typeEq(type))
                .and(ContractSpecs.statusIn(statuses));

        return repo.findAll(spec, pageable).map(ContractListDto::from);
    }

    /** 단건 조회 */
    public ContractDetailDto get(Long id) {
        Contract c = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("contract not found"));
        return ContractDetailDto.from(c);
    }

    /** 일부 수정(PATCH) */
    @Transactional
    public ContractDetailDto update(Long id, UpdateContractRequest req) {
        Contract c = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("contract not found"));

        // type/status는 대소문자 혼용 입력을 허용하고 ENUM으로 변환
        if (req.getType() != null && !req.getType().isBlank()) {
            c.setContractType(parseEnum(enums.ContractType.class, req.getType()));
        }
        if (req.getStatus() != null && !req.getStatus().isBlank()) {
            c.setStatus(parseEnum(enums.ContractStatus.class, req.getStatus()));
        }

        if (req.getWriterId() != null) {
            User writer = userRepo.findById(req.getWriterId())
                    .orElseThrow(() -> new IllegalArgumentException("writer not found"));
            c.setWriter(writer);
        }
        if (req.getReceiverId() != null) {
            User receiver = userRepo.findById(req.getReceiverId())
                    .orElseThrow(() -> new IllegalArgumentException("receiver not found"));
            c.setReceiver(receiver);
        }

        if (req.getWriterSignature() != null) {
            c.setWriterSignature(req.getWriterSignature());
        }
        if (req.getReceiverSignature() != null) {
            c.setReceiverSignature(req.getReceiverSignature());
        }

        return ContractDetailDto.from(c);
    }

    /** 삭제 */
    @Transactional
    public void delete(Long id) {
        Contract c = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("contract not found"));
        repo.delete(c);
    }

    /** ENUM 파싱 유틸(대소문자 무시) */
    private static <E extends Enum<E>> E parseEnum(Class<E> enumType, String value) {
        return Enum.valueOf(enumType, value.trim().toUpperCase());
    }
}
