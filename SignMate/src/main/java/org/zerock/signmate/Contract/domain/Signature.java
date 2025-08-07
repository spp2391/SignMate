package org.zerock.signmate.Contract.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "signatures")
public class Signature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long signatureId;

    @ManyToOne
    @JoinColumn(name = "contract_id")
    private Contract contract;

    @ManyToOne
    @JoinColumn(name = "signer_id")
    private User signer;

    @Lob
    private String signatureImage; // Base64 또는 URL

    private String signatureHash;

    private LocalDateTime signedAt;
}
