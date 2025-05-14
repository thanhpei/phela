package com.example.be_phela.interService;

import com.example.be_phela.dto.request.CartItemRequestDTO;
import com.example.be_phela.dto.response.CartResponseDTO;

public interface ICartService {
    CartResponseDTO addProductToCart(String customerId, String productId, CartItemRequestDTO cartItemDTO);
    CartResponseDTO updateCartItemQuantity(String customerId, String cartItemId, Integer quantity);
    CartResponseDTO removeProductFromCart(String customerId, String cartItemId);

    CartResponseDTO getCart(String customerId);
    CartResponseDTO clearCart(String customerId);
    Double getCartTotalPrice(String customerId);
}