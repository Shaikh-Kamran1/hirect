package com.jobportal.service;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserService userService;

    public Application applyForJob(Long jobId, Long applicantId, String resumePath, String coverLetter) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        User applicant = userService.findById(applicantId);

        if (!userService.isJobSeeker(applicantId)) {
            throw new RuntimeException("Only job seekers can apply for jobs");
        }

        // Check if already applied
        if (applicationRepository.findByJobIdAndApplicantId(jobId, applicantId).isPresent()) {
            throw new RuntimeException("You have already applied for this job");
        }

        Application application = new Application();
        application.setJob(job);
        application.setApplicant(applicant);
        application.setResumePath(resumePath);
        application.setCoverLetter(coverLetter);
        application.setStatus("PENDING");

        return applicationRepository.save(application);
    }

    public List<ApplicationDTO> getApplicantApplications(Long applicantId) {
        userService.findById(applicantId);
        return applicationRepository.findByApplicantId(applicantId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ApplicationDTO> getJobApplications(Long jobId, Long recruiterId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.getRecruiter().getId().equals(recruiterId)) {
            throw new RuntimeException("Unauthorized to view applications for this job");
        }

        return applicationRepository.findByJobId(jobId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Application getApplicationById(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));
    }

    public Application updateApplicationStatus(Long applicationId, String status, Long recruiterId) {
        Application application = getApplicationById(applicationId);

        if (!application.getJob().getRecruiter().getId().equals(recruiterId)) {
            throw new RuntimeException("Unauthorized to update this application");
        }

        application.setStatus(status);
        return applicationRepository.save(application);
    }

    public void withdrawApplication(Long applicationId, Long applicantId) {
        Application application = getApplicationById(applicationId);

        if (!application.getApplicant().getId().equals(applicantId)) {
            throw new RuntimeException("Unauthorized to withdraw this application");
        }

        applicationRepository.deleteById(applicationId);
    }

    public ApplicationDTO convertToDTO(Application application) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setId(application.getId());
        dto.setJobId(application.getJob().getId());
        dto.setJobTitle(application.getJob().getTitle());
        dto.setApplicantId(application.getApplicant().getId());
        dto.setApplicantName(application.getApplicant().getFullName());
        dto.setApplicantEmail(application.getApplicant().getEmail());
        dto.setResumePath(application.getResumePath());
        dto.setCoverLetter(application.getCoverLetter());
        dto.setStatus(application.getStatus());
        dto.setAppliedDate(application.getAppliedDate());
        return dto;
    }
}
