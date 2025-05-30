package com.example.be_phela.interService;

import com.example.be_phela.dto.request.CartCreateDTO;
import com.example.be_phela.dto.request.CartItemDTO;
import com.example.be_phela.dto.request.CartItemRequestDTO;
import com.example.be_phela.dto.response.CartResponseDTO;
import com.example.be_phela.model.Cart;
import com.example.be_phela.model.CartItem;

public interface ICartService {

    CartResponseDTO createOrUpdateCart(CartCreateDTO cartDTO);
    Cart getCartByCustomerId(String customerId);
    void clearCartItems(String cartId);
    CartItem addOrUpdateCartItem(String cartId, CartItemDTO cartItemDTO);
    void removeCartItem(String cartId, String productId);
    Double calculateCartTotal(String cartId);
    void applyPromotionToCart(String cartId, String promotionCode);
}