package com.example.be_phela.service;

import com.example.be_phela.dto.request.AuthenticationRequest;
import com.example.be_phela.dto.request.AdminCreateDTO;
import com.example.be_phela.dto.request.CustomerCreateDTO;
import com.example.be_phela.dto.response.AuthenticationResponse;
import com.example.be_phela.mapper.AdminMapperImpl;
import com.example.be_phela.model.Admin;
import com.example.be_phela.model.Customer;
import com.example.be_phela.model.PasswordResetToken;
import com.example.be_phela.model.VerificationToken;
import com.example.be_phela.model.enums.Roles;
import com.example.be_phela.repository.PasswordResetTokenRepository;
import com.example.be_phela.repository.VerificationTokenRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import jakarta.mail.MessagingException;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    final AdminService adminService;
    final CustomerService customerService;
    final AuthenticationManager authenticationManager;
    final VerificationTokenRepository verificationTokenRepository;
    final EmailService emailService;
    final PasswordResetTokenRepository passwordResetTokenRepository;
    final PasswordEncoder passwordEncoder;

    @Value("${jwt.signer-key}")
    @NonFinal
    String signerKey;

    @Value("${jwt.expiration-hours:18}")
    @NonFinal
    long jwtExpirationHours;

    // Đăng ký admin
    @Transactional(rollbackFor = Exception.class)
    public AuthenticationResponse registerAdmin(AdminCreateDTO request, String clientIp) throws MessagingException {
        // Tạo Admin
        Admin admin = adminService.buildAdmin(request, clientIp);

        // Tạo và lưu token xác thực
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .admin(admin)
                .customer(null)
                .expiryDate(LocalDateTime.now().plusHours(24)) // Hết hạn sau 24 giờ
                .build();

        // Gửi email xác nhận
        try {
            emailService.sendVerificationEmail(admin.getEmail(), token);
        } catch (MessagingException e) {
            log.error("Failed to send verification email to {}: {}", admin.getEmail(), e.getMessage());
            throw new MessagingException("Không thể gửi email xác nhận: " + e.getMessage(), e);
        }

        // Nếu gửi email thành công, lưu admin và token vào database
        adminService.saveAdmin(admin);
        verificationTokenRepository.save(verificationToken);

        return buildResponse(admin.getUsername(), admin.getRole().name());
    }

    // Đăng ký customer
    @Transactional(rollbackFor = Exception.class)
    public AuthenticationResponse registerCustomer(CustomerCreateDTO request) throws MessagingException {
        // Tạo Customer (lưu vào database)
        Customer customer = customerService.buildCustomer(request);

        // Tạo và lưu token xác thực
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .admin(null)
                .customer(customer)
                .expiryDate(LocalDateTime.now().plusHours(24)) // Hết hạn sau 24 giờ
                .build();


        // Gửi email xác nhận
        try {
            emailService.sendVerificationEmail(customer.getEmail(), token);
        } catch (MessagingException e) {
            log.error("Failed to send verification email to {}: {}", customer.getEmail(), e.getMessage());
            throw new MessagingException("Không thể gửi email xác nhận: " + e.getMessage(), e);
        }

        customerService.saveCustomer(customer);
        verificationTokenRepository.save(verificationToken);

        return buildResponse(customer.getUsername(), customer.getRole().name());
    }

    // Đăng nhập Admin
    public AuthenticationResponse loginAdmin(AuthenticationRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return createResponseFromUserDetails(userDetails);
    }

    // Đăng nhập Customer
    public AuthenticationResponse loginCustomer(AuthenticationRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return createResponseFromUserDetails(userDetails);
    }

    // Tạo response từ UserDetails (dùng cho mục đích xác thực chung)
    public AuthenticationResponse createResponseFromUserDetails(UserDetails userDetails) {
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(jwtExpirationHours);
        String jwtToken = generateToken(userDetails.getUsername(), extractRole(userDetails));
        String username = userDetails.getUsername();

        if (userDetails instanceof Customer customer) {
            return new AuthenticationResponse(jwtToken, username, "CUSTOMER", expiresAt);
        } else if (userDetails instanceof Admin admin) {
            Roles role = admin.getRole();
            return new AuthenticationResponse(jwtToken, username, role.name(), expiresAt);
        }

        throw new RuntimeException("UserDetails không hợp lệ để tạo AuthenticationResponse.");
    }

    // Hàm sinh token và build AuthenticationResponse
    private AuthenticationResponse buildResponse(String username, String role) {
        String token = generateToken(username, role);
        log.info("Đăng nhập thành công: username={}, role={}", username, role);
        return AuthenticationResponse.builder()
                .token(token)
                .username(username)
                .role(role)
                .build();
    }

    // Sinh JWT token
    private String generateToken(String username, String role) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(username)
                .issuer("/")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(18, ChronoUnit.HOURS)))
                .claim("role", role)
                .build();

        JWSObject jwsObject = new JWSObject(header, new Payload(jwtClaimsSet.toJSONObject()));

        try {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Không thể tạo token", e);
            throw new RuntimeException("Không thể tạo token", e);
        }
    }

    // Lấy role từ UserDetails (nếu cần dùng thêm)
    private String extractRole(UserDetails userDetails) {
        return userDetails.getAuthorities().stream()
                .findFirst()
                .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                .orElse("UNKNOWN");
    }

    @Transactional
    public void sendPasswordResetOtp(String email) throws MessagingException {
        // Find customer by email
        Customer customer = customerService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email: " + email));

        // Generate OTP
        String otp = generateOtp();
        log.info("Generated OTP for {}: {}", email, otp);

        // Delete any existing token for this email
        passwordResetTokenRepository.deleteByEmail(email);

        // Create and save new PasswordResetToken
        PasswordResetToken token = PasswordResetToken.builder()
                .email(email)
                .token(otp)
                .expiryDate(LocalDateTime.now().plusMinutes(10)) // OTP expires in 10 minutes
                .build();
        passwordResetTokenRepository.save(token);

        // Send OTP email
        emailService.sendOtpEmail(email, otp);
    }

    @Transactional
    public void verifyOtpAndResetPassword(String email, String otp, String newPassword) {
        PasswordResetToken token = passwordResetTokenRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Mã OTP không hợp lệ hoặc đã hết hạn."));

        if (!token.getToken().equals(otp)) {
            throw new RuntimeException("Mã OTP không đúng.");
        }
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(token); // Clean up expired token
            throw new RuntimeException("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
        }

        // Find customer by email and update password
        Customer customer = customerService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email: " + email));

        customer.setPassword(passwordEncoder.encode(newPassword));
        customerService.saveCustomer(customer); // This save will trigger the update

        // Delete the token after successful password reset
        passwordResetTokenRepository.delete(token);
    }

    // Phương thức gửi OTP cho Admin
    @Transactional
    public void sendPasswordResetOtpAdmin(String email) throws MessagingException {
        Admin admin = adminService.findByEmail(email) // Sử dụng adminService
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản quản trị viên với email: " + email));

        String otp = generateOtp();
        log.info("Generated OTP for admin {}: {}", email, otp);

        passwordResetTokenRepository.deleteByEmail(email); // Delete any existing token for this email
        PasswordResetToken token = PasswordResetToken.builder()
                .email(email)
                .token(otp)
                .expiryDate(LocalDateTime.now().plusMinutes(10)) // OTP expires in 10 minutes
                .build();
        passwordResetTokenRepository.save(token);

        emailService.sendOtpEmail(email, otp);
    }

    // Phương thức xác nhận OTP và đặt lại mật khẩu cho Admin
    @Transactional
    public void verifyOtpAndResetPasswordAdmin(String email, String otp, String newPassword) {
        PasswordResetToken token = passwordResetTokenRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Mã OTP không hợp lệ hoặc đã hết hạn."));

        if (!token.getToken().equals(otp)) {
            throw new RuntimeException("Mã OTP không đúng.");
        }
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(token);
            throw new RuntimeException("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
        }

        Admin admin = adminService.findByEmail(email) // Sử dụng adminService
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản quản trị viên với email: " + email));

        admin.setPassword(passwordEncoder.encode(newPassword));
        adminService.saveAdmin(admin); // Sử dụng saveAdmin từ adminService

        passwordResetTokenRepository.delete(token);
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // Generates a 6-digit OTP
        return String.valueOf(otp);
    }
}