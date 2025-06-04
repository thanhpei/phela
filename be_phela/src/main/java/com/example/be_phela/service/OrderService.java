package com.example.be_phela.service;

import com.example.be_phela.dto.request.OrderCreateDTO;
import com.example.be_phela.dto.request.OrderItemDTO;
import com.example.be_phela.dto.response.AddressDTO;
import com.example.be_phela.dto.response.BranchResponseDTO;
import com.example.be_phela.dto.response.OrderResponseDTO;
import com.example.be_phela.dto.response.PromotionResponseDTO;
import com.example.be_phela.interService.IOrderService;
import com.example.be_phela.model.*;
import com.example.be_phela.model.enums.OrderStatus;
import com.example.be_phela.model.enums.PaymentMethod;
import com.example.be_phela.model.enums.PaymentStatus;
import com.example.be_phela.model.enums.PromotionStatus;
import com.example.be_phela.repository.*;
import com.example.be_phela.service.CartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService implements IOrderService {

    OrderRepository orderRepository;
    CustomerRepository customerRepository;
    CartRepository cartRepository;
    BranchRepository branchRepository;
    PromotionRepository promotionRepository;
    CartService cartService;
    AddressRepository addressRepository;

    private String generateOrderCode() {
        long count = orderRepository.count();
        return String.format("ORD%05d", count + 1);
    }

    @Override
    @Transactional
    public OrderResponseDTO createOrderFromCart(OrderCreateDTO orderCreateDTO) {
        // Kiểm tra giỏ hàng
        Cart cart = cartRepository.findById(orderCreateDTO.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + orderCreateDTO.getCartId()));

        // Kiểm tra địa chỉ
        Address address = addressRepository.findById(orderCreateDTO.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + orderCreateDTO.getAddressId()));
        if (!address.getCustomer().getCustomerId().equals(cart.getCustomer().getCustomerId())) {
            throw new RuntimeException("Address does not belong to this customer");
        }

        // Kiểm tra chi nhánh
        Branch branch = branchRepository.findById(orderCreateDTO.getBranchCode())
                .orElseThrow(() -> new RuntimeException("Branch not found with code: " + orderCreateDTO.getBranchCode()));

        // Lấy thông tin giỏ hàng
        double totalAmount = cartService.calculateCartTotalFromItems(cart);
        double shippingFee = cartService.calculateShippingFee(cart.getCartId());
        double discount = cart.getPromotionCarts().stream()
                .mapToDouble(PromotionCart::getDiscountAmount)
                .sum();
        double finalAmount = totalAmount + shippingFee - discount;

        // Xử lý khuyến mãi nếu có
        Promotion promotion = null;
        if (orderCreateDTO.getPromotionCode() != null) {
            promotion = promotionRepository.findByPromotionCode(orderCreateDTO.getPromotionCode())
                    .orElseThrow(() -> new RuntimeException("Promotion not found with code: " + orderCreateDTO.getPromotionCode()));
            if (promotion.getStatus() != PromotionStatus.ACTIVE ||
                    LocalDateTime.now().isBefore(promotion.getStartDate()) ||
                    LocalDateTime.now().isAfter(promotion.getEndDate())) {
                throw new RuntimeException("Promotion is not valid or expired");
            }
        }

        // Tạo đơn hàng nhưng chưa có orderItems và promotionOrders
        Order order = Order.builder()
                .orderId(UUID.randomUUID().toString())
                .orderCode(generateOrderCode())
                .totalAmount(totalAmount)
                .customer(cart.getCustomer())
                .address(address)
                .branch(branch)
                .status(OrderStatus.PENDING)
                .orderDate(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .shippingFee(shippingFee)
                .finalAmount(finalAmount)
                .paymentMethod(orderCreateDTO.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        // Lưu order trước để có ID
        Order savedOrder = orderRepository.save(order);

        // Tạo danh sách OrderItem từ CartItem
        final Order finalOrder = savedOrder; // Biến final để sử dụng trong lambda
        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(cartItem -> OrderItem.builder()
                        .orders(finalOrder)
                        .product(cartItem.getProduct())
                        .quantity(cartItem.getQuantity())
                        .amount(cartItem.getAmount())
                        .note(cartItem.getNote())
                        .build())
                .collect(Collectors.toList());

        // Gán danh sách OrderItem vào savedOrder
        savedOrder.setOrderItems(orderItems);

        // Tạo danh sách PromotionOrder nếu có khuyến mãi
        if (promotion != null) {
            PromotionOrder promotionOrder = PromotionOrder.builder()
                    .order(savedOrder)
                    .promotion(promotion)
                    .discountAmount(discount)
                    .build();
            savedOrder.setPromotionOrders(List.of(promotionOrder));
        }

        // Lưu lại sau khi cập nhật orderItems và promotionOrders
        orderRepository.save(savedOrder);

        // Xóa giỏ hàng sau khi tạo đơn hàng thành công
        cartService.clearCartItems(cart.getCartId());

        // Chuyển đổi sang DTO
        return convertToResponseDTO(savedOrder);
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

    @Override
    @Transactional
    public OrderResponseDTO getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        return convertToResponseDTO(order);
    }

    @Override
    @Transactional
    public void cancelOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order cannot be cancelled in current status");
        }
        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        // Hoàn lại điểm nếu đã tích
        if (order.getPaymentStatus() == PaymentStatus.COMPLETED) {
            Customer customer = order.getCustomer();
            customer.setPointUse(customer.getPointUse() - 1);
            customerRepository.save(customer);
        }
    }

    @Override
    @Transactional
    public void updateOrderStatus(String orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        if (status == OrderStatus.PENDING || status == order.getStatus()) {
            throw new RuntimeException("Invalid status transition");
        }
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());

        // Cập nhật thời gian giao hàng nếu đơn hàng đã giao
        if (status == OrderStatus.DELIVERED) {
            order.setDeliveryDate(LocalDateTime.now());
        }
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public List<OrderResponseDTO> getOrdersByCustomerId(String customerId) {
        List<Order> orders = orderRepository.findByCustomer_CustomerId(customerId);
        return orders.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Helper method: Chuyển đổi từ Order entity sang OrderResponseDTO
    private OrderResponseDTO convertToResponseDTO(Order order) {
        return OrderResponseDTO.builder()
                .orderId(order.getOrderId())
                .orderCode(order.getOrderCode())
                .totalAmount(order.getTotalAmount())
                .customerId(order.getCustomer().getCustomerId())
                .addressId(order.getAddress().getAddressId())
                .address(AddressDTO.builder()
                        .addressId(order.getAddress().getAddressId())
                        .city(order.getAddress().getCity())
                        .district(order.getAddress().getDistrict())
                        .ward(order.getAddress().getWard())
                        .recipientName(order.getAddress().getRecipientName())
                        .phone(order.getAddress().getPhone())
                        .detailedAddress(order.getAddress().getDetailedAddress())
                        .latitude(order.getAddress().getLatitude())
                        .longitude(order.getAddress().getLongitude())
                        .isDefault(order.getAddress().getIsDefault())
                        .build())
                .branchCode(order.getBranch().getBranchCode())
                .branch(BranchResponseDTO.builder()
                        .branchCode(order.getBranch().getBranchCode())
                        .branchName(order.getBranch().getBranchName())
                        .latitude(order.getBranch().getLatitude())
                        .longitude(order.getBranch().getLongitude())
                        .city(order.getBranch().getCity())
                        .district(order.getBranch().getDistrict())
                        .address(order.getBranch().getAddress())
                        .status(order.getBranch().getStatus())
                        .build())
                .status(order.getStatus())
                .orderDate(order.getOrderDate())
                .updatedAt(order.getUpdatedAt())
                .deliveryDate(order.getDeliveryDate())
                .shippingFee(order.getShippingFee())
                .finalAmount(order.getFinalAmount())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .orderItems(order.getOrderItems().stream()
                        .map(item -> OrderItemDTO.builder()
                                .productId(item.getProduct().getProductId())
                                .quantity(item.getQuantity())
                                .price(item.getAmount() / item.getQuantity()) // Tạm tính giá
                                .amount(item.getAmount())
                                .note(item.getNote())
                                .build())
                        .collect(Collectors.toList()))
                .promotionOrders(order.getPromotionOrders().stream()
                        .map(po -> PromotionResponseDTO.builder()
                                .promotionId(po.getPromotion().getPromotionId())
                                .promotionCode(po.getPromotion().getPromotionCode())
                                .discountAmount(po.getDiscountAmount())
                                .description(po.getPromotion().getDescription())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}