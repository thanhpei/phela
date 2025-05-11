package com.example.be_phela.controller;

import com.example.be_phela.dto.request.BranchCreateDTO;
import com.example.be_phela.dto.response.BranchRepositoryDTO;
import com.example.be_phela.exception.DuplicateResourceException;
import com.example.be_phela.exception.ResourceNotFoundException;
import com.example.be_phela.mapper.BranchMapper;
import com.example.be_phela.model.Branch;
import com.example.be_phela.service.BranchService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/branch")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BranchController {
    BranchService branchService;
    BranchMapper branchMapper;

    @PostMapping("/create")
    public ResponseEntity<BranchRepositoryDTO> createBranch(@RequestBody BranchCreateDTO branchDTO) {
        try {
            Branch branch = branchService.createBranch(branchDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(branchMapper.toBranchRepositoryDTO(branch));
        } catch (DuplicateResourceException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<Page<BranchRepositoryDTO>> getAllBranches(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Branch> branchPage = branchService.getAllBranches(pageable);
        Page<BranchRepositoryDTO> branchDTOs = branchPage.map(branchMapper::toBranchRepositoryDTO);
        return ResponseEntity.ok(branchDTOs);
    }

    @GetMapping("/{branchCode}")
    public ResponseEntity<BranchRepositoryDTO> getBranchById(@PathVariable String branchCode) {
        try {
            Branch branch = branchService.getBranchByCode(branchCode);
            return ResponseEntity.ok(branchMapper.toBranchRepositoryDTO(branch));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{branchCode}")
    public ResponseEntity<BranchRepositoryDTO> updateBranch(@PathVariable String branchCode, @RequestBody BranchCreateDTO branchDTO) {
        try {
            Branch updatedBranch = branchService.updateBranch(branchCode, branchDTO);
            return ResponseEntity.ok(branchMapper.toBranchRepositoryDTO(updatedBranch));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (DuplicateResourceException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @GetMapping("/by-city")
    public ResponseEntity<List<BranchRepositoryDTO>> findBranchesByCity(@RequestParam String city) {
        List<Branch> branches = branchService.findBranchesByCity(city);
        List<BranchRepositoryDTO> branchDTOs = branches.stream()
                .map(branchMapper::toBranchRepositoryDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(branchDTOs);
    }

    @PatchMapping("/{branchCode}/toggle-status")
    public ResponseEntity<BranchRepositoryDTO> toggleBranchStatus(@PathVariable String branchCode) {
        try {
            Branch updatedBranch = branchService.toggleBranchStatus(branchCode);
            return ResponseEntity.ok(branchMapper.toBranchRepositoryDTO(updatedBranch));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
