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
        return uploadToCloudinary(file, "products");
    }

    public String storeNewsThumbnail(MultipartFile file) throws IOException {
        return uploadToCloudinary(file, "news");
    }

    public String storeBannerImage(MultipartFile file) throws IOException {
        return uploadToCloudinary(file, "banners");
    }

    private String uploadToCloudinary(MultipartFile file, String folderName) throws IOException {
        if (file == null || file.isEmpty()) {

            return null;
        }

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "upload_preset", "phe_la",
                "folder", folderName
        ));

        return (String) uploadResult.get("secure_url");
    }

}