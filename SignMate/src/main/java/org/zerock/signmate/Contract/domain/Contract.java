package org.zerock.signmate.Contract.domain;

import jakarta.persistence.*;
import lombok.*;
import org.zerock.signmate.user.domain.User;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "contract")
public class Contract extends CommonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private enums.ContractType contractType; // SERVICE, EMPLOYMENT 등

    @Enumerated(EnumType.STRING)
    private enums.ContractStatus status;

    @ManyToOne
    @JoinColumn(name = "writer_id")
    private User writer;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @Lob
    @Column(name = "writer_signature",columnDefinition = "LONGTEXT")
    private String writerSignature;  // base64

    @Lob
    @Column(name = "receiver_signature",columnDefinition = "LONGTEXT")
    private String receiverSignature; // base64

    @Version
    private Long version; // Optimistic Locking

}



