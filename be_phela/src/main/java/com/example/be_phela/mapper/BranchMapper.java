package com.example.be_phela.mapper;

import com.example.be_phela.dto.request.BranchCreateDTO;
import com.example.be_phela.dto.response.BranchRepositoryDTO;
import com.example.be_phela.model.Branch;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BranchMapper {
    @Mapping(target = "branchCode", ignore = true) // branchCode sẽ được tạo trong service
    Branch toBranch(BranchCreateDTO dto);

    BranchRepositoryDTO toBranchRepositoryDTO(Branch branch);
}
