package com.example.be_phela.mapper;

import com.example.be_phela.dto.response.CartResponseDTO;
import com.example.be_phela.model.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CartItemMapper {
    @Mapping(source = "product.productId", target = "productId")
    @Mapping(source = "product.productName", target = "productName")
    CartResponseDTO.CartItemDTO toCartItemDTO(CartItem cartItem);
}