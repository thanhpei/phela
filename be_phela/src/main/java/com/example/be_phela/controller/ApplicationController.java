package com.example.be_phela.controller;

import com.example.be_phela.model.Application;
import com.example.be_phela.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationController {

    ApplicationService applicationService;

    @PostMapping("/job-postings/{jobPostingId}/apply")
    public ResponseEntity<Application> applyForJob(
            @PathVariable String jobPostingId,
            @Valid @RequestBody Application application) {
        Application createdApplication = applicationService.applyForJob(jobPostingId, application);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdApplication);
    }
}