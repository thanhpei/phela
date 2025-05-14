package com.example.be_phela.repository;

import com.example.be_phela.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    // Custom query methods can be defined here if needed
}
