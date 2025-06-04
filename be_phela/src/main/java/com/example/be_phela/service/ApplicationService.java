package com.example.be_phela.service;

import com.example.be_phela.interService.IApplicationService;
import com.example.be_phela.model.Application;
import com.example.be_phela.model.JobPosting;
import com.example.be_phela.model.enums.ApplicationStatus;
import com.example.be_phela.model.enums.JobStatus;
import com.example.be_phela.repository.ApplicationRepository;
import com.example.be_phela.repository.JobPostingRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationService implements IApplicationService {

    JobPostingRepository jobPostingRepository;
    ApplicationRepository applicationRepository;

    @Override
    @Transactional
    public Application applyForJob(String jobPostingId, Application application) {
        // Tìm JobPosting
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new RuntimeException("Job posting not found with id: " + jobPostingId));

        // Kiểm tra JobPosting có đang hoạt động không
        if (jobPosting.getStatus() != JobStatus.OPEN) {
            throw new RuntimeException("Job posting is not active");
        }

        // Kiểm tra deadline
        if (jobPosting.getDeadline().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Application deadline has passed");
        }

        // Kiểm tra xem ứng viên đã nộp đơn chưa (dựa trên email)
        boolean alreadyApplied = jobPosting.getApplications().stream()
                .anyMatch(app -> app.getEmail().equals(application.getEmail()));
        if (alreadyApplied) {
            throw new RuntimeException("You have already applied for this job");
        }

        // Thiết lập giá trị mặc định
        application.setJobPosting(jobPosting);
        application.setStatus(ApplicationStatus.PENDING);
        application.setApplicationDate(LocalDateTime.now()); // @CreationTimestamp sẽ tự động cập nhật

        // Lưu Application
        return applicationRepository.save(application);
    }
}