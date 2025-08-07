package org.zerock.signmate.Contract.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "templates")
public class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long templateId;

    private String templateName;

    @Lob
    private String templateBody;

    @Lob
    private String fieldsJson; // JSON 문자열 그대로 저장

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private LocalDateTime createdAt;
}
