package com.example.be_phela.interService;

import com.example.be_phela.dto.request.BranchCreateDTO;
import com.example.be_phela.model.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IBranchService {
    String generateBranchCode();
    Branch createBranch(BranchCreateDTO branchDTO);
    public Page<Branch> getAllBranches(Pageable pageable);
    Branch getBranchByCode(String branchCode);
    Branch updateBranch(String branchCode, BranchCreateDTO updatedBranchDTO);
    List<Branch> findBranchesByCity(String city);
    Branch toggleBranchStatus(String branchCode);
}
