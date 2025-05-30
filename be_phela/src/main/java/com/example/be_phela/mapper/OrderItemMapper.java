package com.example.be_phela.mapper;

import com.example.be_phela.dto.request.OrderItemDTO;
import com.example.be_phela.dto.response.OrderResponseDTO;
import com.example.be_phela.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface OrderItemMapper {
    @Mapping(target = "productId", source = "product.productId")
    OrderItemDTO toOrderItemDTO(OrderItem orderItem);

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "orders", ignore = true)
    OrderItem toOrderItem(OrderItemDTO orderItemDTO);
}
