package com.example.be_phela.controller;

import com.example.be_phela.dto.request.PromotionCreateDTO;
import com.example.be_phela.dto.response.PromotionResponseDTO;
import com.example.be_phela.service.PromotionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotion")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PromotionController {

    PromotionService promotionService;

    @PostMapping
    public ResponseEntity<PromotionResponseDTO> createPromotion(@RequestBody PromotionCreateDTO createDTO) {
        PromotionResponseDTO responseDTO = promotionService.createPromotion(createDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{promotionId}")
    public ResponseEntity<PromotionResponseDTO> updatePromotion(
            @PathVariable String promotionId,
            @RequestBody PromotionCreateDTO createDTO) {
        PromotionResponseDTO responseDTO = promotionService.updatePromotion(promotionId, createDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{promotionId}")
    public ResponseEntity<Void> deletePromotion(@PathVariable String promotionId) {
        promotionService.deletePromotion(promotionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{promotionId}")
    public ResponseEntity<PromotionResponseDTO> getPromotionById(@PathVariable String promotionId) {
        PromotionResponseDTO responseDTO = promotionService.getPromotionById(promotionId);
        return ResponseEntity.ok(responseDTO);
    }

    // Lấy tất cả khuyến mãi với phân trang (cho admin)
    @GetMapping("/admin/all")
    public ResponseEntity<Page<PromotionResponseDTO>> getAllPromotions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<PromotionResponseDTO> promotions = promotionService.getAllPromotions(pageable);
        return ResponseEntity.ok(promotions);
    }

    // Lấy khuyến mãi có hạn cho khách hàng
    @GetMapping("/active")
    public ResponseEntity<List<PromotionResponseDTO>> getActivePromotions() {
        List<PromotionResponseDTO> activePromotions = promotionService.getActivePromotions();
        return ResponseEntity.ok(activePromotions);
    }
}