package com.example.be_phela.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemDTO {
    String cartItemId;
    String productId;
    String productName;
    String imageUrl;
    Integer quantity;
    Double price;
    Double amount;
}
