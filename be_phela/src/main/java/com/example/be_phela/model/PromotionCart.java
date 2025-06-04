package com.example.be_phela.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.validator.constraints.UUID;

import java.time.LocalDateTime;

@ToString(exclude = {"promotion", "cart"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "promotion_cart")
public class PromotionCart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_cart_id")
    private Long promotionCartId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id", nullable = false)
    private Promotion promotion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @Column(name = "discount_amount", nullable = false)
    private Double discountAmount;

    @CreationTimestamp
    @Column(name = "applied_at", nullable = false)
    private LocalDateTime appliedAt;

}
