package com.example.be_phela.interService;

import com.example.be_phela.model.Application;
import com.example.be_phela.model.JobPosting;
import com.example.be_phela.model.enums.ApplicationStatus;
import com.example.be_phela.model.enums.JobStatus;

import java.util.List;

public interface IJobPostingService {
    JobPosting createJobPosting(JobPosting jobPosting);
    JobPosting getJobPostingById(String jobPostingId);
    List<JobPosting> getAllJobPostings();
    List<JobPosting> getActiveJobPostings();
    JobPosting updateJobPosting(String jobPostingId, JobPosting jobPosting);
    void deleteJobPosting(String jobPostingId);
    void updateJobStatus(String jobPostingId, JobStatus status);
    long countApplications(String jobPostingId);
    void approveApplication(String jobPostingId, String applicationId);
    Application getApplicationDetails(String jobPostingId, String applicationId);
    void updateApplicationStatus(String jobPostingId, String applicationId, ApplicationStatus status);
}
