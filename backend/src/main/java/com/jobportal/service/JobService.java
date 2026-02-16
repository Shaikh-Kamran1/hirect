package com.jobportal.service;

import com.jobportal.dto.JobDTO;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserService userService;

    public Job createJob(JobDTO jobDTO, Long recruiterId) {
        User recruiter = userService.findById(recruiterId);

        if (!userService.isRecruiter(recruiterId)) {
            throw new RuntimeException("Only recruiters can post jobs");
        }

        Job job = new Job();
        job.setTitle(jobDTO.getTitle());
        job.setDescription(jobDTO.getDescription());
        job.setCompany(jobDTO.getCompany());
        job.setLocation(jobDTO.getLocation());
        job.setJobType(jobDTO.getJobType());
        job.setExperienceLevel(jobDTO.getExperienceLevel());
        job.setSalaryRange(jobDTO.getSalaryRange());
        job.setRequirements(jobDTO.getRequirements());
        job.setRecruiter(recruiter);
        job.setStatus("ACTIVE");

        return jobRepository.save(job);
    }

    public Job getJobById(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
    }

    public List<JobDTO> getAllJobs() {
        return jobRepository.findByStatus("ACTIVE").stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobDTO> getRecruiterJobs(Long recruiterId) {
        userService.findById(recruiterId);
        return jobRepository.findByRecruiterId(recruiterId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobDTO> searchJobs(String title, String location, String company, String experienceLevel) {
        return jobRepository.searchJobs(title, location, company, experienceLevel).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Job updateJob(Long jobId, JobDTO jobDTO, Long recruiterId) {
        Job job = getJobById(jobId);

        if (!job.getRecruiter().getId().equals(recruiterId)) {
            throw new RuntimeException("Unauthorized to update this job");
        }

        if (jobDTO.getTitle() != null) job.setTitle(jobDTO.getTitle());
        if (jobDTO.getDescription() != null) job.setDescription(jobDTO.getDescription());
        if (jobDTO.getLocation() != null) job.setLocation(jobDTO.getLocation());
        if (jobDTO.getJobType() != null) job.setJobType(jobDTO.getJobType());
        if (jobDTO.getExperienceLevel() != null) job.setExperienceLevel(jobDTO.getExperienceLevel());
        if (jobDTO.getSalaryRange() != null) job.setSalaryRange(jobDTO.getSalaryRange());
        if (jobDTO.getRequirements() != null) job.setRequirements(jobDTO.getRequirements());

        return jobRepository.save(job);
    }

    public void deleteJob(Long jobId, Long recruiterId) {
        Job job = getJobById(jobId);

        if (!job.getRecruiter().getId().equals(recruiterId)) {
            throw new RuntimeException("Unauthorized to delete this job");
        }

        jobRepository.deleteById(jobId);
    }

    public JobDTO convertToDTO(Job job) {
        JobDTO dto = new JobDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setCompany(job.getCompany());
        dto.setLocation(job.getLocation());
        dto.setJobType(job.getJobType());
        dto.setExperienceLevel(job.getExperienceLevel());
        dto.setSalaryRange(job.getSalaryRange());
        dto.setRequirements(job.getRequirements());
        dto.setRecruiterId(job.getRecruiter().getId());
        dto.setRecruiterName(job.getRecruiter().getFullName());
        dto.setStatus(job.getStatus());
        dto.setPostedDate(job.getPostedDate());
        dto.setApplicationCount((int) applicationRepository.countByJobId(job.getId()));
        return dto;
    }
}
