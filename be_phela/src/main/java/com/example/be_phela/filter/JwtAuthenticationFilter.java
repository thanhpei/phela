package com.example.be_phela.filter;

import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.signer-key}")
    private String signerKey;

    public JwtAuthenticationFilter(String signerKey) {
        this.signerKey = signerKey;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        // Bỏ qua các endpoint không cần xác thực
        String requestURI = request.getRequestURI();

        if (requestURI.startsWith("/auth/") || requestURI.equals("/api/v1/verify")) {
            chain.doFilter(request, response);
            return;
        }

//        if (requestURI.equals("/auth/admin/register") ||
//                requestURI.equals("/auth/customer/register") ||
//                requestURI.equals("/auth/admin/login") ||
//                requestURI.equals("/auth/customer/login") || requestURI.equals("/api/v1/verify")) {
//            chain.doFilter(request, response);
//            return;
//        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(7);
            JWSObject jwsObject = JWSObject.parse(token);
            if (jwsObject.verify(new MACVerifier(signerKey.getBytes()))) {
                JWTClaimsSet claims = JWTClaimsSet.parse(jwsObject.getPayload().toJSONObject());
                String username = claims.getSubject();
                String role = claims.getStringClaim("role");

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    User userDetails = (User) User.builder()
                            .username(username)
                            .password("")
                            .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)))
                            .build();

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            logger.error("Invalid token", e);
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            return;
        }

        chain.doFilter(request, response);
    }
}