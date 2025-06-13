package com.example.be_phela.service;

import com.example.be_phela.dto.request.CartItemDTO;
import com.example.be_phela.dto.response.AddressDTO;
import com.example.be_phela.dto.response.BranchResponseDTO;
import com.example.be_phela.dto.response.CartResponseDTO;
import com.example.be_phela.dto.response.PromotionResponseDTO;
import com.example.be_phela.interService.ICartService;
import com.example.be_phela.model.*;
import com.example.be_phela.model.enums.DiscountType;
import com.example.be_phela.model.enums.PromotionStatus;
import com.example.be_phela.repository.*; //
import com.example.be_phela.utils.DistanceCalculator;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartService implements ICartService {

    private static final double BASE_SHIPPING_FEE = 10000.0;
    private static final double FEE_PER_KM = 2000.0;
    private static final double FREE_SHIPPING_THRESHOLD = 500000.0;

    CartRepository cartRepository;
    PromotionRepository promotionRepository;
    CustomerRepository customerRepository;
    ProductRepository productRepository;
    AddressRepository addressRepository;
    BranchRepository branchRepository;
    BranchService branchService;

    @Transactional
    public Cart createCartForCustomer(String customerId) {
        Optional<Cart> existingCart = cartRepository.findByCustomer_CustomerId(customerId);
        if (existingCart.isPresent()) {
            log.warn("Cart already exists for customer: {}. Returning existing cart.", customerId);
            return existingCart.get(); // Trả về giỏ hàng đã tồn tại
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));

        Address defaultAddress = addressRepository.findByCustomer_CustomerIdAndIsDefaultTrue(customerId)
                .orElse(null);

        Optional<Branch> nearestBranch = Optional.empty();
        if (defaultAddress != null) {
            nearestBranch = branchService.findNearestBranch(defaultAddress, branchService.getAllBranches());
        }

        Cart cart = Cart.builder()
                .customer(customer)
                .address(defaultAddress)
                .branch(nearestBranch.orElse(null))
                .totalAmount(0.0)
                .build();

        log.info("Creating cart for customer: {}", customerId);
        return cartRepository.save(cart); //
    }

    @Transactional
    public void synchronizeCartAddressAndBranch(String customerId) {
        Cart cart = cartRepository.findByCustomer_CustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Cart not found for customer: " + customerId));

        Address defaultAddress = addressRepository.findByCustomer_CustomerIdAndIsDefaultTrue(customerId)
                .orElse(null);

        if (defaultAddress != null) {
            cart.setAddress(defaultAddress);
            try {
                Optional<Branch> nearestBranch = branchService.findNearestBranch(defaultAddress, branchService.getAllBranches());
                cart.setBranch(nearestBranch.orElse(null));
            } catch (IllegalStateException e) {
                log.warn("No valid branch found for address: {}", defaultAddress.getAddressId());
                cart.setBranch(null);
            }
        } else {
            cart.setAddress(null);
            cart.setBranch(null);
        }

        log.info("Synchronizing address and branch for cart of customer: {}", customerId);
        cartRepository.save(cart); //
    }

    @Transactional
    @Override
    public CartResponseDTO getCartByCustomerId(String customerId) {
        Cart cart = cartRepository.findByCustomer_CustomerId(customerId) //
                .orElseThrow(() -> new RuntimeException("Cart not found for customer: " + customerId));

        Address defaultAddress = addressRepository.findByCustomer_CustomerIdAndIsDefaultTrue(customerId)
                .orElse(null);
        if (defaultAddress != null && (cart.getAddress() == null || !cart.getAddress().getAddressId().equals(defaultAddress.getAddressId()))) {
            cart.setAddress(defaultAddress);
            Optional<Branch> nearestBranch = branchService.findNearestBranch(defaultAddress, branchService.getAllBranches());
            if (nearestBranch.isEmpty()) {
                throw new RuntimeException("No valid branch found for the address");
            }
            cart.setBranch(nearestBranch.get());
            cartRepository.save(cart); //
        } else if (defaultAddress == null && cart.getAddress() != null) {
            cart.setAddress(null);
            cart.setBranch(null);
            cartRepository.save(cart); //
        }

        return buildCartResponseDTO(cart);
    }

    @Override
    @Transactional
    public void clearCartItems(String cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        cart.getCartItems().clear();
        cart.getPromotionCarts().clear(); // Also clear promotions when clearing items
        cart.setTotalAmount(0.0);
        log.info("Cleared items and promotions from cart: {}", cartId);
        cartRepository.save(cart); //
    }

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
            if (cartItemDTO.getQuantity() <= 0) {
                // If quantity is 0 or less, remove the item
                cart.getCartItems().remove(cartItem);
            } else {
                cartItem.setQuantity(cartItemDTO.getQuantity());
                cartItem.setAmount(product.getOriginalPrice() * cartItemDTO.getQuantity());
                cartItem.setNote(cartItemDTO.getNote());
            }
        } else {
            if (cartItemDTO.getQuantity() <= 0) {
                throw new IllegalArgumentException("Cannot add an item with quantity 0 or less.");
            }
            cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(cartItemDTO.getQuantity())
                    .amount(product.getOriginalPrice() * cartItemDTO.getQuantity())
                    .note(cartItemDTO.getNote())
                    .build();
            cart.getCartItems().add(cartItem);
        }

        cart.setTotalAmount(calculateCartTotalFromItems(cart));
        reapplyAllPromotions(cart); // Re-evaluate promotions after cart total changes
        log.info("Added/Updated item in cart: {}. Product: {}, Quantity: {}", cartId, cartItemDTO.getProductId(), cartItemDTO.getQuantity());
        cartRepository.save(cart); //
        return cartItem;
    }

    @Override
    @Transactional
    public void removeCartItem(String cartId, String productId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));

        CartItem itemToRemove = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product with id " + productId + " not found in cart"));

        cart.getCartItems().remove(itemToRemove);
        cart.setTotalAmount(calculateCartTotalFromItems(cart));
        reapplyAllPromotions(cart); // Re-evaluate promotions after cart total changes
        log.info("Removed item from cart: {}. Product: {}", cartId, productId);
        cartRepository.save(cart); //
    }

    private double calculateShippingFee(Cart cart, double distance) {
        double totalAmount = calculateCartTotalFromItems(cart);
        if (totalAmount >= FREE_SHIPPING_THRESHOLD) { //
            return 0.0;
        }

        Address address = cart.getAddress();
        Branch branch = cart.getBranch();

        if (address == null || branch == null ||
                address.getLatitude() == null || address.getLongitude() == null ||
                branch.getLatitude() == null || branch.getLongitude() == null) {
            return BASE_SHIPPING_FEE; //
        }

        return Math.floor(BASE_SHIPPING_FEE + (distance * FEE_PER_KM)); //
    }

    @Override
    @Transactional
    public void applyPromotionToCart(String cartId, String promotionCode) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        Promotion promotion = promotionRepository.findByPromotionCode(promotionCode)
                .orElseThrow(() -> new RuntimeException("Promotion not found with code: " + promotionCode));

        log.info("Applying promotion {} to cart {}", promotionCode, cartId);

        if (promotion.getStatus() != PromotionStatus.ACTIVE ||
                LocalDateTime.now().isBefore(promotion.getStartDate()) ||
                LocalDateTime.now().isAfter(promotion.getEndDate())) {
            log.warn("Promotion {} is not valid. Status: {}, Start: {}, End: {}",
                    promotionCode, promotion.getStatus(), promotion.getStartDate(), promotion.getEndDate());
            throw new RuntimeException("Promotion is not valid or expired");
        }

        if (cart.getPromotionCarts().stream()
                .anyMatch(pc -> pc.getPromotion().getPromotionId().equals(promotion.getPromotionId()))) {
            log.warn("Promotion {} already applied to cart {}", promotionCode, cartId);
            throw new RuntimeException("Promotion already applied to cart");
        }

        double cartTotal = calculateCartTotalFromItems(cart);

        if (promotion.getMinimumOrderAmount() != null && cartTotal < promotion.getMinimumOrderAmount()) {
            log.warn("Cart total {} does not meet minimum order {} for promotion {}",
                    cartTotal, promotion.getMinimumOrderAmount(), promotionCode);
            throw new RuntimeException("Cart total amount does not meet minimum order requirement");
        }

        double discount = calculateDiscountAmount(promotion, cartTotal);

        PromotionCart promotionCart = PromotionCart.builder()
                .promotion(promotion)
                .cart(cart)
                .discountAmount(discount)
                .build();
        cart.getPromotionCarts().add(promotionCart);

        cartRepository.save(cart); //
        log.info("Promotion {} applied to cart {} with discount {}", promotionCode, cartId, discount);
    }

    @Override
    @Transactional
    public void removePromotionFromCart(String cartId, String promotionId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));

        PromotionCart itemToRemove = cart.getPromotionCarts().stream()
                .filter(pc -> pc.getPromotion().getPromotionId().equals(promotionId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Promotion with id " + promotionId + " not found in cart"));

        cart.getPromotionCarts().remove(itemToRemove);
        cartRepository.save(cart); //
    }

    private double calculateDiscountAmount(Promotion promotion, double cartTotal) {
        if (promotion.getDiscountType() == DiscountType.PERCENTAGE) { //
            double discount = cartTotal * (promotion.getDiscountValue() / 100);
            if (promotion.getMaxDiscountAmount() != null) {
                return Math.min(discount, promotion.getMaxDiscountAmount());
            }
            return discount;
        }
        return promotion.getDiscountValue(); //
    }

    // Helper method to re-evaluate all applied promotions
    private void reapplyAllPromotions(Cart cart) {
        double cartTotal = calculateCartTotalFromItems(cart);
        List<PromotionCart> promotionsToRemove = new ArrayList<>();

        for (PromotionCart pc : cart.getPromotionCarts()) {
            Promotion promotion = pc.getPromotion();
            // Check if promotion is still valid
            if (promotion.getMinimumOrderAmount() != null && cartTotal < promotion.getMinimumOrderAmount()) {
                promotionsToRemove.add(pc);
            } else {
                // Recalculate discount amount
                pc.setDiscountAmount(calculateDiscountAmount(promotion, cartTotal));
            }
        }
        cart.getPromotionCarts().removeAll(promotionsToRemove);
    }

    public double calculateCartTotalFromItems(Cart cart) {
        return cart.getCartItems().stream()
                .mapToDouble(CartItem::getAmount)
                .sum();
    }

    @Transactional(readOnly = true)
    @Override
    public Integer countItemsInCart(String cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        return cart.getCartItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }

    @Override
    @Transactional
    public Double calculateShippingFee(String cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));

        double distance = 0.0;
        Address address = cart.getAddress();
        Branch branch = cart.getBranch();

        if (address != null && branch != null &&
                address.getLatitude() != null && address.getLongitude() != null &&
                branch.getLatitude() != null && branch.getLongitude() != null) {
            distance = DistanceCalculator.calculateDistance(
                    address.getLatitude(), address.getLongitude(),
                    branch.getLatitude(), branch.getLongitude()
            );
        }
        return calculateShippingFee(cart, distance);
    }

    @Transactional
    @Override
    public List<CartItemDTO> getCartItems(String cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        return cart.getCartItems().stream()
                .map(item -> CartItemDTO.builder()
                        .cartItemId(item.getCartItemId())
                        .productId(item.getProduct().getProductId())
                        .quantity(item.getQuantity())
                        .amount(item.getAmount())
                        .note(item.getNote())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateCartAddress(String cartId, String addressId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + addressId));

        if (!address.getCustomer().getCustomerId().equals(cart.getCustomer().getCustomerId())) {
            throw new RuntimeException("Address does not belong to this customer");
        }

        cart.setAddress(address);

        try {
            Optional<Branch> nearestBranch = branchService.findNearestBranch(address, branchService.getAllBranches());
            cart.setBranch(nearestBranch.orElse(null));
        } catch (IllegalStateException e) {
            throw new RuntimeException("No valid branch found for the address", e);
        }

        log.info("Updated address {} for cart {}", addressId, cartId);
        cartRepository.save(cart); //
    }

    @Override
    @Transactional
    public void updateCartBranch(String cartId, String branchCode) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        Branch branch = branchRepository.findById(branchCode)
                .orElseThrow(() -> new RuntimeException("Branch not found with code: " + branchCode));

        cart.setBranch(branch);
        log.info("Updated branch {} for cart {}", branchCode, cartId);
        cartRepository.save(cart); //
    }

    @Override
    public CartResponseDTO getCartByCartId(String cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng với ID: " + cartId));

        return buildCartResponseDTO(cart);
    }

    private CartResponseDTO buildCartResponseDTO(Cart cart) {
        double totalAmount = calculateCartTotalFromItems(cart);

        reapplyAllPromotions(cart); //
        cartRepository.save(cart); //

        double distance = 0.0;
        if (cart.getAddress() != null && cart.getBranch() != null &&
                cart.getAddress().getLatitude() != null && cart.getAddress().getLongitude() != null &&
                cart.getBranch().getLatitude() != null && cart.getBranch().getLongitude() != null) {
            distance = DistanceCalculator.calculateDistance(
                    cart.getAddress().getLatitude(), cart.getAddress().getLongitude(),
                    cart.getBranch().getLatitude(), cart.getBranch().getLongitude()
            );
        }

        double shippingFee = calculateShippingFee(cart, distance); //
        double discount = cart.getPromotionCarts().stream()
                .mapToDouble(PromotionCart::getDiscountAmount)
                .sum();
        double finalAmount = totalAmount + shippingFee - discount;

        AddressDTO addressDTO = cart.getAddress() != null ? AddressDTO.builder()
                .addressId(cart.getAddress().getAddressId())
                .city(cart.getAddress().getCity())
                .district(cart.getAddress().getDistrict())
                .ward(cart.getAddress().getWard())
                .recipientName(cart.getAddress().getRecipientName())
                .phone(cart.getAddress().getPhone())
                .detailedAddress(cart.getAddress().getDetailedAddress())
                .latitude(cart.getAddress().getLatitude())
                .longitude(cart.getAddress().getLongitude())
                .isDefault(cart.getAddress().getIsDefault())
                .build() : null;

        BranchResponseDTO branchDTO = cart.getBranch() != null ? BranchResponseDTO.builder()
                .branchCode(cart.getBranch().getBranchCode())
                .branchName(cart.getBranch().getBranchName())
                .latitude(cart.getBranch().getLatitude())
                .longitude(cart.getBranch().getLongitude())
                .city(cart.getBranch().getCity())
                .district(cart.getBranch().getDistrict())
                .address(cart.getBranch().getAddress())
                .status(cart.getBranch().getStatus())
                .build() : null;

        log.info("Fetching cart: {}. Distance: {} km. Total: {}, Shipping: {}, Discount: {}, Final: {}",
                cart.getCartId(), String.format("%.2f", distance), totalAmount, shippingFee, discount, finalAmount);

        return CartResponseDTO.builder()
                .cartId(cart.getCartId())
                .customerId(cart.getCustomer().getCustomerId())
                .addressId(cart.getAddress() != null ? cart.getAddress().getAddressId() : null)
                .address(addressDTO)
                .branchCode(cart.getBranch() != null ? cart.getBranch().getBranchCode() : null)
                .branch(branchDTO)
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .cartItems(cart.getCartItems().stream()
                        .map(item -> CartItemDTO.builder()
                                .cartItemId(item.getCartItemId())
                                .productId(item.getProduct().getProductId())
                                .quantity(item.getQuantity())
                                .amount(item.getAmount())
                                .note(item.getNote())
                                .build())
                        .collect(Collectors.toList()))
                .promotionCarts(cart.getPromotionCarts().stream()
                        .map(pc -> PromotionResponseDTO.builder()
                                .promotionId(pc.getPromotion().getPromotionId())
                                .promotionCode(pc.getPromotion().getPromotionCode())
                                .name(pc.getPromotion().getName())
                                .description(pc.getPromotion().getDescription())
                                .discountType(pc.getPromotion().getDiscountType())
                                .discountValue(pc.getPromotion().getDiscountValue())
                                .minimumOrderAmount(pc.getPromotion().getMinimumOrderAmount())
                                .maxDiscountAmount(pc.getPromotion().getMaxDiscountAmount())
                                .discountAmount(pc.getDiscountAmount())
                                .startDate(pc.getPromotion().getStartDate())
                                .endDate(pc.getPromotion().getEndDate())
                                .status(pc.getPromotion().getStatus())
                                .build())
                        .collect(Collectors.toList()))
                .distance(distance)
                .totalAmount(totalAmount)
                .shippingFee(shippingFee)
                .finalAmount(finalAmount)
                .build();
    }
}