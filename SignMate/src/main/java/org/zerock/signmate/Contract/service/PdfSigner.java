package org.zerock.signmate.Contract.service;

import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;

@Service
public class PdfSigner {

    public File insertSignature(File originalPdf, BufferedImage signatureImage, String signerName) throws IOException {
        // PDF 불러오기
        PDDocument document = PDDocument.load(originalPdf);

        // 첫 페이지 가져오기 (필요 시 조정)
        PDPage page = document.getPage(0);

        // 서명 이미지 객체 생성
        PDImageXObject pdImage = PDImageXObject.createFromByteArray(document,
                bufferedImageToByteArray(signatureImage), "signature");

        // 페이지에 서명 이미지 삽입
        PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true);

        // 이미지 위치와 크기 (예: 오른쪽 하단)
        float x = 400, y = 100, width = 150, height = 50;

        contentStream.drawImage(pdImage, x, y, width, height);

        // 서명자 이름 텍스트 삽입
        contentStream.beginText();
        contentStream.setFont(org.apache.pdfbox.pdmodel.font.PDType1Font.HELVETICA_BOLD, 12);
        contentStream.newLineAtOffset(x, y - 15);
        contentStream.showText("서명자: " + signerName);
        contentStream.endText();

        contentStream.close();

        // 새 파일명 생성
        File signedPdfFile = new File(originalPdf.getParent(), "signed_" + originalPdf.getName());

        // 저장
        document.save(signedPdfFile);
        document.close();

        return signedPdfFile;
    }

    // BufferedImage → byte[] 변환 헬퍼
    private byte[] bufferedImageToByteArray(BufferedImage image) throws IOException {
        try (java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream()) {
            javax.imageio.ImageIO.write(image, "png", baos);
            return baos.toByteArray();
        }
    }
}
