package com.example.be_phela.dto.response;

import com.example.be_phela.model.enums.ProductStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductReponseDTO {

    private String productName;
    private String description;
    private BigDecimal originalPrice;
    private String imageUrl;
    private ProductStatus status;
}
