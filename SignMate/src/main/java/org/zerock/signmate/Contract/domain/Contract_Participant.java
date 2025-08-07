package org.zerock.signmate.Contract.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "contract_participants")
public class ContractParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long participantId;

    @ManyToOne
    @JoinColumn(name = "contract_id")
    private Contract contract;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private RoleInContract roleInContract; // 갑, 을

    private boolean canEdit;

    public enum RoleInContract { 갑, 을 }
}

