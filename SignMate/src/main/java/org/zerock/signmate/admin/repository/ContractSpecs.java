package org.zerock.signmate.admin.repository;

import org.springframework.data.jpa.domain.Specification;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.enums;

import java.util.List;

public final class ContractSpecs {

    private ContractSpecs() {}

    /** 작성자/수신자 이름/이메일 LIKE 검색 */
    public static Specification<Contract> keywordLike(String keyword) {
        if (keyword == null || keyword.isBlank()) return null;
        String like = "%" + keyword.trim() + "%";
        return (root, q, cb) -> cb.or(
                cb.like(root.get("writer").get("name"), like),
                cb.like(root.get("writer").get("email"), like),
                cb.like(root.get("receiver").get("name"), like),
                cb.like(root.get("receiver").get("email"), like)
        );
    }

    /** 타입 일치 (enums.ContractType.name(), 대소문자 허용) */
    public static Specification<Contract> typeEq(String type) {
        if (type == null || type.isBlank()) return null;
        String v = type.trim().toUpperCase();
        return (root, q, cb) -> cb.equal(root.get("contractType"), enums.ContractType.valueOf(v));
    }

    /** 상태 in (대소문자 허용) */
    public static Specification<Contract> statusIn(List<String> statuses) {
        if (statuses == null || statuses.isEmpty()) return null;

        List<enums.ContractStatus> list = statuses.stream()
                .map(s -> s == null ? "" : s.trim())
                .filter(s -> !s.isEmpty())
                .map(String::toUpperCase)
                .map(enums.ContractStatus::valueOf)
                .toList();

        if (list.isEmpty()) return null;
        return (root, q, cb) -> root.get("status").in(list);
    }
}
