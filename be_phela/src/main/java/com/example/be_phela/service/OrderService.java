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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class OrderService implements IOrderService {

    OrderRepository orderRepository;
    CustomerRepository customerRepository;
    CartRepository cartRepository;
    BranchRepository branchRepository;
    PromotionRepository promotionRepository;
    OrderMapper orderMapper;
    CartService cartService;

    // Hằng số phí ship
    private static final double BASE_SHIPPING_FEE = 10000.0; // Phí cơ bản
    private static final double FEE_PER_KM = 2000.0; // Phí mỗi km
    private static final double FREE_SHIPPING_THRESHOLD = 500000.0; // Ngưỡng miễn phí ship

    private String generateOrderCode() {
        long count = orderRepository.count();
        return String.format("ORD%05d", count + 1);
    }
    @Override
    @Transactional
    public OrderResponseDTO createOrderFromCart(OrderCreateDTO orderCreateDTO) {
        // Tìm giỏ hàng
        Cart cart = cartRepository.findById(orderCreateDTO.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + orderCreateDTO.getCartId()));
        if (!cart.getCustomer().getCustomerId().equals(orderCreateDTO.getCustomerId())) {
            throw new RuntimeException("Cart does not belong to customer");
        }

        // Tìm khách hàng
        Customer customer = customerRepository.findById(orderCreateDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + orderCreateDTO.getCustomerId()));

        // Tìm địa chỉ giao hàng
        CustomerAddress shippingAddress = customer.getCustomerAddresses().stream()
                .filter(ca -> ca.getCustomerAddressId().equals(orderCreateDTO.getAddressId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Shipping address not found"));

        // Tìm chi nhánh
        Branch branch = branchRepository.findById(orderCreateDTO.getBranchId())
                .orElseGet(() -> determineNearestBranch(customer.getLatitude(), customer.getLongitude()));
        if (branch == null) {
            throw new RuntimeException("No branch found");
        }

        // Tính tổng tiền giỏ hàng
        Double cartTotal = cartService.calculateCartTotal(orderCreateDTO.getCartId());
        Double finalTotal = cartTotal;
        Promotion promotion = null;
        boolean freeShipping = false;

        // Áp dụng khuyến mãi nếu có
        if (orderCreateDTO.getPromotionCode() != null) {
            promotion = promotionRepository.findByPromotionCode(orderCreateDTO.getPromotionCode())
                    .orElseThrow(() -> new RuntimeException("Promotion not found with code: " + orderCreateDTO.getPromotionCode()));
            if (promotion.getStatus() != PromotionStatus.ACTIVE ||
                    LocalDateTime.now().isBefore(promotion.getStartDate()) ||
                    LocalDateTime.now().isAfter(promotion.getEndDate())) {
                throw new RuntimeException("Promotion is not valid or expired");
            }
            finalTotal = calculateOrderTotalWithPromotion(cart, promotion);
            // Kiểm tra miễn phí ship từ khuyến mãi
            freeShipping = cartTotal >= (promotion.getMinimumOrderAmount() != null ? promotion.getMinimumOrderAmount() : FREE_SHIPPING_THRESHOLD);
        } else if (cartTotal >= FREE_SHIPPING_THRESHOLD) {
            freeShipping = true;
        }

        // Tính phí ship
        Double shippingFee = freeShipping ? 0.0 : calculateShippingFee(shippingAddress, branch);

        // Tạo đơn hàng
        Order order = Order.builder()
                .orderCode(generateOrderCode())
                .totalAmount(finalTotal)
                .customer(customer)
                .shippingAddress(shippingAddress)
                .branch(branch)
                .status(orderCreateDTO.getPaymentMethod() == PaymentMethod.CASH ? OrderStatus.CONFIRMED : OrderStatus.PROCESSING)
                .orderDate(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .shippingFee(0.0) // Có thể tính phí ship dựa trên khoảng cách
                .paymentMethod(orderCreateDTO.getPaymentMethod())
                .paymentStatus(orderCreateDTO.getPaymentMethod() == PaymentMethod.CASH ? PaymentStatus.PENDING : PaymentStatus.PENDING)
                .build();

        // Chuyển CartItem sang OrderItem
        List<OrderItem> orderItems = cart.getCartItems().stream().map(cartItem -> OrderItem.builder()
                .orders(order)
                .product(cartItem.getProduct())
                .price(new BigDecimal(cartItem.getPrice()))
                .quantity(cartItem.getQuantity())
                .amount(cartItem.getPrice() * cartItem.getQuantity())
                .build()).toList();
        order.setOrderItems(orderItems);

        // Lưu khuyến mãi nếu có
        if (promotion != null) {
            PromotionOrder promotionOrder = PromotionOrder.builder()
                    .promotion(promotion)
                    .order(order)
                    .appliedAt(LocalDateTime.now())
                    .build();
            order.setPromotionOrders(List.of(promotionOrder));
        }

        Order savedOrder = orderRepository.save(order);

        // Tích điểm nếu thanh toán bằng tiền mặt
        if (orderCreateDTO.getPaymentMethod() == PaymentMethod.CASH) {
            customer.setPointUse(customer.getPointUse() + 1);
            customerRepository.save(customer);
        }

        // Xóa giỏ hàng sau khi đặt đơn
        cartService.clearCartItems(orderCreateDTO.getCartId());

        return orderMapper.toOrderResponseDTO(savedOrder);
    }
    @Override
    @Transactional
    public void confirmBankTransferPayment(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        if (order.getPaymentMethod() != PaymentMethod.BANK_TRANSFER) {
            throw new RuntimeException("Order is not paid by bank transfer");
        }
        if (order.getPaymentStatus() == PaymentStatus.COMPLETED) {
            throw new RuntimeException("Payment already completed");
        }

        order.setPaymentStatus(PaymentStatus.COMPLETED);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        // Tích điểm khi chuyển khoản thành công
        Customer customer = order.getCustomer();
        customer.setPointUse(customer.getPointUse() + 1);
        customerRepository.save(customer);
    }

    private Double calculateOrderTotalWithPromotion(Cart cart, Promotion promotion) {
        Double baseTotal = cart.getCartItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        if (promotion.getDiscountType() == com.example.be_phela.model.enums.DiscountType.PERCENTAGE) {
            Double discount = baseTotal * (promotion.getDiscountValue() / 100);
            if (promotion.getMaxDiscountAmount() != null) {
                discount = Math.min(discount, promotion.getMaxDiscountAmount());
            }
            return baseTotal - discount;
        } else if (promotion.getDiscountType() == com.example.be_phela.model.enums.DiscountType.FIXED_AMOUNT) {
            return Math.max(baseTotal - promotion.getDiscountValue(), 0.0);
        }
        return baseTotal;
    }

    private Branch determineNearestBranch(Double latitude, Double longitude) {
        if (latitude == null || longitude == null) {
            return branchRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new RuntimeException("No branches available"));
        }
        // Logic tính khoảng cách (Haversine formula)
        return branchRepository.findAll().stream()
                .min((b1, b2) -> {
                    double dist1 = calculateDistance(latitude, longitude, b1.getLatitude(), b1.getLongitude());
                    double dist2 = calculateDistance(latitude, longitude, b2.getLatitude(), b2.getLongitude());
                    return Double.compare(dist1, dist2);
                })
                .orElseThrow(() -> new RuntimeException("No branches available"));
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Bán kính trái đất (km)
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private Double calculateShippingFee(CustomerAddress shippingAddress, Branch branch) {
        if (shippingAddress.getLatitude() == null || shippingAddress.getLongitude() == null ||
                branch.getLatitude() == null || branch.getLongitude() == null) {
            return BASE_SHIPPING_FEE; // Phí mặc định nếu thiếu tọa độ
        }

        double distance = calculateDistance(
                shippingAddress.getLatitude(), shippingAddress.getLongitude(),
                branch.getLatitude(), branch.getLongitude());
        return BASE_SHIPPING_FEE + (distance * FEE_PER_KM);
    }
}
