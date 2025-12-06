package com.example.be_phela.service;

import com.example.be_phela.config.PayOSConfig;
import com.example.be_phela.dto.request.PayOSPaymentRequest;
import com.example.be_phela.dto.response.PayOSPaymentResponse;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayOSService {

    private final PayOSConfig payOSConfig;
        private static final Duration CONNECT_TIMEOUT = Duration.ofSeconds(30);
        private static final Duration READ_TIMEOUT = Duration.ofSeconds(60);
        private static final Duration WRITE_TIMEOUT = Duration.ofSeconds(60);
        private static final Duration CALL_TIMEOUT = Duration.ofSeconds(90);

        private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(CONNECT_TIMEOUT)
            .readTimeout(READ_TIMEOUT)
            .writeTimeout(WRITE_TIMEOUT)
            .callTimeout(CALL_TIMEOUT)
            .build();
    private final Gson gson = new Gson();

    /**
     * Tạo request thanh toán PayOS
     */
    public PayOSPaymentResponse createPaymentLink(PayOSPaymentRequest request) throws Exception {
        String url = PayOSConfig.PAYOS_BASE_URL + "/v2/payment-requests";

        request.setCancelUrl(payOSConfig.getCancelUrl());
        request.setReturnUrl(payOSConfig.getReturnUrl());

        if (request.getCancelUrl() == null || request.getCancelUrl().isBlank()) {
            throw new IllegalStateException("PayOS cancel URL is not configured");
        }
        if (request.getReturnUrl() == null || request.getReturnUrl().isBlank()) {
            throw new IllegalStateException("PayOS return URL is not configured");
        }

        // Tạo signature sau khi payload đã hoàn chỉnh
        String signature = generateSignature(request);

        request.setSignature(signature);
        String jsonBody = gson.toJson(request);
        log.info("PayOS Request Body: {}", jsonBody);

        RequestBody body = RequestBody.create(
                jsonBody,
                MediaType.parse("application/json")
        );

        Request httpRequest = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("x-client-id", payOSConfig.getClientId())
                .addHeader("x-api-key", payOSConfig.getApiKey())
            .addHeader("x-signature", signature)
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = httpClient.newCall(httpRequest).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";

            if (!response.isSuccessful()) {
                log.error("PayOS Error Response: {}", responseBody);
                throw new RuntimeException("PayOS Error: " + response.code() + " - " + responseBody);
            }

            return gson.fromJson(responseBody, PayOSPaymentResponse.class);
        }
    }

    /**
     * Lấy thông tin thanh toán
     */
    public PayOSPaymentResponse getPaymentInfo(Long orderCode) throws Exception {
        String url = PayOSConfig.PAYOS_BASE_URL + "/v2/payment-requests/" + orderCode;

        Request httpRequest = new Request.Builder()
                .url(url)
                .get()
                .addHeader("x-client-id", payOSConfig.getClientId())
                .addHeader("x-api-key", payOSConfig.getApiKey())
                .build();

        try (Response response = httpClient.newCall(httpRequest).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";

            if (!response.isSuccessful()) {
                throw new RuntimeException("PayOS Error: " + response.code() + " - " + responseBody);
            }

            return gson.fromJson(responseBody, PayOSPaymentResponse.class);
        }
    }

    /**
     * Hủy link thanh toán
     */
    public void cancelPaymentLink(Long orderCode, String reason) throws Exception {
        String url = PayOSConfig.PAYOS_BASE_URL + "/v2/payment-requests/" + orderCode + "/cancel";

        Map<String, String> cancelBody = new HashMap<>();
        cancelBody.put("cancellationReason", reason != null ? reason : "Người dùng hủy");

        RequestBody body = RequestBody.create(
                gson.toJson(cancelBody),
                MediaType.parse("application/json")
        );

        Request httpRequest = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("x-client-id", payOSConfig.getClientId())
                .addHeader("x-api-key", payOSConfig.getApiKey())
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = httpClient.newCall(httpRequest).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";

            if (!response.isSuccessful()) {
                throw new RuntimeException("PayOS Cancel Error: " + response.code() + " - " + responseBody);
            }
        }
    }

    /**
     * Lấy thông tin hóa đơn
     */
    public String getInvoiceInfo(Long orderCode) throws Exception {
        String url = PayOSConfig.PAYOS_BASE_URL + "/v2/payment-requests/" + orderCode + "/invoices";

        Request httpRequest = new Request.Builder()
                .url(url)
                .get()
                .addHeader("x-client-id", payOSConfig.getClientId())
                .addHeader("x-api-key", payOSConfig.getApiKey())
                .build();

        try (Response response = httpClient.newCall(httpRequest).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";

            if (!response.isSuccessful()) {
                throw new RuntimeException("PayOS Error: " + response.code() + " - " + responseBody);
            }

            return responseBody;
        }
    }

    /**
     * Tạo chữ ký xác thực (signature) cho PayOS request
     */
    private String generateSignature(PayOSPaymentRequest request) throws Exception {
        // Sắp xếp các trường theo thứ tự alphabet và nối chuỗi
        Map<String, String> dataMap = new HashMap<>();
        dataMap.put("amount", String.valueOf(request.getAmount()));
        dataMap.put("cancelUrl", request.getCancelUrl());
        dataMap.put("description", request.getDescription());
        dataMap.put("orderCode", String.valueOf(request.getOrderCode()));
        dataMap.put("returnUrl", request.getReturnUrl());

        String sortedData = dataMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));

        // Tạo HMAC SHA256
        Mac hmacSha256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(
                payOSConfig.getChecksumKey().getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
        );
        hmacSha256.init(secretKey);
        byte[] hash = hmacSha256.doFinal(sortedData.getBytes(StandardCharsets.UTF_8));

        // Convert to uppercase hex as PayOS expects uppercase signature
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            hexString.append(String.format("%02X", b));
        }

        return hexString.toString();
    }

    /**
     * Verify webhook signature from PayOS
     */
    public boolean verifyWebhookSignature(String signature, String data) throws Exception {
        Mac hmacSha256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(
                payOSConfig.getChecksumKey().getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
        );
        hmacSha256.init(secretKey);
        byte[] hash = hmacSha256.doFinal(data.getBytes(StandardCharsets.UTF_8));

        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }

        return hexString.toString().equals(signature);
    }
}
