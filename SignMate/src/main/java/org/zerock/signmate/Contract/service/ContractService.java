package org.zerock.signmate.Contract.service;

import org.springframework.stereotype.Service;
import java.io.File;

@Service
public class ContractService {

    // 계약서 PDF 파일 저장 위치 (예: 로컬 경로)
    private final String pdfBasePath = "/contracts/pdf/";

    // 계약서 원본 PDF 불러오기
    public File loadOriginalPdf(Long contractId) {
        // 예시: contractId 기반으로 파일 경로 생성
        String filePath = pdfBasePath + "contract_" + contractId + ".pdf";
        return new File(filePath);
    }

    // 계약서 서명 완료 상태로 DB 업데이트 (간단 예시)
    public void markAsSigned(Long contractId, String signerName, String signerEmail) {
        // TODO: 실제 DB 업데이트 로직 작성
        System.out.println("Contract " + contractId + " signed by " + signerName + " (" + signerEmail + ")");
    }
}

