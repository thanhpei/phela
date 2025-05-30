package com.example.be_phela.dto.request;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemDTO {
    String productId;
    Integer quantity;
    Double price;
    Double amount;
}
