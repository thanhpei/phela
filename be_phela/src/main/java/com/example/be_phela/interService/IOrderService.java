package com.example.be_phela.interService;

import com.example.be_phela.dto.request.OrderCreateDTO;
import com.example.be_phela.dto.response.OrderResponseDTO;
import com.example.be_phela.model.enums.OrderStatus;

import java.util.List;

public interface IOrderService {
    OrderResponseDTO createOrderFromCart(OrderCreateDTO orderCreateDTO);
    void confirmBankTransferPayment(String orderId); // Đã có
    OrderResponseDTO getOrderById(String orderId);
    void cancelOrder(String orderId);
    void updateOrderStatus(String orderId, OrderStatus status);
    List<OrderResponseDTO> getOrdersByCustomerId(String customerId);
}