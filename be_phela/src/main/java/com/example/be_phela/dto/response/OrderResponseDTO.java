package com.example.be_phela.dto.response;

import com.example.be_phela.dto.request.OrderItemDTO;
import com.example.be_phela.model.enums.OrderStatus;
import com.example.be_phela.model.enums.PaymentMethod;
import com.example.be_phela.model.enums.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponseDTO {
    String orderId;
    String orderCode;
    Double totalAmount;
    String customerId;
    String addressId;
    AddressDTO address;
    String branchCode;
    BranchResponseDTO branch;
    OrderStatus status;
    LocalDateTime orderDate;
    LocalDateTime updatedAt;
    LocalDateTime deliveryDate;
    Double shippingFee;
    Double totalDiscount;
    Double finalAmount;
    PaymentMethod paymentMethod;
    PaymentStatus paymentStatus;
    List<OrderItemDTO> orderItems;
}
