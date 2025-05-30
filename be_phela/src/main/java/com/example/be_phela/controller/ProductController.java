package com.example.be_phela.controller;

import com.example.be_phela.dto.request.ProductCreateDTO;
import com.example.be_phela.dto.response.ProductResponseDTO;
import com.example.be_phela.mapper.ProductMapper;
import com.example.be_phela.model.Product;
import com.example.be_phela.model.enums.ProductStatus;
import com.example.be_phela.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    ProductService productService;
    ProductMapper productMapper;

    // Thêm sản phẩm mới
    @PostMapping(value = "/api/admin/product/create", consumes = {"multipart/form-data"})
    public ResponseEntity<ProductResponseDTO> createProduct(
            @Valid @RequestPart("product") ProductCreateDTO productCreateDTO,
            @RequestPart(value = "categoryCode") String categoryCode,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Product savedProduct = productService.createProduct(productCreateDTO, categoryCode, image);
            return ResponseEntity.ok(productMapper.toProductResponseDTO(savedProduct));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ProductResponseDTO("Error uploading image: " + e.getMessage(),null, null, null, null, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ProductResponseDTO(e.getMessage(),null, null, null, null, null));
        }
    }

    // Cập nhật sản phẩm
    @PutMapping(value = "/api/admin/product/{productId}", consumes = {"multipart/form-data"})
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable String productId,
            @Valid @RequestPart("product") ProductCreateDTO productCreateDTO,
            @RequestPart(value = "categoryCode") String categoryCode,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            if (image != null && !image.isEmpty()) {
                productCreateDTO.setImageUrl(null); // Reset imageUrl to force update with new image
            }
            Product updatedProduct = productService.updateProduct(productId, productCreateDTO, categoryCode, image);
            return ResponseEntity.ok(productMapper.toProductResponseDTO(updatedProduct));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ProductResponseDTO("Error uploading image: " + e.getMessage(),null, null, null, null, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ProductResponseDTO(e.getMessage(),null, null, null, null, null));
        }
    }

    // Chuyển trạng thái ẩn/hiện của sản phẩm
    @PatchMapping("/api/admin/product/{productId}/toggle-status")
    public ResponseEntity<ProductResponseDTO> toggleProductStatus(@PathVariable String productId) {
        Product updatedProduct = productService.toggleProductStatus(productId);
        return ResponseEntity.ok(productMapper.toProductResponseDTO(updatedProduct));
    }

    //Xoá sản phẩm
    @DeleteMapping("/api/admin/product/delete/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String productId) throws IllegalAccessException {
        if (productId == null || productId.trim().isEmpty()) {
            throw new IllegalAccessException("Product ID cannot be null or empty");
        }
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    // Lấy tất c sản phẩm
    @GetMapping("/api/product/all")
    public ResponseEntity<Page<ProductResponseDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productName") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<ProductResponseDTO> productPage = productService.getAllProducts(pageable)
                .map(productMapper::toProductResponseDTO);
        return ResponseEntity.ok(productPage);
    }

    // Lấy sản phẩm theo id
    @GetMapping("/api/product/get/{productId}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable String productId) throws IllegalAccessException {
        if (productId == null || productId.trim().isEmpty()) {
            throw new IllegalAccessException("Product ID cannot be null or empty");
        }
        Product product = productService.getProductById(productId);
        return ResponseEntity.ok(productMapper.toProductResponseDTO(product));
    }

    // Lấy sản phẩm theo mã sản phẩm
    @GetMapping("/api/product/code/{productCode}")
    public ResponseEntity<ProductResponseDTO> getProductByCode(@PathVariable String productCode) {
        Product product = productService.getProductByCode(productCode);
        return ResponseEntity.ok(productMapper.toProductResponseDTO(product));
    }

    // Tìm kiếm sản phẩm
    @GetMapping("/api/admin/product/search")
    public ResponseEntity<Page<ProductResponseDTO>> searchProducts(
            @RequestParam String prefix,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productName") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<ProductResponseDTO> productPage = productService.searchProductsByPrefix(prefix, pageable)
                .map(productMapper::toProductResponseDTO);
        return ResponseEntity.ok(productPage);
    }

    // Lấy sản phẩm theo trạng thái
    @GetMapping("/api/admin/product/status/{status}")
    public ResponseEntity<Page<ProductResponseDTO>> getProductsByStatus(
            @PathVariable ProductStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productName") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<ProductResponseDTO> productPage = productService.getProductsByStatus(status, pageable)
                .map(productMapper::toProductResponseDTO);
        return ResponseEntity.ok(productPage);
    }

    // Lọc sản phẩm theo danh mục với phân trang
    @GetMapping("/api/product/category/{categoryCode}")
    public ResponseEntity<Page<ProductResponseDTO>> getProductsByCategory(
            @PathVariable String categoryCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productName") String sortBy) {
        if (categoryCode == null || categoryCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Category code is required");
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<ProductResponseDTO> productPage = productService.getProductsByCategory(categoryCode, pageable)
                .map(productMapper::toProductResponseDTO);
        return ResponseEntity.ok(productPage);
    }
}
