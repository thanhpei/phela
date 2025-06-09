package com.example.be_phela.config;

import com.example.be_phela.filter.JwtAuthenticationFilter;
import com.example.be_phela.service.AdminUserDetailsService;
import com.example.be_phela.service.CustomerUserDetailsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SecurityConfig {
    final AdminUserDetailsService adminUserDetailsService;
    final CustomerUserDetailsService customerUserDetailsService;

    @Value("${jwt.signer-key}")
    private String signerKey;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(signerKey);
    }

    @Bean
    @Primary
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider adminProvider = new DaoAuthenticationProvider();
        adminProvider.setUserDetailsService(adminUserDetailsService);
        adminProvider.setPasswordEncoder(passwordEncoder());

        DaoAuthenticationProvider customerProvider = new DaoAuthenticationProvider();
        customerProvider.setUserDetailsService(customerUserDetailsService);
        customerProvider.setPasswordEncoder(passwordEncoder());

        return new ProviderManager(adminProvider, customerProvider);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable()) // Đảm bảo CSRF đã tắt
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationManager(authenticationManager())
                .authorizeHttpRequests(registry -> {
                    // Cho phép truy cập không cần xác thực
//                    registry.requestMatchers("/auth/admin/register", "/auth/customer/register",
//                            "/auth/admin/login", "/auth/customer/login","/verify").permitAll();
                    registry.requestMatchers("/auth/**","/api/**","/verify","/api/admin/**","/api/customer/**","/ws/**").permitAll();
//                    registry.requestMatchers("/api/admin/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_STAFF");
//                    registry.requestMatchers("/api/customer/**").hasAnyAuthority("ROLE_CUSTOMER");
                    registry.anyRequest().authenticated();
                })
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}