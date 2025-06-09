package com.example.be_phela.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // "Bưu điện" để gửi tin nhắn ra cho các client đã subscribe
        config.enableSimpleBroker("/topic", "/queue");
        // Tiền tố cho các đích đến mà server sẽ xử lý (gửi từ client lên)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint để client kết nối tới WebSocket server
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000", "http://localhost:3001")
                .setAllowedOriginPatterns("*") // Cho phép kết nối từ mọi nguồn
                .withSockJS(); // Dùng SockJS để hỗ trợ các trình duyệt cũ
    }
}
