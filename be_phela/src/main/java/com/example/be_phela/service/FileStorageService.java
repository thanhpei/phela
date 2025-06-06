package com.example.be_phela.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class FileStorageService {
    @Autowired
    private Cloudinary cloudinary;

    public String storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("File is null or empty");
        }

        // Upload file lên Cloudinary
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "upload_preset", "phe_la",
                "folder", "products"
        ));

        // Lấy URL của ảnh từ Cloudinary
        String imageUrl = (String) uploadResult.get("secure_url");
        return imageUrl;
    }


}