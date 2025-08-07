package org.zerock.signmate.Contract.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.signmate.Contract.service.ContractService;
import org.zerock.signmate.Contract.service.EmailService;
import org.zerock.signmate.Contract.service.PdfSigner;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractService contractService;
    private final PdfSigner pdfSigner;
    private final EmailService emailService;

    public ContractController(ContractService contractService, PdfSigner pdfSigner, EmailService emailService) {
        this.contractService = contractService;
        this.pdfSigner = pdfSigner;
        this.emailService = emailService;
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitSignedContract(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("signature") MultipartFile signatureImage,
            @RequestParam("contractId") Long contractId
    ) {
        try {
            // 1. 계약서 원본 PDF 불러오기
            File pdfFile = contractService.loadOriginalPdf(contractId);

            // 2. 서명 이미지 읽기
            BufferedImage signature = ImageIO.read(signatureImage.getInputStream());

            // 3. PDF에 서명 및 이름 삽입
            File signedPdf = pdfSigner.insertSignature(pdfFile, signature, name);

            // 4. DB 상태 업데이트 (서명 완료 처리)
            contractService.markAsSigned(contractId, name, email);

            // 5. 서명된 PDF 이메일 전송
            emailService.sendSignedPdf(email, signedPdf);

            return ResponseEntity.ok("서명 제출 완료");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서명 제출 중 오류가 발생했습니다.");
        }
    }
}
