package org.zerock.signmate.Contract2.domain;

import jakarta.persistence.*;
import lombok.*;
import org.zerock.signmate.Contract.domain.CommonEntity;
import org.zerock.signmate.Contract.domain.enums;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "supply_contract")
public class SupplyContract extends CommonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 공급자(갑)
    private String supplierName;
    private String supplierRepresentative;

    // 수요자(을)
    private String demanderName;
    private String demanderRepresentative;

    private LocalDate contractDate;
    private String deliveryLocation;

    @Column(columnDefinition = "TEXT")
    private String deliveryTerms;

    @Column(columnDefinition = "TEXT")
    private String inspectionAndWarranty;

    @Column(columnDefinition = "TEXT")
    private String paymentTerms;

    @Column(columnDefinition = "TEXT")
    private String qualityGuaranteeTerms;

    @Column(columnDefinition = "TEXT")
    private String otherTerms;

    @Lob
    @Column(name = "supplier_signature")
    private String supplierSignature;

    @Lob
    @Column(name = "demander_signature")
    private String demanderSignature;

    @OneToMany(mappedBy = "supplyContract", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SupplyItem> items = new ArrayList<>();

    // 상태 및 이력
    @Enumerated(EnumType.STRING)
    private enums.ContractStatus status;       // DRAFT, SIGNED, TERMINATED
    private Integer version;
}
