package com.example.be_phela.repository;

import com.example.be_phela.model.Promotion;
import com.example.be_phela.model.enums.PromotionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, String> {
    Optional<Promotion> findByPromotionCode(String promotionCode);

    //Lấy các khuyến mãi có trạng thái ACTIVE và thời gian hiện tại nằm trong khoảng startDate và endDate
    List<Promotion> findByStatusAndStartDateBeforeAndEndDateAfter(
            PromotionStatus status, LocalDateTime startDate, LocalDateTime endDate);
}
