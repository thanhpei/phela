package com.example.be_phela.service;

import com.example.be_phela.dto.request.CustomerCreateDTO;
import com.example.be_phela.dto.response.AdminResponseDTO;
import com.example.be_phela.dto.response.CustomerResponseDTO;
import com.example.be_phela.exception.DuplicateResourceException;
import com.example.be_phela.exception.ResourceNotFoundException;
import com.example.be_phela.interService.ICustomerService;
import com.example.be_phela.mapper.CustomerMapper;
import com.example.be_phela.model.Customer;
import com.example.be_phela.model.enums.Roles;
import com.example.be_phela.model.enums.Status;
import com.example.be_phela.repository.CustomerRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerService implements ICustomerService {
    private final CustomerRepository customerRepository;
    CustomerMapper customerMapper;;
    BCryptPasswordEncoder passwordEncoder;

    public String generateCustomerCode() {
        long count = customerRepository.count(); // Đếm số lượng Customer hiện có
        return String.format("KH%06d", count + 1); // Ví dụ: ADM00001, ADM00002
    }

    @Override
    public Customer buildCustomer(@Valid CustomerCreateDTO customerCreateDTO) {
        if (customerRepository.existsByUsername(customerCreateDTO.getUsername())) {
            throw new DuplicateResourceException("Tên người dùng đã tồn tại");
        }
        if (customerRepository.existsByEmail(customerCreateDTO.getEmail())) {
            throw new DuplicateResourceException("Email đã tồn tại");
        }
        Customer customer = customerMapper.toCustomer(customerCreateDTO);
        customer.setCustomerCode(generateCustomerCode());
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        customer.setStatus(Status.PENDING);
        customer.setRole(Roles.CUSTOMER);

        return customer;
    }

    @Transactional
    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public Page<CustomerResponseDTO> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable)
                .map(customerMapper::toCustomerResponseDTO);
    }

    @Override
    public Customer findAdminByUsername(String username) {
        return customerRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with username: " + username));
    }

    @Override
    public CustomerResponseDTO updateCustomer(String username, CustomerCreateDTO customerCreateDTO) {
        Optional<Customer> customer = customerRepository.findByUsername(username);
        Customer customerUpdate = customer.get();
        // Kiểm tra email trùng lặp
        if (!customerUpdate.getEmail().equals(customerCreateDTO.getEmail()) && customerRepository.existsByEmail(customerCreateDTO.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        customerUpdate.setEmail(customerCreateDTO.getEmail());
        customerUpdate.setGender(customerCreateDTO.getGender());
        customerUpdate.setLatitude(customerCreateDTO.getLatitude());
        customerUpdate.setLongitude(customerCreateDTO.getLongitude());
        if (customerCreateDTO.getPassword() != null && !customerCreateDTO.getPassword().isEmpty()) {
            customerUpdate.setPassword(passwordEncoder.encode(customerCreateDTO.getPassword()));
        }
        Customer updatedCustomer = customerRepository.save(customerUpdate);
        return customerMapper.toCustomerResponseDTO(updatedCustomer);
    }
}
