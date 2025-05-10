package com.example.be_phela.repository;

import com.example.be_phela.model.Category;
import com.example.be_phela.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String> {
    Optional<Product> findById(String id);
    Page<Product> findByCategory(Category category, Pageable pageable);
}
