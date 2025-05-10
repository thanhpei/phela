package com.example.be_phela.interService;

import com.example.be_phela.dto.request.ProductCreateDTO;
import com.example.be_phela.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IProductService {
    Product createProduct(ProductCreateDTO productDTO, String categoryCode);
    Product updateProduct(String productId, ProductCreateDTO productDTO, String categoryCode);
    Product toggleProductStatus(String productId);
    Page<Product> getProductsByCategory(String categoryCode, Pageable pageable);
}
