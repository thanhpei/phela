package com.example.be_phela.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerLocationUpdateDTO {
//    @DecimalMin(value = "-90.0", message = "Latitude phải >= -90")
//    @DecimalMax(value = "90.0", message = "Latitude phải <= 90")
    private Double latitude;

//    @DecimalMin(value = "-180.0", message = "Longitude phải >= -180")
//    @DecimalMax(value = "180.0", message = "Longitude phải <= 180")
    private Double longitude;
}