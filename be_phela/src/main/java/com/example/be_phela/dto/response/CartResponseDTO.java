package com.example.be_phela.dto.response;

import com.example.be_phela.dto.request.CartItemDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartResponseDTO {
    String cartId;
    String customerId;
    String addressId;
    AddressDTO address;
    String branchCode;
    BranchResponseDTO branch;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    List<CartItemDTO> cartItems;
    List<PromotionResponseDTO> promotionCarts;
    Double distance;
    Double totalAmount;
    Double shippingFee;
    Double finalAmount;
}
