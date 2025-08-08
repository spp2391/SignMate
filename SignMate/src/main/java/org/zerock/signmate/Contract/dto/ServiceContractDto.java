package org.zerock.signmate.Contract.dto;


import lombok.*;

import java.time.LocalDate;


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class ServiceContractDto {
        private Long id; //

        private Long contractId;
        private String clientName;
        private String projectName;

        private LocalDate contractStartDate;
        private LocalDate contractEndDate;

        private String totalAmount;
        private String advancePayment;
        private String interimPayment;
        private String finalPayment;

        private String paymentTerms;

        private Boolean taxInvoice;
        private String paymentMethod;

        private String workDescription;
        private Boolean deliverOriginalFiles;

        private Integer revisionCount;
        private LocalDate deliveryDeadline;

        private String otherNotes;

        private LocalDate contractDate;
    }


