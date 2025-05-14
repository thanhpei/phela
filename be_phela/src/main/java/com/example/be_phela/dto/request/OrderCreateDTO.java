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

    @NotBlank(message = "Cart items IDs are required for cart-based orders")
    private List<String> cartItemIds;
}
