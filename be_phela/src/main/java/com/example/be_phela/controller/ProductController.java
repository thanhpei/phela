package com.example.be_phela.controller;

import com.example.be_phela.dto.request.ProductCreateDTO;
import com.example.be_phela.dto.response.ProductReponseDTO;
import com.example.be_phela.mapper.ProductMapper;
import com.example.be_phela.model.Product;
import com.example.be_phela.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/product")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    ProductService productService;
    ProductMapper productMapper;

    // Thêm sản phẩm mới
    @PostMapping("/create")
    public ResponseEntity<ProductReponseDTO> createProduct(@Valid @RequestBody ProductCreateDTO productCreateDTO, @RequestParam String categoryCode) {
        Product savedProduct = productService.createProduct(productCreateDTO, categoryCode);
        return ResponseEntity.ok(productMapper.toProductResponseDTO(savedProduct));
    }

    // Cập nhật sản phẩm
    @PutMapping("/{productId}")
    public ResponseEntity<ProductReponseDTO> updateProduct(
            @PathVariable String productId,
            @Valid @RequestBody ProductCreateDTO productCreateDTO,
            @RequestParam String categoryCode) {
        Product updatedProduct = productService.updateProduct(productId, productCreateDTO, categoryCode);
        return ResponseEntity.ok(productMapper.toProductResponseDTO(updatedProduct));
    }

    // Chuyển trạng thái ẩn/hiện của sản phẩm
    @PatchMapping("/{productId}/toggle-status")
    public ResponseEntity<ProductReponseDTO> toggleProductStatus(@PathVariable String productId) {
        Product updatedProduct = productService.toggleProductStatus(productId);
        return ResponseEntity.ok(productMapper.toProductResponseDTO(updatedProduct));
    }

    // Lọc sản phẩm theo danh mục với phân trang
    @GetMapping("/category/{categoryCode}")
    public ResponseEntity<Page<ProductReponseDTO>> getProductsByCategory(
            @PathVariable String categoryCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productName") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<ProductReponseDTO> productPage = productService.getProductsByCategory(categoryCode, pageable)
                .map(productMapper::toProductResponseDTO);
        return ResponseEntity.ok(productPage);
    }
}
