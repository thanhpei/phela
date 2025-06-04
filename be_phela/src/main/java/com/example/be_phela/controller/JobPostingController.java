package com.example.be_phela.controller;

import com.example.be_phela.model.Application;
import com.example.be_phela.model.JobPosting;
import com.example.be_phela.model.enums.ApplicationStatus;
import com.example.be_phela.model.enums.JobStatus;
import com.example.be_phela.service.JobPostingService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-postings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobPostingController {

    JobPostingService jobPostingService;

    @PostMapping
    public ResponseEntity<JobPosting> createJobPosting(@Valid @RequestBody JobPosting jobPosting) {
        JobPosting createdJob = jobPostingService.createJobPosting(jobPosting);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
    }

    @GetMapping("/{jobPostingId}")
    public ResponseEntity<JobPosting> getJobPostingById(@PathVariable String jobPostingId) {
        return ResponseEntity.ok(jobPostingService.getJobPostingById(jobPostingId));
    }

    @GetMapping
    public ResponseEntity<List<JobPosting>> getAllJobPostings() {
        return ResponseEntity.ok(jobPostingService.getAllJobPostings());
    }

    @GetMapping("/active")
    public ResponseEntity<List<JobPosting>> getActiveJobPostings() {
        return ResponseEntity.ok(jobPostingService.getActiveJobPostings());
    }

    @PutMapping("/{jobPostingId}")
    public ResponseEntity<JobPosting> updateJobPosting(
            @PathVariable String jobPostingId,
            @Valid @RequestBody JobPosting jobPosting) {
        return ResponseEntity.ok(jobPostingService.updateJobPosting(jobPostingId, jobPosting));
    }

    @DeleteMapping("/{jobPostingId}")
    public ResponseEntity<Void> deleteJobPosting(@PathVariable String jobPostingId) {
        jobPostingService.deleteJobPosting(jobPostingId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{jobPostingId}/status")
    public ResponseEntity<Void> updateJobStatus(
            @PathVariable String jobPostingId,
            @RequestParam JobStatus status) {
        jobPostingService.updateJobStatus(jobPostingId, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{jobPostingId}/applications/count")
    public ResponseEntity<Long> countApplications(@PathVariable String jobPostingId) {
        return ResponseEntity.ok(jobPostingService.countApplications(jobPostingId));
    }

    @PatchMapping("/{jobPostingId}/applications/{applicationId}/approve")
    public ResponseEntity<Void> approveApplication(
            @PathVariable String jobPostingId,
            @PathVariable String applicationId) {
        jobPostingService.approveApplication(jobPostingId, applicationId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{jobPostingId}/applications/{applicationId}")
    public ResponseEntity<Application> getApplicationDetails(
            @PathVariable String jobPostingId,
            @PathVariable String applicationId) {
        return ResponseEntity.ok(jobPostingService.getApplicationDetails(jobPostingId, applicationId));
    }

    @PatchMapping("/{jobPostingId}/applications/{applicationId}/status")
    public ResponseEntity<Void> updateApplicationStatus(
            @PathVariable String jobPostingId,
            @PathVariable String applicationId,
            @RequestParam ApplicationStatus status) {
        jobPostingService.updateApplicationStatus(jobPostingId, applicationId, status);
        return ResponseEntity.ok().build();
    }
}