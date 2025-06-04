package com.example.be_phela.controller;

import com.example.be_phela.dto.request.OrderCreateDTO;
import com.example.be_phela.dto.response.OrderResponseDTO;
import com.example.be_phela.model.enums.OrderStatus;
import com.example.be_phela.service.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderCreateDTO orderCreateDTO) {
        OrderResponseDTO orderResponse = orderService.createOrderFromCart(orderCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderResponse);
    }

    @PostMapping("/{orderId}/confirm-payment")
    public ResponseEntity<Void> confirmBankTransferPayment(@PathVariable String orderId) {
        orderService.confirmBankTransferPayment(orderId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable String orderId) {
        OrderResponseDTO orderResponse = orderService.getOrderById(orderId);
        return ResponseEntity.ok(orderResponse);
    }

    @DeleteMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable String orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Void> updateOrderStatus(@PathVariable String orderId, @RequestParam OrderStatus status) {
        orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByCustomerId(@PathVariable String customerId) {
        List<OrderResponseDTO> orders = orderService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok(orders);
    }
}