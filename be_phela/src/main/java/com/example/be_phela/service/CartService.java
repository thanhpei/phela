package com.example.be_phela.service;

import com.example.be_phela.dto.request.CartCreateDTO;
import com.example.be_phela.dto.request.CartItemDTO;
import com.example.be_phela.dto.request.CartItemRequestDTO;
import com.example.be_phela.dto.response.CartResponseDTO;
import com.example.be_phela.exception.ResourceNotFoundException;
import com.example.be_phela.interService.ICartService;
import com.example.be_phela.mapper.CartItemMapper;
import com.example.be_phela.mapper.CartMapper;
import com.example.be_phela.model.*;
import com.example.be_phela.model.enums.CartStatus;
import com.example.be_phela.model.enums.ProductStatus;
import com.example.be_phela.model.enums.PromotionStatus;
import com.example.be_phela.model.enums.Status;
import com.example.be_phela.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartService implements ICartService {

    CartRepository cartRepository;
   PromotionRepository promotionRepository;
    CustomerRepository customerRepository;
    ProductRepository productRepository;
    CartMapper cartMapper;

    // Tạo giỏ hàng khi tạo khách hàng
    @Transactional
    public Cart createCartForCustomer(String customerId) {
        if (cartRepository.existsByCustomer_CustomerId(customerId)) {
            throw new RuntimeException("Cart already exists for customer: " + customerId);
        }
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));
        Cart cart = Cart.builder()
                .customer(customer)
                .status(com.example.be_phela.model.enums.CartStatus.ACTIVE)
                .build();
        return cartRepository.save(cart);
    }


    // Thêm hoặc cập nhật giỏ hàng
    @Override
    @Transactional
    public CartResponseDTO createOrUpdateCart(CartCreateDTO cartDTO) {
        Customer customer = customerRepository.findById(cartDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + cartDTO.getCustomerId()));
        Cart cart = cartRepository.findByCustomer_CustomerId(cartDTO.getCustomerId())
                .orElseGet(() -> cartMapper.toCart(cartDTO, customer));
        cart.setCustomer(customer);
        if (cartDTO.getCartItems() != null && !cartDTO.getCartItems().isEmpty()) {
            cart.getCartItems().clear();
            for (CartItemDTO itemDTO : cartDTO.getCartItems()) {
                Product product = productRepository.findById(itemDTO.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemDTO.getProductId()));
                CartItem cartItem = cartMapper.toCartItem(itemDTO);
                cartItem.setCart(cart);
                cartItem.setProduct(product);
                cartItem.setPrice(product.getOriginalPrice());
                cart.getCartItems().add(cartItem);
            }
        }
        Cart savedCart = cartRepository.save(cart);
        return cartMapper.toCartResponseDTO(savedCart);
    }


    // Lấy giỏ hàng
    @Override
    public Cart getCartByCustomerId(String customerId) {
        return cartRepository.findByCustomer_CustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Cart not found for customer: " + customerId));
    }

    // Xóa tất cả vật phẩm trong giỏ hàng
    @Override
    @Transactional
    public void clearCartItems(String cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    // Thêm hoặc cập nhật sản phẩm trong giỏ hàng
    @Override
    @Transactional
    public CartItem addOrUpdateCartItem(String cartId, CartItemDTO cartItemDTO) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        Product product = productRepository.findById(cartItemDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + cartItemDTO.getProductId()));
        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(cartItemDTO.getProductId()))
                .findFirst();
        CartItem cartItem;
        if (existingItem.isPresent()) {
            cartItem = existingItem.get();
            cartItem.setQuantity(cartItemDTO.getQuantity());
            cartItem.setPrice(product.getOriginalPrice());
        } else {
            cartItem = cartMapper.toCartItem(cartItemDTO);
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setPrice(product.getOriginalPrice());
            cart.getCartItems().add(cartItem);
        }
        cartRepository.save(cart);
        return cartItem;
    }

    // Xóa sản phẩm trong giỏ hàng
    @Override
    @Transactional
    public void removeCartItem(String cartId, String productId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        cart.getCartItems().removeIf(item -> item.getProduct().getProductId().equals(productId));
        cartRepository.save(cart);
    }

    // Tính tổng tiền giỏ hàng
    @Override
    public Double calculateCartTotal(String cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        return cart.getCartItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    // Áp dụng khuyến mãi cho giỏ hàng
    @Override
    @Transactional
    public void applyPromotionToCart(String cartId, String promotionCode) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        Promotion promotion = promotionRepository.findByPromotionCode(promotionCode)
                .orElseThrow(() -> new RuntimeException("Promotion not found with code: " + promotionCode));

        if (promotion.getStatus() != PromotionStatus.ACTIVE ||
                LocalDateTime.now().isBefore(promotion.getStartDate()) ||
                LocalDateTime.now().isAfter(promotion.getEndDate())) {
            throw new RuntimeException("Promotion is not valid or expired");
        }

        Optional<PromotionCart> existingPromotion = cart.getPromotionCarts().stream()
                .filter(pc -> pc.getPromotion().getPromotionId().equals(promotion.getPromotionId()))
                .findFirst();
        if (existingPromotion.isEmpty()) {
            PromotionCart promotionCart = PromotionCart.builder()
                    .promotion(promotion)
                    .cart(cart)
                    .build();
            cart.getPromotionCarts().add(promotionCart);
            cartRepository.save(cart);
        }
    }

    // Lấy danh sách khuyến mãi có thể áp dụng
    @Transactional(readOnly = true)
    public List<Promotion> getApplicablePromotions(String cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        Double cartTotal = calculateCartTotal(cartId);
        return promotionRepository.findByStatusAndStartDateBeforeAndEndDateAfter(
                        PromotionStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now())
                .stream()
                .filter(p -> cartTotal >= (p.getMinimumOrderAmount() != null ? p.getMinimumOrderAmount() : 0))
                .toList();
    }
}