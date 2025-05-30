package com.example.be_phela.dto.response;

import com.example.be_phela.dto.request.CartItemDTO;
import com.example.be_phela.model.enums.CartStatus;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class CartResponseDTO {
    private String cartId;
    private String customerId;
    private LocalDateTime createdAt;
    private CartStatus status;
    private LocalDateTime updatedAt;
    private List<CartItemDTO> cartItems;
    private Double totalAmount;
}
