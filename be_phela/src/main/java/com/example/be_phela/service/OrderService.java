package com.example.be_phela.service;

import com.example.be_phela.dto.request.OrderCreateDTO;
import com.example.be_phela.dto.request.OrderItemDTO;
import com.example.be_phela.dto.response.*;
import com.example.be_phela.interService.IOrderService;
import com.example.be_phela.mapper.CustomerMapper;
import com.example.be_phela.model.*;
import com.example.be_phela.model.enums.*;
import com.example.be_phela.repository.*;
import com.example.be_phela.service.CartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;
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
    CartService cartService;
    AddressRepository addressRepository;
    CustomerMapper customerMapper;
    AdminRepository adminRepository;

    private String generateOrderCode() {
        long count = orderRepository.count();
        return String.format("ORD%05d", count + 1);
    }

    @Override
    @Transactional
    public OrderResponseDTO createOrderFromCart(OrderCreateDTO orderCreateDTO) {
        Cart cart = cartRepository.findById(orderCreateDTO.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + orderCreateDTO.getCartId()));

        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cannot create order from an empty cart.");
        }

        Address address = addressRepository.findById(orderCreateDTO.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + orderCreateDTO.getAddressId()));

        Branch branch = branchRepository.findById(orderCreateDTO.getBranchCode())
                .orElseThrow(() -> new RuntimeException("Branch not found with code: " + orderCreateDTO.getBranchCode()));

        if (!address.getCustomer().getCustomerId().equals(cart.getCustomer().getCustomerId())) {
            throw new RuntimeException("This address does not belong to the customer.");
        }

        double totalAmount = cartService.calculateCartTotalFromItems(cart);
        double shippingFee = cartService.calculateShippingFee(cart.getCartId());

        double totalDiscountFromPromos = cart.getPromotionCarts().stream()
                .mapToDouble(PromotionCart::getDiscountAmount)
                .sum();

        double finalAmount = totalAmount + shippingFee - totalDiscountFromPromos;

        Order order = Order.builder()
                .orderCode(generateOrderCode())
                .totalAmount(totalAmount)
                .customer(cart.getCustomer())
                .address(address)
                .branch(branch)
                .status(OrderStatus.PENDING)
                .shippingFee(shippingFee)
                .totalDiscount(totalDiscountFromPromos)
                .finalAmount(finalAmount)
                .paymentMethod(orderCreateDTO.getPaymentMethod())
                .paymentStatus(orderCreateDTO.getPaymentMethod() == PaymentMethod.COD
                        ? PaymentStatus.PENDING
                        : PaymentStatus.AWAITING_PAYMENT)
                .build();

        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(cartItem -> OrderItem.builder()
                        .order(order)
                        .product(cartItem.getProduct())
                        .quantity(cartItem.getQuantity())
                        .amount(cartItem.getAmount())
                        .note(cartItem.getNote())
                        .build())
                .collect(Collectors.toList());
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        cartService.clearCartItems(cart.getCartId());

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

        checkAndBlockCustomer(order.getCustomer());
    }

    private void checkAndBlockCustomer(Customer customer) {
        LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);

        // Đếm số đơn hàng đã hủy trong 3 tháng qua
        long cancelledCount = orderRepository.countByCustomerAndStatusSince(
                customer.getCustomerId(),
                OrderStatus.CANCELLED,
                threeMonthsAgo
        );

        // Nếu số lần hủy vượt quá 5, khóa tài khoản
        if (cancelledCount >= 5) {
            customerRepository.updateStatus(customer.getCustomerId(), Status.BLOCKED);
        }
    }

    @Override
    @Transactional
    public void updateOrderStatus(String orderId, OrderStatus newStatus, String username) {

        Admin currentAdmin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin user '" + username + "' not found"));

        Roles currentUserRole = currentAdmin.getRole();

        boolean isAllowed = switch (currentUserRole) {
            case SUPER_ADMIN, ADMIN ->
                    List.of(OrderStatus.CONFIRMED, OrderStatus.DELIVERING, OrderStatus.DELIVERED, OrderStatus.CANCELLED).contains(newStatus);
            case STAFF ->
                    List.of(OrderStatus.CONFIRMED, OrderStatus.DELIVERING).contains(newStatus);
            case DELIVERY_STAFF ->
                    newStatus == OrderStatus.DELIVERED;
            default -> false;
        };

        if (!isAllowed) {
            throw new AccessDeniedException("User " + username + " does not have permission to change the order to status: " + newStatus);
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        if (order.getStatus() == newStatus) {
            throw new RuntimeException("Order is already in this status.");
        }
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot change status of a completed or cancelled order.");
        }

        order.setStatus(newStatus);
        if (newStatus == OrderStatus.DELIVERED) {
            order.setDeliveryDate(LocalDateTime.now());
            if (order.getPaymentMethod() == PaymentMethod.COD) {
                order.setPaymentStatus(PaymentStatus.COMPLETED);
            }
        }
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public List<OrderResponseDTO> getOrdersByCustomerId(String customerId) {
        List<Order> orders = orderRepository.findByCustomer_CustomerIdOrderByOrderDateDesc(customerId);
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
                .totalDiscount(order.getTotalDiscount())
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
                .build();
    }

    @Override
    public Optional<Order> getOrderByCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode);
    }

    // Lấy danh sách hóa đơn theo trạng thái
    @Override
    public List<OrderResponseDTO> getOrdersByStatus(OrderStatus status) {
        List<Order> orders = orderRepository.findByStatus(status);
        // Chỉ áp dụng logic sắp xếp đặc biệt cho trạng thái CONFIRMED
        if (status == OrderStatus.CONFIRMED) {
            // Sắp xếp danh sách: ưu tiên các đơn hàng chỉ có 1 sản phẩm lên đầu
            orders.sort((o1, o2) -> {
                boolean o1HasOneProduct = o1.getOrderItems().size() == 1;
                boolean o2HasOneProduct = o2.getOrderItems().size() == 1;

                if (o1HasOneProduct && !o2HasOneProduct) {
                    return -1;
                } else if (!o1HasOneProduct && o2HasOneProduct) {
                    return 1;
                } else {
                    // Nếu cả hai cùng có 1 sản phẩm hoặc cùng có nhiều sản phẩm,
                    // có thể sắp xếp phụ theo ngày đặt hàng để đảm bảo tính nhất quán.
                    // Ở đây tạm giữ nguyên thứ tự tương đối.
                    return 0;
                }
            });
        }

        return orders.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    //Lấy thông tin khách hàng từ ID đơn hàng
    @Override
    public CustomerResponseDTO getCustomerByOrderId(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        Customer customer = order.getCustomer();
        // Giả sử bạn có một hàm convertToResponseDTO trong CustomerService hoặc tự map ở đây
        return customerMapper.toCustomerResponseDTO(customer);
    }

//    @Override
//    @Transactional(readOnly = true)
//    public RevenueReportDTO getRevenueAndOrderReport(String period) {
//        LocalDateTime now = LocalDateTime.now();
//        LocalDateTime startDate = calculateStartDate(period);
//
//        List<Object[]> results = orderRepository.findRevenueAndOrderCountByDateRange(startDate, now, OrderStatus.DELIVERED);
//
//        List<RevenueReportDTO.DailyData> dailyData = results.stream()
//                .map(r -> RevenueReportDTO.DailyData.builder()
//                        .date(((Date) r[0]).toLocalDate().toString())
//                        .revenue(r[1] != null ? ((Number) r[1]).doubleValue() : 0.0)
//                        .orderCount(r[2] != null ? ((Number) r[2]).longValue() : 0L)
//                        .build())
//                .collect(Collectors.toList());
//
//        double totalRevenue = dailyData.stream().mapToDouble(RevenueReportDTO.DailyData::getRevenue).sum();
//        long totalOrders = dailyData.stream().mapToLong(RevenueReportDTO.DailyData::getOrderCount).sum();
//
//        return RevenueReportDTO.builder()
//                .totalRevenue(totalRevenue)
//                .totalOrders(totalOrders)
//                .dailyData(dailyData)
//                .build();
//    }

//    private LocalDateTime calculateStartDate(String period) {
//        LocalDateTime now = LocalDateTime.now();
//        switch (period.toLowerCase()) {
//            case "week": return now.with(DayOfWeek.MONDAY).with(LocalTime.MIN);
//            case "month": return now.with(TemporalAdjusters.firstDayOfMonth()).with(LocalTime.MIN);
//            case "quarter":
//                int firstMonthOfQuarter = ((now.getMonthValue() - 1) / 3) * 3 + 1;
//                return LocalDateTime.of(now.getYear(), firstMonthOfQuarter, 1, 0, 0);
//            case "year": return now.with(TemporalAdjusters.firstDayOfYear()).with(LocalTime.MIN);
//            default: return now.with(LocalTime.MIN);
//        }
//    }

}