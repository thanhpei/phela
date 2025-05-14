package com.example.be_phela.mapper;

import com.example.be_phela.dto.response.OrderResponseDTO;
import com.example.be_phela.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE, uses = {OrderItemMapper.class})
public interface OrderMapper {
    @Mapping(source = "order.customer.customerId", target = "customerId")
    @Mapping(source = "order.shippingAddress.addressId", target = "shippingAddressId")
    @Mapping(source = "order.paymentMethod", target = "paymentMethod")
    OrderResponseDTO toOrderResponseDTO(Order order);
}
