package org.zerock.signmate.Contract.domain;

public class enums {
    public enum UserType {
        PERSONAL, // 개인
        COMPANY   // 기업
    }

    public enum UserRole {
        USER,  // 일반 사용자
        ADMIN  // 관리자
    }

    public enum ContractStatus {
        DRAFT,    // 작성중
        PENDING,  // 서명 대기
        COMPLETED, // 서명 완료
        IN_PROGRESS // 진행중
    }

    public enum NotificationType {
        SIGN_REQUEST,  // 서명 요청
        SIGNED,        // 서명 완료 알림
        REMINDER       // 리마인더
    }

    public enum ContractType {
        EMPLOYMENT,  // 근로 계약서
        OUTSOURCING, // 업무위탁 계약서
        SECRET, // 비밀유지계약서
        SERVICE,     // 용역 계약서
        SUPPLY        // 자재/물품 공급계약서
    }

}
