package com.example.be_phela.mapper;

import com.example.be_phela.dto.request.ProductCreateDTO;
import com.example.be_phela.dto.response.ProductResponseDTO;
import com.example.be_phela.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {
    @Mapping(target = "productId", ignore = true)
    Product toProduct(ProductCreateDTO dto);

    ProductResponseDTO toProductResponseDTO(Product product);
}