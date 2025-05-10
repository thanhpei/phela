package com.example.be_phela.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryResponseDTO {
    private String categoryCode;
    private String categoryName;

    private String description;
}
