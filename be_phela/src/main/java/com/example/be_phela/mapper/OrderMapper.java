package com.example.be_phela.mapper;

import com.example.be_phela.dto.response.OrderResponseDTO;
import com.example.be_phela.model.Order;
import com.example.be_phela.model.PromotionOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE, uses = {OrderItemMapper.class})
public interface OrderMapper {
    @Mapping(target = "customerId", source = "customer.customerId")
    @Mapping(target = "shippingAddressId", source = "shippingAddress.customerAddressId")
    @Mapping(target = "branchId", source = "branch.branchCode")
    @Mapping(target = "promotionCode", source = "promotionOrders", qualifiedByName = "mapPromotionCode")
    @Mapping(target = "shippingFee", source = "shippingFee")
    OrderResponseDTO toOrderResponseDTO(Order order);

    @Named("mapPromotionCode")
    default String mapPromotionCode(List<PromotionOrder> promotionOrders) {
        return promotionOrders != null && !promotionOrders.isEmpty() ?
                promotionOrders.get(0).getPromotion().getPromotionCode() : null;
    }
}
