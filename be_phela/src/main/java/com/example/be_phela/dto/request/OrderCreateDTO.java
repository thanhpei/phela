package com.example.be_phela.dto.request;

import com.example.be_phela.model.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderCreateDTO {

    String addressId;
    String branchCode;
    PaymentMethod paymentMethod;
    String promotionCode;
    String cartId;

}
