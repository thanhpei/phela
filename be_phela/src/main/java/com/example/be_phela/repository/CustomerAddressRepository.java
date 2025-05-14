package com.example.be_phela.repository;

import com.example.be_phela.model.Address;
import com.example.be_phela.model.CustomerAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, String> {
    // Custom query methods can be defined here if needed
}
