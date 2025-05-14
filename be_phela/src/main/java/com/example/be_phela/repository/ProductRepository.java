package com.example.be_phela.repository;

import com.example.be_phela.model.Category;
import com.example.be_phela.model.Product;
import com.example.be_phela.model.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String> {
    Optional<Product> findById(String id);
    Page<Product> findByCategory(Category category, Pageable pageable);
    Page<Product> findByStatus(ProductStatus status,Pageable pageable);
    Optional<Product> findByProductCode(String productCode);
    boolean existsByProductCode(String productCode);

    Page<Product> findByProductNameStartingWithIgnoreCaseOrDescriptionStartingWithIgnoreCase(
            String productNamePrefix, String descriptionPrefix, Pageable pageable);
}
