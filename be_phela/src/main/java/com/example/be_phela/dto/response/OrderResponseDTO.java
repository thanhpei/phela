package com.example.be_phela.dto.response;

import com.example.be_phela.model.enums.OrderStatus;
import com.example.be_phela.model.enums.PaymentMethod;
import com.example.be_phela.model.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponseDTO {
    private String orderId;
    private String orderCode;
    private BigDecimal totalAmount;
    private String customerId;
    private String shippingAddressId;
    private OrderStatus status;
    private LocalDateTime orderDate;
    private LocalDateTime updatedAt;
    private LocalDateTime deliveryDate;
    private BigDecimal shippingFee;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private List<OrderItemDTO> orderItems;

    @Data
    @Builder
    public static class OrderItemDTO {
        private String orderItemId;
        private String productId;
        private String productName;
        private String productImageUrl;
        private BigDecimal price;
        private Integer quantity;
        private BigDecimal amount;
    }
}
