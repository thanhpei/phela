package com.example.be_phela.mapper;

import com.example.be_phela.dto.response.OrderResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface OrderItemMapper {

    @Mapping(source = "orderItem.product.productId", target = "productId")
    @Mapping(source = "orderItem.product.productName", target = "productName")
    OrderResponseDTO.OrderItemDTO toOrderItemDTO(OrderResponseDTO.OrderItemDTO orderItemDTO);
}
