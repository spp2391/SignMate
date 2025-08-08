package org.zerock.signmate.Contract.domain;

import jakarta.persistence.*;
import org.zerock.signmate.user.domain.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "contract")
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private enums.ContractType contractType; // SERVICE, EMPLOYMENT 등

    @Enumerated(EnumType.STRING)
    private enums.ContractStatus status; // DRAFT, PENDING, SIGNED

    private String pdfPath; // 최종 PDF 경로

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

