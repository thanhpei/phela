package com.example.be_phela.dto.request;

import com.example.be_phela.dto.response.CartResponseDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartCreateDTO {
    String customerId;
    String addressId;
    String branchCode;
    List<CartItemDTO> cartItems;
    List<String> promotionIds;
}
