package com.example.be_phela.controller;

import com.example.be_phela.dto.request.PayOSPaymentRequest;
import com.example.be_phela.dto.request.PaymentRequestDTO;
import com.example.be_phela.dto.response.PayOSPaymentResponse;
import com.example.be_phela.model.Order;
import com.example.be_phela.service.OrderService;
import com.example.be_phela.service.PayOSService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;
    private final PayOSService payOSService;

    @PostMapping("/create-payment")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequestDTO paymentDTO) {
        try {
            // Validate input
            if (paymentDTO.getAmount() <= 0) {
                throw new IllegalArgumentException("Amount must be greater than 0");
            }
            if (paymentDTO.getOrderInfo() == null || paymentDTO.getOrderInfo().trim().isEmpty()) {
                throw new IllegalArgumentException("Order info is required");
            }

            // Lấy thông tin order
            Order order = orderService.getOrderByCode(paymentDTO.getOrderInfo())
                    .orElseThrow(() -> new RuntimeException("Order not found with code: " + paymentDTO.getOrderInfo()));

            // Tạo items cho PayOS (optional nhưng recommended)
            List<PayOSPaymentRequest.PayOSItem> items = new ArrayList<>();
            items.add(PayOSPaymentRequest.PayOSItem.builder()
                    .name("Đơn hàng " + order.getOrderCode())
                    .quantity(1)
                    .price((int) paymentDTO.getAmount())
                    .build());

            // Tạo request cho PayOS
            PayOSPaymentRequest payOSRequest = PayOSPaymentRequest.builder()
                    .orderCode(Long.parseLong(order.getOrderCode().replaceAll("[^0-9]", ""))) // Chỉ lấy số
                    .amount((int) paymentDTO.getAmount())
                    .description("Thanh toán đơn hàng " + order.getOrderCode())
                    .items(items)
                    .buyerName(order.getAddress().getRecipientName())
                    .buyerPhone(order.getAddress().getPhone())
                    .buyerAddress(order.getAddress().getDetailedAddress())
                    .build();

            // Gọi PayOS API
            PayOSPaymentResponse response = payOSService.createPaymentLink(payOSRequest);

            if (response.getData() == null || response.getData().getCheckoutUrl() == null) {
                throw new RuntimeException("Failed to create payment link");
            }

            // Trả về URL thanh toán và QR code
            return ResponseEntity.ok(Map.of(
                    "status", "Ok",
                    "message", "Successfully",
                    "url", response.getData().getCheckoutUrl(),
                    "qrCode", response.getData().getQrCode(),
                    "paymentLinkId", response.getData().getPaymentLinkId()
            ));

        } catch (Exception e) {
            log.error("Error creating payment: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "Error", "message", e.getMessage()));
        }
    }

    @GetMapping("/payment-return")
    public RedirectView paymentReturn(@RequestParam Map<String, String> allParams) {
        try {
            // PayOS trả về với các params: code, id, cancel, status, orderCode
            String code = allParams.get("code");
            String orderCode = allParams.get("orderCode");
            String status = allParams.get("status");

            log.info("Payment return params: {}", allParams);

            if (orderCode == null || orderCode.isEmpty()) {
                return new RedirectView("http://localhost:3000/payment-return?status=failed&message=Invalid order code");
            }

            // Lấy thông tin order
            Order order = orderService.getOrderByCode(orderCode)
                    .orElseThrow(() -> new RuntimeException("Order not found with code: " + orderCode));

            // Kiểm tra trạng thái thanh toán
            if ("00".equals(code) && "PAID".equalsIgnoreCase(status)) {
                // Thanh toán thành công
                orderService.confirmBankTransferPayment(order.getOrderId());
                return new RedirectView("http://localhost:3000/payment-return?status=success&orderId=" + order.getOrderId());
            } else {
                // Thanh toán thất bại hoặc bị hủy
                return new RedirectView("http://localhost:3000/payment-return?status=failed&orderId=" + order.getOrderId());
            }

        } catch (Exception e) {
            log.error("Error processing payment return: ", e);
            return new RedirectView("http://localhost:3000/payment-return?status=error&message=" + e.getMessage());
        }
    }

    /**
     * Webhook từ PayOS khi có thay đổi trạng thái thanh toán
     */
    @PostMapping("/payos-webhook")
    public ResponseEntity<?> payosWebhook(
            @RequestHeader("x-signature") String signature,
            @RequestBody String payload
    ) {
        try {
            log.info("PayOS Webhook received: {}", payload);
            
            // Verify signature
            if (!payOSService.verifyWebhookSignature(signature, payload)) {
                log.error("Invalid webhook signature");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
            }

            // Process webhook data here
            // Parse payload và cập nhật trạng thái order
            
            return ResponseEntity.ok("Webhook processed");
        } catch (Exception e) {
            log.error("Error processing webhook: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing webhook");
        }
    }

    /**
     * Lấy thông tin thanh toán
     */
    @GetMapping("/payment-info/{orderCode}")
    public ResponseEntity<?> getPaymentInfo(@PathVariable String orderCode) {
        try {
            Long payOSOrderCode = Long.parseLong(orderCode.replaceAll("[^0-9]", ""));
            PayOSPaymentResponse response = payOSService.getPaymentInfo(payOSOrderCode);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting payment info: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "Error", "message", e.getMessage()));
        }
    }

    /**
     * Hủy link thanh toán
     */
    @PostMapping("/cancel-payment/{orderCode}")
    public ResponseEntity<?> cancelPayment(
            @PathVariable String orderCode,
            @RequestParam(required = false) String reason
    ) {
        try {
            Long payOSOrderCode = Long.parseLong(orderCode.replaceAll("[^0-9]", ""));
            payOSService.cancelPaymentLink(payOSOrderCode, reason);
            return ResponseEntity.ok(Map.of("status", "Ok", "message", "Payment cancelled successfully"));
        } catch (Exception e) {
            log.error("Error cancelling payment: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "Error", "message", e.getMessage()));
        }
    }

    /**
     * Lấy thông tin hóa đơn
     */
    @GetMapping("/invoice/{orderCode}")
    public ResponseEntity<?> getInvoice(@PathVariable String orderCode) {
        try {
            Long payOSOrderCode = Long.parseLong(orderCode.replaceAll("[^0-9]", ""));
            String invoice = payOSService.getInvoiceInfo(payOSOrderCode);
            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            log.error("Error getting invoice: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "Error", "message", e.getMessage()));
        }
    }
}