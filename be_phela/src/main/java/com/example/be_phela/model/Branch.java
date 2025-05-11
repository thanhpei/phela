package com.example.be_phela.model;

import com.example.be_phela.model.enums.ProductStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "branch")
public class Branch {
    @Id
    @NotNull(message = "Branch code is required")
    @Column(name = "branch_code", nullable = false)
    private String branchCode;

    @Column(name = "branch_name", nullable = false)
    private String branchName;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "district", nullable = false)
    private String district;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "status", nullable = false)
    private ProductStatus status;

    @OneToMany(mappedBy = "branch", fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    List<Admin> admins;

    @OneToMany(mappedBy = "branch", fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    List<JobPosting> jobPostings;

}
