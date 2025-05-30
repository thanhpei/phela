package com.example.be_phela.mapper;

import com.example.be_phela.dto.request.CartCreateDTO;
import com.example.be_phela.dto.request.CartItemDTO;
import com.example.be_phela.dto.response.CartResponseDTO;
import com.example.be_phela.model.Cart;
import com.example.be_phela.model.CartItem;
import com.example.be_phela.model.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface CartMapper {
    @Mapping(target = "cartId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", expression = "java(com.example.be_phela.model.enums.CartStatus.ACTIVE)")
    @Mapping(target = "customer", source = "customer")
    Cart toCart(CartCreateDTO dto, Customer customer);

    @Mapping(target = "customerId", expression = "java(cart.getCustomer().getCustomerId())")
    @Mapping(target = "totalAmount", expression = "java(calculateTotalAmountWithPromotion(cart))")
    CartResponseDTO toCartResponseDTO(Cart cart);

    default Double calculateTotalAmountWithPromotion(Cart cart) {
        Double baseTotal = cart.getCartItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        if (cart.getPromotionCarts() != null && !cart.getPromotionCarts().isEmpty()) {
            var promotion = cart.getPromotionCarts().get(0).getPromotion();
            if (promotion.getDiscountType() == com.example.be_phela.model.enums.DiscountType.PERCENTAGE) {
                Double discount = baseTotal * (promotion.getDiscountValue() / 100);
                if (promotion.getMaxDiscountAmount() != null) {
                    discount = Math.min(discount, promotion.getMaxDiscountAmount());
                }
                return baseTotal - discount;
            } else if (promotion.getDiscountType() == com.example.be_phela.model.enums.DiscountType.FIXED_AMOUNT) {
                return Math.max(baseTotal - promotion.getDiscountValue(), 0.0);
            }
        }
        return baseTotal;
    }

    @Mapping(target = "cartItemId", ignore = true)
    @Mapping(target = "cart", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "price", source = "price")
    @Mapping(target = "quantity", source = "quantity")
    CartItem toCartItem(CartItemDTO dto);
}