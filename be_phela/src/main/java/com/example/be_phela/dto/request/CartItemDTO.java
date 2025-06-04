package com.example.be_phela.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemDTO {
    String cartItemId;
    String productId;
    Integer quantity;
    Double amount;
    String note;
}
