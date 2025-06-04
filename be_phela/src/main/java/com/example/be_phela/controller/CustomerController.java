package com.example.be_phela.controller;

import com.example.be_phela.dto.request.CustomerPasswordUpdateDTO;
import com.example.be_phela.dto.request.CustomerUpdateDTO;
import com.example.be_phela.dto.request.CustomerLocationUpdateDTO;
import com.example.be_phela.dto.response.CustomerResponseDTO;
import com.example.be_phela.mapper.CustomerMapper;
import com.example.be_phela.service.CustomerService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<CustomerResponseDTO> getCustomerByUsername(@PathVariable String username) {
        CustomerResponseDTO responseDTO = customerService.findCustomerByUsername(username);
        return ResponseEntity.ok(responseDTO);
    }

    // Cập nhật thông tin chung (email, gender)
    @PutMapping("/updateInfo/{username}")
    public ResponseEntity<CustomerResponseDTO> updateCustomerInfo(
            @PathVariable String username,
            @Valid @RequestBody CustomerUpdateDTO customerUpdateDTO) {
        CustomerResponseDTO updatedCustomer = customerService.updateCustomerInfo(username, customerUpdateDTO);
        return ResponseEntity.ok(updatedCustomer);
    }

    // Cập nhật vị trí (latitude, longitude)
    @PatchMapping("/updateLocation/{username}")
    public ResponseEntity<CustomerResponseDTO> updateLocation(
            @PathVariable String username,
            @Valid @RequestBody CustomerLocationUpdateDTO locationUpdateDTO) {
        CustomerResponseDTO updatedCustomer = customerService.updateLocation(username, locationUpdateDTO);
        return ResponseEntity.ok(updatedCustomer);
    }

    // Cập nhật mật khẩu
    @PatchMapping("/updatePassword/{username}")
    public ResponseEntity<CustomerResponseDTO> updatePassword(
            @PathVariable String username,
            @Valid @RequestBody CustomerPasswordUpdateDTO passwordUpdateDTO) {
        CustomerResponseDTO updatedCustomer = customerService.updatePassword(username, passwordUpdateDTO);
        return ResponseEntity.ok(updatedCustomer);
    }
}