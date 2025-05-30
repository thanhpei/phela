package com.example.be_phela.dto.response;

import com.example.be_phela.model.enums.DiscountType;
import com.example.be_phela.model.enums.PromotionStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PromotionResponseDTO {
    String promotionId;
    String promotionCode;
    String name;
    String description;
    DiscountType discountType;
    Double discountValue;
    Double minimumOrderAmount;
    Double maxDiscountAmount;
    LocalDateTime startDate;
    LocalDateTime endDate;
    PromotionStatus status;
}
