package com.example.be_phela.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayOSPaymentResponse {
    private String code;
    private String desc;
    private PayOSData data;
    private String signature;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PayOSData {
        private String bin;
        private String accountNumber;
        private String accountName;
        private Integer amount;
        private String description;
        private Long orderCode;
        private String currency;
        private String paymentLinkId;
        private String status;
        private String checkoutUrl;
        private String qrCode;
    }
}
