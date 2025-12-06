package com.example.be_phela.dto.request;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayOSPaymentRequest {
    private Long orderCode;
    private Integer amount;
    private String description;
    private List<PayOSItem> items;
    private String cancelUrl;
    private String returnUrl;
    private String buyerName;
    private String buyerEmail;
    private String buyerPhone;
    private String buyerAddress;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PayOSItem {
        private String name;
        private Integer quantity;
        private Integer price;
    }
}
