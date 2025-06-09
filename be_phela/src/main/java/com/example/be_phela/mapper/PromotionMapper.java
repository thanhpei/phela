package com.example.be_phela.mapper;

import com.example.be_phela.dto.request.PromotionCreateDTO;
import com.example.be_phela.dto.response.PromotionResponseDTO;
import com.example.be_phela.model.Promotion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PromotionMapper {

    @Mapping(target = "promotionId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "promotionCarts", ignore = true)
    Promotion toPromotion(PromotionCreateDTO createDTO);

    PromotionResponseDTO toResponseDTO(Promotion promotion);

    @Mapping(target = "promotionId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "promotionCarts", ignore = true)
    void updatePromotionFromDTO(PromotionCreateDTO createDTO, @MappingTarget Promotion promotion);
}
