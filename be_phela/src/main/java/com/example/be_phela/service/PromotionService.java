package com.example.be_phela.service;

import com.example.be_phela.dto.request.PromotionCreateDTO;
import com.example.be_phela.dto.response.PromotionResponseDTO;
import com.example.be_phela.interService.IPromotionService;
import com.example.be_phela.mapper.PromotionMapper;
import com.example.be_phela.model.Promotion;
import com.example.be_phela.model.enums.PromotionStatus;
import com.example.be_phela.repository.PromotionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PromotionService implements IPromotionService {
    PromotionRepository promotionRepository;
    PromotionMapper promotionMapper;

    private String generatePromotionCode() {
        long count = promotionRepository.count();
        return String.format("KM%04d", count + 1);
    }

    @Override
    @Transactional
    public PromotionResponseDTO createPromotion(PromotionCreateDTO createDTO) {

        // Kiểm tra ngày hợp lệ
        if (createDTO.getStartDate().isAfter(createDTO.getEndDate())) {
            throw new RuntimeException("Start date must be before end date");
        }

        Promotion promotion = promotionMapper.toPromotion(createDTO);
        promotion.setPromotionCode(generatePromotionCode());
        Promotion savedPromotion = promotionRepository.save(promotion);
        return promotionMapper.toResponseDTO(savedPromotion);
    }

    @Override
    @Transactional
    public PromotionResponseDTO updatePromotion(String promotionId, PromotionCreateDTO createDTO) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + promotionId));

        // Kiểm tra ngày hợp lệ
        if (createDTO.getStartDate().isAfter(createDTO.getEndDate())) {
            throw new RuntimeException("Start date must be before end date");
        }

        promotionMapper.updatePromotionFromDTO(createDTO, promotion);
        Promotion updatedPromotion = promotionRepository.save(promotion);
        return promotionMapper.toResponseDTO(updatedPromotion);
    }

    @Override
    @Transactional
    public void deletePromotion(String promotionId) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + promotionId));
        promotion.setStatus(PromotionStatus.INACTIVE); // Đặt trạng thái INACTIVE thay vì xóa vật lý
        promotionRepository.save(promotion);
    }

    @Override
    @Transactional(readOnly = true)
    public PromotionResponseDTO getPromotionById(String promotionId) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id: " + promotionId));
        return promotionMapper.toResponseDTO(promotion);
    }
}
