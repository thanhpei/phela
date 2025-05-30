package com.example.be_phela.dto.request;

import com.example.be_phela.model.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderCreateDTO {

    @NotBlank(message = "Customer ID is required")
    private String customerId;

    @NotBlank(message = "Address ID is required")
    private String addressId;

    @NotBlank(message = "Branch ID is required")
    private String branchId;

    @NotBlank(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private String promotionCode;

    @NotBlank(message = "Cart ID is required")
    private String cartId; // ID giỏ hàng để lấy chi tiết

//    private List<String> orderItems;
}
