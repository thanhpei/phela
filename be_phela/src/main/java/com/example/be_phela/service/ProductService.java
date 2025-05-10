package com.example.be_phela.service;

import com.example.be_phela.dto.request.ProductCreateDTO;
import com.example.be_phela.interService.IProductService;
import com.example.be_phela.mapper.ProductMapper;
import com.example.be_phela.model.Category;
import com.example.be_phela.model.Product;
import com.example.be_phela.model.enums.ProductStatus;
import com.example.be_phela.repository.CategoryRepository;
import com.example.be_phela.repository.ProductRepository;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService implements IProductService {
    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    ProductMapper productMapper;

    // Tạo mã sản phẩm
    public String generateProductCode() {
        long count = productRepository.count();
        return String.format("SP%04d", count + 1);
    }

    // Thêm sản phẩm mới
    @Transactional
    public Product createProduct(ProductCreateDTO productDTO, String categoryCode) {
        Category category = categoryRepository.findByCategoryCode(categoryCode)
                .orElseThrow(() -> new RuntimeException("Category not found with code: " + categoryCode));

        Product product = productMapper.toProduct(productDTO);
        product.setProductCode(generateProductCode());
        product.setCategory(category);
        product.setStatus(ProductStatus.SHOW); // Mặc định trạng thái là SHOW khi tạo mới
        return productRepository.save(product);
    }

    // Cập nhật sản phẩm
    @Transactional
    public Product updateProduct(String productId, ProductCreateDTO productDTO, String categoryCode) {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        Category category = categoryRepository.findByCategoryCode(categoryCode)
                .orElseThrow(() -> new RuntimeException("Category not found with code: " + categoryCode));

        existingProduct.setProductName(productDTO.getProductName());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setOriginalPrice(productDTO.getOriginalPrice());
        existingProduct.setImageUrl(productDTO.getImageUrl());
        existingProduct.setCategory(category);

        return productRepository.save(existingProduct);
    }

    // Chuyển trạng thái ẩn/hiện
    @Transactional
    public Product toggleProductStatus(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        product.setStatus(product.getStatus() == ProductStatus.SHOW ? ProductStatus.HIDE : ProductStatus.SHOW);
        return productRepository.save(product);
    }

    // Lọc sản phẩm theo danh mục
    public Page<Product> getProductsByCategory(String categoryCode, Pageable pageable) {
        Category category = categoryRepository.findById(categoryCode)
                .orElseThrow(() -> new RuntimeException("Category not found with code: " + categoryCode));
        return productRepository.findByCategory(category, pageable);
    }
}
