package org.zerock.signmate.Contract.secret.domain;

import jakarta.persistence.*;
import lombok.*;
import org.zerock.signmate.Contract.domain.CommonEntity;
import org.zerock.signmate.Contract.domain.Contract;
import org.zerock.signmate.Contract.domain.enums;
import org.zerock.signmate.user.domain.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "secret")
public class Secret {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id")
    private Contract contract;

    // 1. 당사자 정보



    private String discloserRepresentative;  // 공개자 대표 (#2)
    private String discloserAddress;    // 공개자 주소 (#3)




    private String receiverRepresentative;    // 수신자 대표 (#5)
    private String receiverAddress;     // 수신자 주소 (#6)

    // 2. 목적 (#7)
    @Column(length = 1000)
    private String purpose;

    // 6. 계약기간 - 발효일 (#8), 계약기간 개월수 (#9)
    private LocalDateTime effectiveDate;
    private Integer contractDurationMonths;

    // 7. 존속기간 (계약 종료 후 유지 기간, 년 단위) (#10)
    private Integer confidentialityDurationYears;

    // 10. 준거법 및 관할 (#11) - 예: "대한민국 법"
    private String governingLaw;

    // 서명 이미지나 서명 텍스트
    @Lob
    @Column(name = "writer_signature",columnDefinition = "TEXT")
    private String writerSignature;  // base64

    @Lob
    @Column(name = "receiver_signature",columnDefinition = "TEXT")
    private String receiverSignature; // base64

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id")
//    private User user;

}

