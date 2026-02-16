package com.jobportal.controller;

import com.jobportal.dto.JobDTO;
import com.jobportal.model.Job;
import com.jobportal.service.JobService;
import com.jobportal.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Jobs", description = "Job management endpoints")
public class JobController {

    @Autowired
    private JobService jobService;

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
    @Operation(summary = "Create a new job posting (recruiters only)")
    public ResponseEntity<JobDTO> createJob(@RequestBody JobDTO jobDTO) {
        Long recruiterId = getCurrentUserId();
        Job job = jobService.createJob(jobDTO, recruiterId);
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.convertToDTO(job));
    }

    @GetMapping
    @Operation(summary = "Get all active jobs with optional search filters")
    public ResponseEntity<List<JobDTO>> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String experienceLevel) {

        List<JobDTO> jobs;
        if (title != null || location != null || company != null || experienceLevel != null) {
            jobs = jobService.searchJobs(title, location, company, experienceLevel);
        } else {
            jobs = jobService.getAllJobs();
        }

        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job details by ID")
    public ResponseEntity<JobDTO> getJobById(@PathVariable Long id) {
        Job job = jobService.getJobById(id);
        return ResponseEntity.ok(jobService.convertToDTO(job));
    }

    @GetMapping("/my-jobs")
    @Operation(summary = "Get all jobs posted by the current recruiter")
    public ResponseEntity<List<JobDTO>> getMyJobs() {
        Long recruiterId = getCurrentUserId();
        List<JobDTO> jobs = jobService.getRecruiterJobs(recruiterId);
        return ResponseEntity.ok(jobs);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update job posting")
    public ResponseEntity<JobDTO> updateJob(@PathVariable Long id, @RequestBody JobDTO jobDTO) {
        Long recruiterId = getCurrentUserId();
        Job job = jobService.updateJob(id, jobDTO, recruiterId);
        return ResponseEntity.ok(jobService.convertToDTO(job));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete job posting")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        Long recruiterId = getCurrentUserId();
        jobService.deleteJob(id, recruiterId);
        return ResponseEntity.noContent().build();
    }
}
