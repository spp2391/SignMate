package org.zerock.signmate.Contract.domain;

import jakarta.persistence.*;
import org.zerock.signmate.user.domain.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "signature")
public class Signature {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long signatureId;

    @ManyToOne
    @JoinColumn(name = "contract_id")
    private Contract contract;

    @ManyToOne
    @JoinColumn(name = "signer_id")
    private User signer;

    @Column(columnDefinition = "TEXT")
    private String signatureImage; // Base64 or URL

    private String signatureHash; // 위변조 방지용

    private LocalDateTime signedAt;
}

