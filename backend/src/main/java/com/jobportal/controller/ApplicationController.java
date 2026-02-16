package com.jobportal.controller;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.model.Application;
import com.jobportal.service.ApplicationService;
import com.jobportal.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Applications", description = "Job application management endpoints")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserService userService;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            String email = auth.getPrincipal().toString();
            return userService.findByEmail(email).getId();
        }
        return null;
    }

    @PostMapping
    @Operation(summary = "Apply for a job")
    public ResponseEntity<ApplicationDTO> applyForJob(
            @RequestParam Long jobId,
            @RequestParam(required = false) String resumePath,
            @RequestParam(required = false) String coverLetter) {

        Long applicantId = getCurrentUserId();
        Application application = applicationService.applyForJob(jobId, applicantId, resumePath, coverLetter);
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.convertToDTO(application));
    }

    @GetMapping("/my-applications")
    @Operation(summary = "Get all applications submitted by the current user")
    public ResponseEntity<List<ApplicationDTO>> getMyApplications() {
        Long applicantId = getCurrentUserId();
        List<ApplicationDTO> applications = applicationService.getApplicantApplications(applicantId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/job/{jobId}")
    @Operation(summary = "Get all applications for a specific job (recruiters only)")
    public ResponseEntity<List<ApplicationDTO>> getJobApplications(@PathVariable Long jobId) {
        Long recruiterId = getCurrentUserId();
        List<ApplicationDTO> applications = applicationService.getJobApplications(jobId, recruiterId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get application details by ID")
    public ResponseEntity<ApplicationDTO> getApplicationById(@PathVariable Long id) {
        Application application = applicationService.getApplicationById(id);
        return ResponseEntity.ok(applicationService.convertToDTO(application));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update application status (recruiters only)")
    public ResponseEntity<ApplicationDTO> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusRequest) {

        Long recruiterId = getCurrentUserId();
        String newStatus = statusRequest.get("status");
        Application application = applicationService.updateApplicationStatus(id, newStatus, recruiterId);
        return ResponseEntity.ok(applicationService.convertToDTO(application));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Withdraw an application")
    public ResponseEntity<Void> withdrawApplication(@PathVariable Long id) {
        Long applicantId = getCurrentUserId();
        applicationService.withdrawApplication(id, applicantId);
        return ResponseEntity.noContent().build();
    }
}
