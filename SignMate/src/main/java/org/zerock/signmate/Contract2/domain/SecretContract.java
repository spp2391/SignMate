package org.zerock.signmate.Contract2.domain;

import jakarta.persistence.*;
import org.zerock.signmate.Contract.domain.Template;
import org.zerock.signmate.user.domain.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "secretcontract")
public class SecretContract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contractId;

    @ManyToOne
    @JoinColumn(name = "template_id")
    private Template template;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @Enumerated(EnumType.STRING)
    private org.zerock.signmate.Contract.domain.Contract.Status status; // DRAFT, PENDING, SIGNED

    private String pdfPath;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum Status { DRAFT, PENDING, SIGNED }
}

