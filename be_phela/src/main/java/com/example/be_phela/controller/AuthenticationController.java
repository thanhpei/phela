package com.example.be_phela.controller;

import com.example.be_phela.dto.response.ApiResponse;
import com.example.be_phela.dto.request.AuthenticationRequest;
import com.example.be_phela.dto.request.CustomerCreateDTO;
import com.example.be_phela.dto.request.AdminCreateDTO;
import com.example.be_phela.dto.response.AuthenticationResponse;
import com.example.be_phela.service.AuthenticationService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.function.Supplier;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    final AuthenticationService authenticationService;

    @PostMapping("/customer/register")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> registerCustomer(
            @Valid @RequestBody CustomerCreateDTO request) {
        Supplier<AuthenticationResponse> registerSupplier = () -> {
            try {
                return authenticationService.registerCustomer(request);
            } catch (MessagingException e) {

                log.error("MessagingException during customer registration in lambda: {}", e.getMessage());
                // Quan trọng: Ném RuntimeException để báo hiệu lỗi cho handleRegistration
                throw new RuntimeException("Registration failed due to email sending issue: " + e.getMessage(), e);
            }
        };

        return handleRegistration(registerSupplier,
                "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.");
    }

    @PostMapping("/admin/register")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> registerAdmin(
            @Valid @RequestBody AdminCreateDTO request,
            HttpServletRequest httpRequest) {
//        return handleRegistration(() -> authenticationService.registerAdmin(request, getClientIp(httpRequest)),
//                "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.");
        Supplier<AuthenticationResponse> registerSupplier = () -> {
            try {
                String clientIp = getClientIp(httpRequest);
                return authenticationService.registerAdmin(request, clientIp);
            } catch (MessagingException e) {
                log.error("MessagingException during admin registration in lambda: {}", e.getMessage());
                // Ném RuntimeException để báo hiệu lỗi cho handleRegistration
                throw new RuntimeException("Registration failed due to email sending issue: " + e.getMessage(), e);
            }
        };
        return handleRegistration(registerSupplier, // Truyền Supplier đã xử lý exception
                "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.");
    }

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> loginAdmin(
            @Valid @RequestBody AuthenticationRequest request) {
        try {
            log.info("Admin login attempt for username: {}", request.getUsername());
            AuthenticationResponse response = authenticationService.loginAdmin(request);
            return buildResponse(HttpStatus.OK, "success", "Admin logged in successfully", response);
        } catch (UsernameNotFoundException e) {
            log.error("Admin login failed: {}", e.getMessage());
            return buildResponse(HttpStatus.NOT_FOUND, "error", "Tài khoản không tồn tại", null);
        } catch (BadCredentialsException e) {
            log.error("Admin login failed: {}", e.getMessage());
            return buildResponse(HttpStatus.UNAUTHORIZED, "error", "Sai mật khẩu", null);
        } catch (IllegalStateException e) {
            log.error("Admin login failed: {}", e.getMessage());
            return buildResponse(HttpStatus.FORBIDDEN, "error", e.getMessage(), null);
        } catch (Exception e) {
            log.error("Admin login failed for username: {}", request.getUsername(), e);
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "error", "Lỗi hệ thống", null);
        }
    }

    @PostMapping("/customer/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> loginCustomer(
            @Valid @RequestBody AuthenticationRequest request) {
        try {
            log.info("Customer login attempt for username: {}", request.getUsername());
            AuthenticationResponse response = authenticationService.loginCustomer(request);
            return buildResponse(HttpStatus.OK, "success", "Customer logged in successfully", response);
        } catch (UsernameNotFoundException e) {
            log.error("Customer login failed: {}", e.getMessage());
            return buildResponse(HttpStatus.NOT_FOUND, "error", "Tài khoản không tồn tại", null);
        } catch (BadCredentialsException e) {
            log.error("Customer login failed: {}", e.getMessage());
            return buildResponse(HttpStatus.UNAUTHORIZED, "error", "Sai mật khẩu", null);
        } catch (IllegalStateException e) {
            log.error("Customer login failed: {}", e.getMessage());
            return buildResponse(HttpStatus.FORBIDDEN, "error", e.getMessage(), null);
        } catch (Exception e) {
            log.error("Customer login failed for username: {}", request.getUsername(), e);
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "error", "Lỗi hệ thống", null);
        }
    }

    // ==== PRIVATE HELPER METHODS ====

    private ResponseEntity<ApiResponse<AuthenticationResponse>> handleRegistration(
            Supplier<AuthenticationResponse> registerFunction, String successMessage) {
        try {
            AuthenticationResponse response = registerFunction.get();
            return buildResponse(HttpStatus.CREATED, "success", successMessage, response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("Registration failed: {}", e.getMessage());
            return buildResponse(HttpStatus.BAD_REQUEST, "error", e.getMessage(), null);
        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage(), e);
            String errorMessage = e.getMessage().contains("Không thể gửi email xác nhận")
                    ? e.getMessage()
                    : "Registration failed: " + e.getMessage();
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "error", errorMessage, null);
        }
    }

    private ResponseEntity<ApiResponse<AuthenticationResponse>> buildResponse(
            HttpStatus status, String statusText, String message, AuthenticationResponse data) {
        ApiResponse<AuthenticationResponse> apiResponse = ApiResponse.<AuthenticationResponse>builder()
                .status(statusText)
                .message(message)
                .data(data)
                .build();
        return new ResponseEntity<>(apiResponse, status);
    }

    private String getClientIp(HttpServletRequest request) {
        String[] headers = {
                "X-Forwarded-For",
                "Proxy-Client-IP",
                "WL-Proxy-Client-IP"
        };
        for (String header : headers) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                return ip.split(",")[0].trim();
            }
        }
        return request.getRemoteAddr();
    }
}