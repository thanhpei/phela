package com.example.be_phela.service;

import com.example.be_phela.interService.IJobPostingService;
import com.example.be_phela.model.Application;
import com.example.be_phela.model.JobPosting;
import com.example.be_phela.model.enums.ApplicationStatus;
import com.example.be_phela.model.enums.JobStatus;
import com.example.be_phela.repository.JobPostingRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobPostingService implements IJobPostingService {

    JobPostingRepository jobPostingRepository;

    @Override
    @Transactional
    public void approveApplication(String jobPostingId, String applicationId) {
        // Tìm JobPosting
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new RuntimeException("Job posting not found with id: " + jobPostingId));

        // Tìm Application trong danh sách ứng tuyển
        Application application = jobPosting.getApplications().stream()
                .filter(app -> app.getApplicationId().equals(applicationId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        // Kiểm tra trạng thái hiện tại
        if (application.getStatus() == ApplicationStatus.ACCEPTED) {
            throw new RuntimeException("Application is already approved");
        }

        // Cập nhật trạng thái thành APPROVED
        application.setStatus(ApplicationStatus.ACCEPTED);
        application.setUpdatedAt(LocalDateTime.now()); // Cập nhật thời gian

        // Lưu thay đổi (với CascadeType.ALL, lưu JobPosting sẽ tự động lưu Application)
        jobPostingRepository.save(jobPosting);
    }

    @Override
    @Transactional(readOnly = true)
    public Application getApplicationDetails(String jobPostingId, String applicationId) {
        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new RuntimeException("Job posting not found with id: " + jobPostingId));

        return jobPosting.getApplications().stream()
                .filter(app -> app.getApplicationId().equals(applicationId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));
    }

    @Override
    @Transactional
    public void updateApplicationStatus(String jobPostingId, String applicationId, ApplicationStatus status) {
        if (status == null) {
            throw new RuntimeException("Status cannot be null");
        }

        JobPosting jobPosting = jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new RuntimeException("Job posting not found with id: " + jobPostingId));

        Application application = jobPosting.getApplications().stream()
                .filter(app -> app.getApplicationId().equals(applicationId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        // Kiểm tra chuyển trạng thái hợp lệ (tùy chỉnh logic nếu cần)
        if (application.getStatus() == status) {
            throw new RuntimeException("Application is already in status: " + status);
        }
        if (application.getStatus() == ApplicationStatus.ACCEPTED && status != ApplicationStatus.ACCEPTED) {
            throw new RuntimeException("Cannot change status of an accepted application");
        }

        application.setStatus(status);
        application.setUpdatedAt(LocalDateTime.now());
        jobPostingRepository.save(jobPosting);
    }

    @Override
    @Transactional
    public JobPosting createJobPosting(JobPosting jobPosting) {
        if (jobPosting.getDeadline().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Deadline must be in the future");
        }
        if (jobPosting.getStatus() == null) {
            jobPosting.setStatus(JobStatus.OPEN);
        }
        return jobPostingRepository.save(jobPosting);
    }

    @Override
    @Transactional(readOnly = true)
    public JobPosting getJobPostingById(String jobPostingId) {
        return jobPostingRepository.findById(jobPostingId)
                .orElseThrow(() -> new RuntimeException("Job posting not found with id: " + jobPostingId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobPosting> getAllJobPostings() {
        return jobPostingRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobPosting> getActiveJobPostings() {
        return jobPostingRepository.findByStatusAndDeadlineAfter(JobStatus.OPEN, LocalDateTime.now());
    }

    @Override
    @Transactional
    public JobPosting updateJobPosting(String jobPostingId, JobPosting jobPosting) {
        JobPosting existing = getJobPostingById(jobPostingId);
        existing.setTitle(jobPosting.getTitle());
        existing.setDescription(jobPosting.getDescription());
        existing.setRequirements(jobPosting.getRequirements());
        existing.setSalaryRange(jobPosting.getSalaryRange());
        existing.setExperienceLevel(jobPosting.getExperienceLevel());
        existing.setBranch(jobPosting.getBranch());
        existing.setDeadline(jobPosting.getDeadline());
        if (jobPosting.getStatus() != null) {
            existing.setStatus(jobPosting.getStatus());
        }
        return jobPostingRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteJobPosting(String jobPostingId) {
        JobPosting jobPosting = getJobPostingById(jobPostingId);
        jobPostingRepository.delete(jobPosting);
    }

    @Override
    @Transactional
    public void updateJobStatus(String jobPostingId, JobStatus status) {
        JobPosting jobPosting = getJobPostingById(jobPostingId);
        if (status == null) {
            throw new RuntimeException("Status cannot be null");
        }
        jobPosting.setStatus(status);
        jobPostingRepository.save(jobPosting);
    }

    @Override
    @Transactional(readOnly = true)
    public long countApplications(String jobPostingId) {
        JobPosting jobPosting = getJobPostingById(jobPostingId);
        return jobPosting.getApplications().stream().count();
    }
}