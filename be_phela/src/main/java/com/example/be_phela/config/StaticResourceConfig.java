package com.example.be_phela.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Value("${app.cv.upload-dir:uploads/cv}")
    private String cvUploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Cấu hình để serve CV files
        String cvPath = Paths.get(cvUploadDir).toAbsolutePath().normalize().toString();

        registry.addResourceHandler("/uploads/cv/**")
                .addResourceLocations("file:" + cvPath + "/")
                .setCachePeriod(3600); // Cache 1 hour

        // Có thể thêm các static resources khác nếu cần
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}