package org.zerock.signmate.notice.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {

    private final String UPLOAD_DIR = "uploads/";

    public String saveFile(MultipartFile file) throws IOException {
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) dir.mkdirs();

//        String uuid = UUID.randomUUID().toString();
//        String ext = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
//        String saveName = uuid + ext;
//
//
//        File saveFile = new File(UPLOAD_DIR + saveName);
//        file.transferTo(saveFile); // 실제 파일 저장
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR, fileName);
        Files.write(filePath, file.getBytes());

        return "/api/image/view/" + fileName; // React에서 접근 가능한 URL
    }
}

