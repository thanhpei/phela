package com.example.be_phela.model;

import com.example.be_phela.model.enums.Roles;
import com.example.be_phela.model.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "admin")
public class Admin implements UserDetails {
    @Id
    @UuidGenerator
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "employ_code",nullable = false,unique = true)
    private String employCode;

    @Column(name = "fullname",nullable = false,length = 100, unique = true)
    private String fullname;

    @Column(name = "username",nullable = false,length = 100, unique = true)
    private String username;

    @Column(name = "dob", nullable = true)
    private LocalDate dob;

    @Column(name = "gender",nullable = false)
    private String gender;

    @Column(name = "password",nullable = false)
    private String password;

    @Column(name = "email",nullable = false)
    private String email;

    @Column(name = "phone",nullable = false, length = 11)
    private String phone;

    @Column(name = "role",nullable = false)
    @NotNull
    @Enumerated(EnumType.STRING)
    private Roles role;

    @Column(name = "last_login_ip",nullable = true,length = 45)
    private String lastLoginIp;

    @CreationTimestamp
    @Column(name = "created_at",nullable = false,updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false, updatable = true)
    private LocalDateTime updatedAt;

    @Column(name = "status",nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    // Hạn chế số lần đăng nhập sai để tránh tấn công brute force
    @Builder.Default
    @Column(name = "failed_login_attempts", nullable = false)
    private int failedLoginAttempts = 0;

    @ManyToOne
    @JoinColumn(name = "branch_code", referencedColumnName = "branch_code")
    Branch branch;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.status != Status.BLOCKED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.status == Status.ACTIVE;
    }

}