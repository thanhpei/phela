package com.example.be_phela.controller;

import com.example.be_phela.dto.request.CartCreateDTO;
import com.example.be_phela.dto.request.CartItemDTO;
import com.example.be_phela.dto.request.CartItemRequestDTO;
import com.example.be_phela.dto.response.CartResponseDTO;
import com.example.be_phela.interService.ICartService;
import com.example.be_phela.mapper.CartMapper;
import com.example.be_phela.model.Cart;
import com.example.be_phela.repository.CartRepository;
import com.example.be_phela.service.CartService;
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
    CartService cartService;
    CartMapper cartMapper;
    CartRepository cartRepository;


    @PostMapping("/add")
    public ResponseEntity<CartResponseDTO> createOrUpdateCart(@Valid @RequestBody CartCreateDTO cartDTO) {
        CartResponseDTO responseDTO = cartService.createOrUpdateCart(cartDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/getCustomer/{customerId}")
    public ResponseEntity<CartResponseDTO> getCartByCustomerId(@PathVariable String customerId) {
        Cart cart = cartService.getCartByCustomerId(customerId);
        return ResponseEntity.ok(cartMapper.toCartResponseDTO(cart));
    }

    @DeleteMapping("/{cartId}/clear")
    public ResponseEntity<Void> clearCartItems(@PathVariable String cartId) {
        cartService.clearCartItems(cartId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<CartResponseDTO> addOrUpdateCartItem(
            @PathVariable String cartId,
            @RequestBody CartItemDTO cartItemDTO) {
        cartService.addOrUpdateCartItem(cartId, cartItemDTO);
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        return ResponseEntity.ok(cartMapper.toCartResponseDTO(cart));
    }

    @DeleteMapping("/{cartId}/items/{productId}")
    public ResponseEntity<Void> removeCartItem(
            @PathVariable String cartId,
            @PathVariable String productId) {
        cartService.removeCartItem(cartId, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{cartId}/total")
    public ResponseEntity<Double> calculateCartTotal(@PathVariable String cartId) {
        Double total = cartService.calculateCartTotal(cartId);
        return ResponseEntity.ok(total);
    }

    @PostMapping("/{cartId}/apply-promotion")
    public ResponseEntity<CartResponseDTO> applyPromotionToCart(
            @PathVariable String cartId,
            @RequestParam String promotionCode) {
        cartService.applyPromotionToCart(cartId, promotionCode);
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        return ResponseEntity.ok(cartMapper.toCartResponseDTO(cart));
    }
}