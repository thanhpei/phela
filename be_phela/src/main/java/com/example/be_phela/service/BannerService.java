package com.example.be_phela.service;

import com.example.be_phela.dto.response.BannerResponseDTO;
import com.example.be_phela.model.Banner;
import com.example.be_phela.model.enums.BannerStatus;
import com.example.be_phela.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;
    private final FileStorageService fileStorageService;


    @Transactional
    public BannerResponseDTO createBanner(MultipartFile file) throws IOException {
        String imageUrl = fileStorageService.storeBannerImage(file);
        LocalDateTime now = LocalDateTime.now();

        Banner banner = Banner.builder()
                .imageUrl(imageUrl)
                .status(BannerStatus.ACTIVE)
                .createdAt(now)
                .updatedAt(now)
                .build();

        bannerRepository.save(banner);
        return mapToResponseDTO(banner);
    }

    @Transactional(readOnly = true)
    public List<BannerResponseDTO> getAllBannersForAdmin() {
        return bannerRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BannerResponseDTO updateBannerStatus(String bannerId, BannerStatus status) {
        Banner banner = bannerRepository.findById(bannerId)
                .orElseThrow(() -> new RuntimeException("Banner not found with id: " + bannerId));

        banner.setStatus(status);
        banner.setUpdatedAt(LocalDateTime.now());

        bannerRepository.save(banner);
        return mapToResponseDTO(banner);
    }

    @Transactional
    public void deleteBanner(String bannerId) {
        if (!bannerRepository.existsById(bannerId)) {
            throw new RuntimeException("Banner not found with id: " + bannerId);
        }
        // có thể xóa ảnh trên cloud
        bannerRepository.deleteById(bannerId);
    }


    @Transactional(readOnly = true)
    public List<BannerResponseDTO> getLatestActiveBanners() {
        return bannerRepository.findTop5ByStatusOrderByCreatedAtDesc(BannerStatus.ACTIVE)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }


    private BannerResponseDTO mapToResponseDTO(Banner banner) {
        return BannerResponseDTO.builder()
                .bannerId(banner.getBannerId())
                .imageUrl(banner.getImageUrl())
                .createdAt(banner.getCreatedAt())
                .status(banner.getStatus())
                .build();
    }
}