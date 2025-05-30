package com.example.be_phela.interService;

import com.example.be_phela.dto.request.PromotionCreateDTO;
import com.example.be_phela.dto.response.PromotionResponseDTO;

public interface IPromotionService {
    PromotionResponseDTO createPromotion(PromotionCreateDTO createDTO);
    PromotionResponseDTO updatePromotion(String promotionId, PromotionCreateDTO createDTO);
    void deletePromotion(String promotionId);
    PromotionResponseDTO getPromotionById(String promotionId);
}
