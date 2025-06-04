package com.example.be_phela.interService;

import com.example.be_phela.model.Application;

public interface IApplicationService {
    Application applyForJob(String jobPostingId, Application application);
}
