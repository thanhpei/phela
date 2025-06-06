package com.example.be_phela.model;

import com.example.be_phela.model.enums.BannerStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "banner")
public class Banner {
    @Id
    @UuidGenerator
    @Column(name = "banner_id", nullable = false, unique = true)
    private String bannerId;
    @Column(name = "imageUrl")
    private String imageUrl;
    @Column(name = "createdAt")
    private LocalDateTime createdAt;
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;
    @Column(name = "status")
    private BannerStatus status;
}
