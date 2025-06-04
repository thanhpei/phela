package com.example.be_phela.repository;

import com.example.be_phela.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, String> {
}
