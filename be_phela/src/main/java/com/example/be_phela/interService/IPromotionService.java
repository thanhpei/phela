package com.example.be_phela.interService;

import com.example.be_phela.dto.request.PromotionCreateDTO;
import com.example.be_phela.dto.response.PromotionResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IPromotionService {
    PromotionResponseDTO createPromotion(PromotionCreateDTO createDTO);
    PromotionResponseDTO updatePromotion(String promotionId, PromotionCreateDTO createDTO);
    void deletePromotion(String promotionId);
    PromotionResponseDTO getPromotionById(String promotionId);
    Page<PromotionResponseDTO> getAllPromotions(Pageable pageable);
    List<PromotionResponseDTO> getActivePromotions();

}
