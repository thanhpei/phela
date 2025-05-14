package com.example.be_phela.interService;

import com.example.be_phela.dto.request.OrderCreateDTO;
import com.example.be_phela.dto.response.OrderResponseDTO;

public interface IOrderService {
    OrderResponseDTO createOrderFromCart(OrderCreateDTO orderCreateDTO);

}
