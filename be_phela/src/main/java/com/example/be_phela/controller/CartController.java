package com.example.be_phela.controller;

import com.example.be_phela.dto.request.CartItemRequestDTO;
import com.example.be_phela.dto.response.CartResponseDTO;
import com.example.be_phela.interService.ICartService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {
    ICartService cartService;

    @PostMapping("/add/{productId}")
    public ResponseEntity<CartResponseDTO> addProductToCart(
            @RequestParam String customerId,
            @PathVariable String productId,
            @Valid @RequestBody CartItemRequestDTO cartItemDTO) {
        if (customerId == null || customerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer ID is required");
        }
        if (productId == null || productId.trim().isEmpty()) {
            throw new IllegalArgumentException("Product ID is required");
        }
        CartResponseDTO cartResponse = cartService.addProductToCart(customerId, productId, cartItemDTO);
        return ResponseEntity.ok(cartResponse);
    }

    @PutMapping("/update-item/{cartItemId}")
    public ResponseEntity<CartResponseDTO> updateCartItemQuantity(
            @RequestParam String customerId,
            @PathVariable String cartItemId,
            @RequestParam Integer quantity) {
        if (customerId == null || customerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer ID is required");
        }
        if (cartItemId == null || cartItemId.trim().isEmpty()) {
            throw new IllegalArgumentException("Cart item ID is required");
        }
        if (quantity == null) {
            throw new IllegalArgumentException("Quantity is required");
        }
        CartResponseDTO cartResponse = cartService.updateCartItemQuantity(customerId, cartItemId, quantity);
        return ResponseEntity.ok(cartResponse);
    }

    @DeleteMapping("/delete-item/{cartItemId}")
    public ResponseEntity<CartResponseDTO> removeProductFromCart(
            @RequestParam String customerId,
            @PathVariable String cartItemId) {
        if (customerId == null || customerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer ID is required");
        }
        if (cartItemId == null || cartItemId.trim().isEmpty()) {
            throw new IllegalArgumentException("Cart item ID is required");
        }
        CartResponseDTO cartResponse = cartService.removeProductFromCart(customerId, cartItemId);
        return ResponseEntity.ok(cartResponse);
    }

    @GetMapping("/get-all/item")
    public ResponseEntity<CartResponseDTO> getCart(
            @RequestParam String customerId) {
        if (customerId == null || customerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer ID is required");
        }
        CartResponseDTO cartResponse = cartService.getCart(customerId);
        return ResponseEntity.ok(cartResponse);
    }

    @DeleteMapping("delete-all/item")
    public ResponseEntity<CartResponseDTO> clearCart(
            @RequestParam String customerId) {
        if (customerId == null || customerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer ID is required");
        }
        CartResponseDTO cartResponse = cartService.clearCart(customerId);
        return ResponseEntity.ok(cartResponse);
    }

    @GetMapping("/get-total-price")
    public ResponseEntity<Double> getCartTotal(
            @RequestParam String customerId) {
        if (customerId == null || customerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer ID is required");
        }
        Double total = cartService.getCartTotalPrice(customerId);
        return ResponseEntity.ok(total);
    }
}