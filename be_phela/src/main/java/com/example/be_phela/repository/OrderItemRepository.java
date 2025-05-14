package com.example.be_phela.repository;

import com.example.be_phela.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, String> {
    // Custom query methods can be defined here if needed
}
