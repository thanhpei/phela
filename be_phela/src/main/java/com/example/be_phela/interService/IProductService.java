package com.example.be_phela.interService;

import com.example.be_phela.dto.request.ProductCreateDTO;
import com.example.be_phela.model.Category;
import com.example.be_phela.model.Product;
import com.example.be_phela.model.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IProductService {
    Product createProduct(ProductCreateDTO productDTO, String categoryCode, MultipartFile image) throws IOException;

    Product updateProduct(String productId, ProductCreateDTO productDTO, String categoryCode, MultipartFile image) throws IOException;

    Product toggleProductStatus(String productId);

    Page<Product> getProductsByCategory(String categoryCode, Pageable pageable);

    void deleteProduct(String productId);

    Page<Product> getAllProducts(Pageable pageable);

    Product getProductByCode(String productCode);

    Page<Product> searchProductsByPrefix(String prefix, Pageable pageable);

    Page<Product> getProductsByStatus(ProductStatus status, Pageable pageable);

    Product getProductById(String productId);
}
