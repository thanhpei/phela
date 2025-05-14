package com.example.be_phela.mapper;

import com.example.be_phela.dto.response.CartResponseDTO;
import com.example.be_phela.model.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface CartMapper {
    @Mapping(source = "customerId", target = "customerId")
    @Mapping(source = "cartItems", target = "cartItems")
    CartResponseDTO toCartResponseDTO(Cart cart);

    @Named("calculateTotalPrice")
    default Double calculateTotalPrice(Cart cart) {
        return cart.getCartItems().stream()
                .mapToDouble(cartItem -> {
                    java.math.BigDecimal price = cartItem.getProduct().getOriginalPrice();
                    java.math.BigDecimal quantity = java.math.BigDecimal.valueOf(cartItem.getQuantity());
                    return price.multiply(quantity).doubleValue();
                })
                .sum();
    }
}
