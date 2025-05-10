package com.example.be_phela.service;

import com.example.be_phela.dto.request.BranchCreateDTO;
import com.example.be_phela.exception.DuplicateResourceException;
import com.example.be_phela.exception.ResourceNotFoundException;
import com.example.be_phela.interService.IBranchService;
import com.example.be_phela.mapper.BranchMapper;
import com.example.be_phela.model.Branch;
import com.example.be_phela.model.enums.ProductStatus;
import com.example.be_phela.repository.BranchRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.DuplicateFormatFlagsException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BranchService implements IBranchService {

    BranchRepository branchRepository;
    BranchMapper branchMapper;

    @Override
    public String generateBranchCode() {
        long count = branchRepository.count(); // Đếm số lượng danh mục hiện có
        return String.format("CH%04d", count + 1);
    }

    @Override
    @Transactional
    public Branch createBranch(BranchCreateDTO branchDTO) {
        log.info("Creating new branch with name: {}", branchDTO.getBranchName());

        // Kiểm tra xem tên chi nhánh đã tồn tại chưa
        if (branchRepository.findByBranchName(branchDTO.getBranchName()).isPresent()) {
            throw new DuplicateResourceException("Chi nhánh với tên " + branchDTO.getBranchName() + " đã tồn tại");
        }

        Branch branch = branchMapper.toBranch(branchDTO);
        branch.setBranchCode(generateBranchCode());
        if (branch.getStatus() == null) {
            branch.setStatus(ProductStatus.SHOW);
        }
        Branch savedBranch = branchRepository.save(branch);
        log.info("Branch created successfully with code: {}", savedBranch.getBranchCode());
        return savedBranch;

    }

    @Override
    public Branch getBranchByCode(String branchCode) {
        Optional<Branch> branchOpt = branchRepository.findById(branchCode);
        return branchOpt.orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chi nhánh với mã: " + branchCode));
    }

    @Override
    @Transactional
    public Branch updateBranch(String branchCode, BranchCreateDTO updatedBranchDTO) {
        Branch existingBranch = getBranchByCode(branchCode);

        // Kiểm tra trùng tên chi nhánh
        Optional<Branch> branchWithSameName = branchRepository.findByBranchName(updatedBranchDTO.getBranchName());
        if (branchWithSameName.isPresent() && !branchWithSameName.get().getBranchCode().equals(branchCode)) {
            throw new DuplicateResourceException("Chi nhánh với tên " + updatedBranchDTO.getBranchName() + " đã tồn tại");
        }

        existingBranch.setBranchName(updatedBranchDTO.getBranchName());
        existingBranch.setLatitude(updatedBranchDTO.getLatitude());
        existingBranch.setLongitude(updatedBranchDTO.getLongitude());
        existingBranch.setCity(updatedBranchDTO.getCity());
        existingBranch.setDistrict(updatedBranchDTO.getDistrict());
        existingBranch.setStatus(updatedBranchDTO.getStatus());
        Branch savedBranch = branchRepository.save(existingBranch);
        log.info("Branch updated successfully with code: {}", savedBranch.getBranchCode());
        return savedBranch;
    }

    @Override
    public List<Branch> findBranchesByCity(String city) {
        log.info("Fetching branches by city: {}", city);
        return branchRepository.findByCity(city);
    }

    @Override
    @Transactional
    public Branch toggleBranchStatus(String branchCode) {
        log.info("Toggling status for branch with code: {}", branchCode);
        Branch branch = getBranchByCode(branchCode);
        branch.setStatus(branch.getStatus() == ProductStatus.SHOW ? ProductStatus.HIDE : ProductStatus.SHOW);
        Branch updatedBranch = branchRepository.save(branch);
        log.info("Branch status updated to {} for code: {}", updatedBranch.getStatus(), branchCode);
        return updatedBranch;
    }

    @Override
    public Page<Branch> getAllBranches(Pageable pageable) {
        log.info("Fetching all branches with pageable: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return branchRepository.findAll(pageable); // Sử dụng phương thức mặc định từ JpaRepository
    }
}
