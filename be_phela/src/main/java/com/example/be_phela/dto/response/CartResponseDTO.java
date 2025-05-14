package com.example.be_phela.dto.response;

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
    private CartStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CartItemDTO> carstItems;
    private Double totalPrice;

    @Data
    @Builder
    public static class CartItemDTO {
        private String cartItemId;
        private String productId;
        private String productName;
        private String imageUrl;
        private Integer quantity;
        private String status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
