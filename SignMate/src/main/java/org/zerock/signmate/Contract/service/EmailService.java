package org.zerock.signmate.Contract.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.io.File;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // 서명된 PDF 첨부해 이메일 발송
    public void sendSignedPdf(String recipientEmail, File signedPdf) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(recipientEmail);
        helper.setSubject("서명 완료된 계약서 전달");
        helper.setText("안녕하세요. 서명 완료된 계약서를 첨부해드립니다.");

        helper.addAttachment(signedPdf.getName(), signedPdf);

        mailSender.send(message);
    }
}

