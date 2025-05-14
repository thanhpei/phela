package com.example.be_phela.service;

import com.example.be_phela.dto.request.OrderCreateDTO;
import com.example.be_phela.dto.response.OrderResponseDTO;
import com.example.be_phela.exception.ResourceNotFoundException;
import com.example.be_phela.interService.ICartService;
import com.example.be_phela.interService.IOrderService;
import com.example.be_phela.mapper.OrderMapper;
import com.example.be_phela.model.*;
import com.example.be_phela.model.enums.*;
import com.example.be_phela.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class OrderService implements IOrderService {

    OrderRepository orderRepository;
    CustomerRepository customerRepository;
    CustomerAddressRepository customerAddressRepository;
    BranchRepository branchRepository;
    ProductRepository productRepository;
    CartItemRepository cartItemRepository;
    CartRepository cartRepository;
    ICartService cartService;
    OrderMapper orderMapper;

    private String generateOrderCode() {
        long count = orderRepository.count();
        return String.format("ORD%05d", count + 1);
    }
    @Override
    @Transactional
    public OrderResponseDTO createOrderFromCart(OrderCreateDTO orderCreateDTO) {
        Customer customer = customerRepository.findById(orderCreateDTO.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (customer.getStatus() == Status.INACTIVE) {
            throw new ResourceNotFoundException("Customer is inactive");
        }

        CustomerAddress shippingAddress = customerAddressRepository.findById(orderCreateDTO.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipping address not found"));

        Branch branch = branchRepository.findById(orderCreateDTO.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        if (branch.getStatus() == ProductStatus.HIDE) {
            throw new ResourceNotFoundException("Branch is inactive");
        }

        if (orderCreateDTO.getCartItemIds() == null || orderCreateDTO.getCartItemIds().isEmpty()) {
            throw new ResourceNotFoundException("Cart items are required for cart-based orders");
        }

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for customer"));

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<String> cartItemIdsToRemove = new ArrayList<>();

        for (String cartItemId : orderCreateDTO.getCartItemIds()) {
            CartItem cartItem = cartItemRepository.findById(cartItemId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

            if (!cartItem.getCart().getCartId().equals(cart.getCartId())) {
                throw new ResourceNotFoundException("Cart item does not belong to this customer's cart: " + cartItemId);
            }

            if (cartItem.getQuantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be positive for cart item: " + cartItemId);
            }

            if (cartItem.getQuantity() > 100) {
                throw new IllegalArgumentException("Quantity exceeds maximum limit of 100 for cart item: " + cartItemId);
            }

            Product product = cartItem.getProduct();
            BigDecimal price = BigDecimal.valueOf(cartItem.getPrice());
            // Áp dụng khuyến mãi nếu có
            if (!product.getProductPromotions().isEmpty()) {
                ProductPromotion promotion = product.getProductPromotions().get(0);
                price = price.multiply(BigDecimal.valueOf(1 - promotion.getProductPromotionId() / 100.0));
            }
            BigDecimal amount = price.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(amount);

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .price(price)
                    .quantity(cartItem.getQuantity())
                    .amount(amount)
                    .build();
            orderItems.add(orderItem);
            cartItemIdsToRemove.add(cartItemId);
        }

        Order order = Order.builder()
                .orderCode(generateOrderCode())
                .totalAmount(totalAmount)
                .customer(customer)
                .shippingAddress(shippingAddress)
                .branch(branch)
                .status(OrderStatus.PROCESSING)
                .paymentMethod(orderCreateDTO.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .shippingFee(BigDecimal.ZERO)
                .orderItems(orderItems)
                .build();

        Order finalOrder = order;
        orderItems.forEach(item -> item.setOrders(finalOrder));
        order = orderRepository.save(order);

        cartItemIdsToRemove.forEach(cartItemId -> {
            CartItem cartItem = cartItemRepository.findById(cartItemId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));
            cartItemRepository.delete(cartItem);
        });

        if (cart.getCartItems().isEmpty()) {
            cart.setStatus(CartStatus.CHECKED_OUT);
            cartRepository.delete(cart);
        }

        return orderMapper.toOrderResponseDTO(order);
    }
}
