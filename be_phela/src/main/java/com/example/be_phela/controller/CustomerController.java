package com.example.be_phela.controller;

import com.example.be_phela.dto.request.AdminCreateDTO;
import com.example.be_phela.dto.request.CustomerCreateDTO;
import com.example.be_phela.dto.response.AdminResponseDTO;
import com.example.be_phela.dto.response.ApiResponse;
import com.example.be_phela.dto.response.CustomerResponseDTO;
import com.example.be_phela.mapper.CustomerMapper;
import com.example.be_phela.model.Admin;
import com.example.be_phela.model.Customer;
import com.example.be_phela.service.CustomerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping(value = "/api/customer")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerController {
    CustomerService customerService;
    CustomerMapper customerMapper;

    @GetMapping("/getAll")
    public ResponseEntity<Page<CustomerResponseDTO>> getAdmins(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "username") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<CustomerResponseDTO> customerResponseDTOPage = customerService.getAllCustomers(pageable);
        return ResponseEntity.ok(customerResponseDTOPage);
    }

    @GetMapping("/{username}")
    public ResponseEntity<CustomerResponseDTO> getAdminByUsername(@PathVariable String username) {
        Customer customer = customerService.findAdminByUsername(username);
        CustomerResponseDTO responseDTO = customerMapper.toCustomerResponseDTO(customer);
        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{username}")
    public ResponseEntity<CustomerResponseDTO> updateCustomer(
            @PathVariable String username,
            @RequestBody CustomerCreateDTO customerCreateDTO) {
        CustomerResponseDTO updatedCustomer = customerService.updateCustomer(username,customerCreateDTO);
        return ResponseEntity.ok(updatedCustomer);
    }
}

