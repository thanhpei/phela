package com.example.be_phela.controller;

import com.example.be_phela.config.VNPayConfig;
import com.example.be_phela.dto.request.PaymentRequestDTO;
import com.example.be_phela.dto.response.VNPayResponse;
import com.example.be_phela.model.Order;
import com.example.be_phela.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final OrderService orderService;

    @Value("${vnpay.tmnCode}")
    private String tmnCode;

    @Value("${vnpay.hashSecret}")
    private String hashSecret;

    @Value("${vnpay.url}")
    private String vnpayUrl;

    @Value("${vnpay.returnUrl}")
    private String returnUrl;

    public PaymentController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create-payment")
    public ResponseEntity<VNPayResponse> createPayment(@RequestBody PaymentRequestDTO paymentDTO, HttpServletRequest request) throws UnsupportedEncodingException {
        // Validate input
        if (paymentDTO.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }
        if (paymentDTO.getOrderInfo() == null || paymentDTO.getOrderInfo().trim().isEmpty()) {
            throw new IllegalArgumentException("Order info is required");
        }

        long amount = paymentDTO.getAmount();
        String orderInfo = paymentDTO.getOrderInfo().trim();

        // Tạo mã giao dịch unique và an toàn
        String vnp_TxnRef = orderInfo;

        // Các tham số VNPay
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderInfo = orderInfo;
        String orderType = "other";
        String vnp_IpAddr = VNPayConfig.getIpAddress(request);
        String vnp_TmnCode = this.tmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", this.returnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // Sử dụng timezone chính xác
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));

        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Build query string với UTF-8 encoding
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()));

                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()));

                if (!fieldName.equals(fieldNames.get(fieldNames.size()-1))) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(this.hashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = this.vnpayUrl + "?" + queryUrl;

        VNPayResponse res = new VNPayResponse();
        res.setStatus("Ok");
        res.setMessage("Successfully");
        res.setUrl(paymentUrl);
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/vnpay-return")
    public RedirectView vnpayReturn(@RequestParam Map<String, String> allParams) {
        // Xử lý kết quả trả về từ VNPay
        String vnp_TxnRef = allParams.get("vnp_TxnRef");
        String vnp_ResponseCode = allParams.get("vnp_ResponseCode");

        Order order = orderService.getOrderByCode(vnp_TxnRef)
                .orElseThrow(() -> new RuntimeException("Order not found with code: " + vnp_TxnRef));

        if ("00".equals(vnp_ResponseCode)) {
            // Thanh toán thành công -> Cập nhật trạng thái đơn hàng
            orderService.confirmBankTransferPayment(order.getOrderId());
            return new RedirectView("http://localhost:3001/payment-return?status=success&orderId=" + order.getOrderId());

        } else {
            // Thanh toán thất bại -> Cập nhật hoặc không làm gì
            // Bạn có thể tạo thêm hàm để cập nhật trạng thái FAILED
            return new RedirectView("http://localhost:3001/payment-return?status=failed&orderId=" + order.getOrderId());
        }
    }
}