package com.example.be_phela.service;

import com.example.be_phela.dto.request.CartItemRequestDTO;
import com.example.be_phela.dto.response.CartResponseDTO;
import com.example.be_phela.exception.ResourceNotFoundException;
import com.example.be_phela.interService.ICartService;
import com.example.be_phela.mapper.CartItemMapper;
import com.example.be_phela.mapper.CartMapper;
import com.example.be_phela.model.Cart;
import com.example.be_phela.model.CartItem;
import com.example.be_phela.model.Customer;
import com.example.be_phela.model.Product;
import com.example.be_phela.model.enums.CartStatus;
import com.example.be_phela.model.enums.ProductStatus;
import com.example.be_phela.model.enums.Status;
import com.example.be_phela.repository.CartItemRepository;
import com.example.be_phela.repository.CartRepository;
import com.example.be_phela.repository.CustomerRepository;
import com.example.be_phela.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartService implements ICartService {

    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    CustomerRepository customerRepository;
    ProductRepository productRepository;
    CartMapper cartMapper;
    CartItemMapper cartItemMapper;

    @Override
    @Transactional
    public CartResponseDTO addProductToCart(String customerId, String productId, CartItemRequestDTO cartItemRequestDTO) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        if (customer.getStatus() != Status.ACTIVE) {
            throw new ResourceNotFoundException("Customer is not active");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        if (product.getStatus() != ProductStatus.SHOW) {
            throw new ResourceNotFoundException("Product is not available");
        }


        Cart cart = cartRepository.findByCustomer(customer)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .customer(customer)
                            .status(CartStatus.ACTIVE)
                            .build();
                    return cartRepository.save(newCart);
                });

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseGet(() -> CartItem.builder()
                        .cart(cart)
                        .product(product)
                        .quantity(0)
                        .price(product.getOriginalPrice().doubleValue())
                        .build());

        cartItem.setQuantity(cartItem.getQuantity() + cartItemRequestDTO.getQuantity());
        if (cartItem.getQuantity() <= 0) {
            throw new ResourceNotFoundException("Quantity must be greater than 0");
        }

        cartItemRepository.save(cartItem);

        if (cart.getStatus() != CartStatus.ACTIVE) {
            cart.setStatus(CartStatus.ACTIVE);
            cartRepository.save(cart);
        }

        return cartMapper.toCartResponseDTO(cart);
    }

    @Override
    @Transactional
    public CartResponseDTO updateCartItemQuantity(String customerId, String cartItemId, Integer quantity) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        if (customer.getStatus() != Status.ACTIVE) {
            throw new ResourceNotFoundException("Customer is not active");
        }

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for customer ID: " + customerId));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        if (!cartItem.getCart().getCartId().equals(cart.getCartId())) {
            throw new ResourceNotFoundException("Cart item does not belong to the customer's cart");
        }

        if (quantity <= 0) {
            throw new ResourceNotFoundException("Quantity must be greater than 0");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        if (cart.getStatus() != CartStatus.ACTIVE) {
            cart.setStatus(CartStatus.ACTIVE);
            cartRepository.save(cart);
        }

        return cartMapper.toCartResponseDTO(cart);
    }

    @Override
    @Transactional
    public CartResponseDTO removeProductFromCart(String customerId, String cartItemId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        if (customer.getStatus() != Status.ACTIVE) {
            throw new ResourceNotFoundException("Customer is not active");
        }

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for customer ID: " + customerId));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        if (!cartItem.getCart().getCartId().equals(cart.getCartId())) {
            throw new ResourceNotFoundException("Cart item does not belong to the customer's cart");
        }

        cartItemRepository.delete(cartItem);

        if (cart.getCartItems().isEmpty()) {
            cart.setStatus(CartStatus.CHECKED_OUT);
        } else {
            cart.setStatus(CartStatus.ACTIVE);
        }
        cartRepository.save(cart);

        return cartMapper.toCartResponseDTO(cart);
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponseDTO getCart(String customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        if (customer.getStatus() != Status.ACTIVE) {
            throw new ResourceNotFoundException("Customer is not active");
        }

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseGet(() -> Cart.builder()
                        .customer(customer)
                        .status(CartStatus.CHECKED_OUT)
                        .cartItems(Collections.emptyList())
                        .build());

        return cartMapper.toCartResponseDTO(cart);
    }

    // Xoá tất cả vật phẩm trong cart
    @Override
    @Transactional
    public CartResponseDTO clearCart(String customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        if (customer.getStatus() != Status.ACTIVE) {
            throw new ResourceNotFoundException("Customer is not active");
        }

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseGet(() -> Cart.builder()
                        .customer(customer)
                        .status(CartStatus.CHECKED_OUT)
                        .build());

        cartItemRepository.deleteAll(cart.getCartItems());
        cart.setStatus(CartStatus.CHECKED_OUT);
        cartRepository.save(cart);

        return cartMapper.toCartResponseDTO(cart);
    }

    @Override
    @Transactional(readOnly = true)
    public Double getCartTotalPrice(String customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        if (customer.getStatus() != Status.ACTIVE) {
            throw new ResourceNotFoundException("Customer is not active");
        }

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseGet(() -> Cart.builder()
                        .customer(customer)
                        .status(CartStatus.CHECKED_OUT)
                        .cartItems(Collections.emptyList())
                        .build());

        return cart.getCartItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
}