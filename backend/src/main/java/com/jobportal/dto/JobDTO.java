package com.jobportal.dto;

import java.time.LocalDateTime;

public class JobDTO {

    private Long id;
    private String title;
    private String description;
    private String company;
    private String location;
    private String jobType;
    private String experienceLevel;
    private String salaryRange;
    private String requirements;
    private Long recruiterId;
    private String recruiterName;
    private String status;
    private LocalDateTime postedDate;
    private int applicationCount;

    public JobDTO() {}

    public JobDTO(Long id, String title, String description, String company, String location, String jobType, String experienceLevel, String salaryRange, String requirements, Long recruiterId, String recruiterName, String status, LocalDateTime postedDate, int applicationCount) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.company = company;
        this.location = location;
        this.jobType = jobType;
        this.experienceLevel = experienceLevel;
        this.salaryRange = salaryRange;
        this.requirements = requirements;
        this.recruiterId = recruiterId;
        this.recruiterName = recruiterName;
        this.status = status;
        this.postedDate = postedDate;
        this.applicationCount = applicationCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getSalaryRange() { return salaryRange; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public Long getRecruiterId() { return recruiterId; }
    public void setRecruiterId(Long recruiterId) { this.recruiterId = recruiterId; }

    public String getRecruiterName() { return recruiterName; }
    public void setRecruiterName(String recruiterName) { this.recruiterName = recruiterName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getPostedDate() { return postedDate; }
    public void setPostedDate(LocalDateTime postedDate) { this.postedDate = postedDate; }

    public int getApplicationCount() { return applicationCount; }
    public void setApplicationCount(int applicationCount) { this.applicationCount = applicationCount; }
}
