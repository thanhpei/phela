package com.example.be_phela.dto.response;

import com.example.be_phela.dto.request.OrderItemDTO;
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
    String orderId;
    String orderCode;
    Double totalAmount;
    String customerId;
    String shippingAddressId;
    String branchId;
    OrderStatus status;
    LocalDateTime orderDate;
    LocalDateTime updatedAt;
    LocalDateTime deliveryDate;
    Double shippingFee;
    PaymentMethod paymentMethod;
    PaymentStatus paymentStatus;
    List<OrderItemDTO> orderItems;
    String promotionCode;

}
