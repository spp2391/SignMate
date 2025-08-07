package org.zerock.signmate.Contract.domain;

import jakarta.persistence.*;
import org.zerock.signmate.user.domain.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "contract_field_values")
public class ContractFieldValue {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fieldId;

    @ManyToOne
    @JoinColumn(name = "contract_id")
    private Contract contract;

    private String fieldName;

    @Lob
    private String fieldValue;
}



