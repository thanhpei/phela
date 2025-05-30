package com.example.be_phela.controller;

import com.example.be_phela.dto.request.OrderCreateDTO;
import com.example.be_phela.dto.response.OrderResponseDTO;
import com.example.be_phela.service.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderCreateDTO orderCreateDTO) {
        OrderResponseDTO orderResponse = orderService.createOrderFromCart(orderCreateDTO);
        return ResponseEntity.ok(orderResponse);
    }

    @PostMapping("/{orderId}/confirm-payment")
    public ResponseEntity<Void> confirmBankTransferPayment(@PathVariable String orderId) {
        orderService.confirmBankTransferPayment(orderId);
        return ResponseEntity.ok().build();
    }
}
