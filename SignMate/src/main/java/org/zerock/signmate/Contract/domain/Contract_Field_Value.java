package org.zerock.signmate.Contract.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "contracts")
public class Contract {

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
    private Status status; // DRAFT, PENDING, SIGNED

    private String pdfPath;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum Status { DRAFT, PENDING, SIGNED }
}


