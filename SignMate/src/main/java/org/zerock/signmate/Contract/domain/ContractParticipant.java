package org.zerock.signmate.Contract.domain;

import jakarta.persistence.*;
import org.zerock.signmate.user.domain.User;

@Entity
@Table(name = "contract_participant")
public class ContractParticipant {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long participantId;

    @ManyToOne
    @JoinColumn(name = "contract_id")
    private Contract contract;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private enums.RoleInContract roleInContract; // 갑, 을, 병

    private Boolean canEdit;
}

