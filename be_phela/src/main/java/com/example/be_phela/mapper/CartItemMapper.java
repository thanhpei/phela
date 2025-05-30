package com.example.be_phela.mapper;

import com.example.be_phela.dto.request.CartItemDTO;
import com.example.be_phela.dto.response.CartResponseDTO;
import com.example.be_phela.model.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CartItemMapper {
    @Mapping(target = "cartItemId", source = "cartItemId")
    @Mapping(target = "productId", source = "product.productId")
    @Mapping(target = "productName", source = "product.productName")
    @Mapping(target = "imageUrl", source = "product.imageUrl")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "amount", expression = "java(cartItem.getPrice() * cartItem.getQuantity())")
    CartItemDTO toCartItemDTO(CartItem cartItem);

    @Mapping(target = "cart", ignore = true)
    @Mapping(target = "product", ignore = true)
    CartItem toCartItem(CartItemDTO cartItemDTO);
}