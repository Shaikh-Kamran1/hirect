package com.jobportal.config;

import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.model.UserRole;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, JobRepository jobRepository,
                           ApplicationRepository applicationRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // Create Recruiters
        User recruiter1 = new User();
        recruiter1.setEmail("recruiter1@company.com");
        recruiter1.setPassword(passwordEncoder.encode("recruiter123"));
        recruiter1.setFullName("Alice Johnson");
        recruiter1.setRole(UserRole.RECRUITER);
        recruiter1.setCompanyName("Tech Corp");
        recruiter1.setPhone("555-0101");
        recruiter1 = userRepository.save(recruiter1);

        User recruiter2 = new User();
        recruiter2.setEmail("recruiter2@company.com");
        recruiter2.setPassword(passwordEncoder.encode("recruiter123"));
        recruiter2.setFullName("Bob Williams");
        recruiter2.setRole(UserRole.RECRUITER);
        recruiter2.setCompanyName("Innovation Labs");
        recruiter2.setPhone("555-0102");
        recruiter2 = userRepository.save(recruiter2);

        // Create Job Seekers
        User seeker1 = new User();
        seeker1.setEmail("seeker1@example.com");
        seeker1.setPassword(passwordEncoder.encode("seeker123"));
        seeker1.setFullName("Charlie Brown");
        seeker1.setRole(UserRole.JOB_SEEKER);
        seeker1.setPhone("555-0201");
        seeker1 = userRepository.save(seeker1);

        User seeker2 = new User();
        seeker2.setEmail("seeker2@example.com");
        seeker2.setPassword(passwordEncoder.encode("seeker123"));
        seeker2.setFullName("Diana Prince");
        seeker2.setRole(UserRole.JOB_SEEKER);
        seeker2.setPhone("555-0202");
        seeker2 = userRepository.save(seeker2);

        // Create Jobs with Indian cities and INR salaries
        Job job1 = createJob("Senior Java Developer", "We are looking for an experienced Java developer with strong expertise in building scalable applications. Work on microservices and cloud-based solutions.",
                "Tech Corp", "Bangalore", "FULL_TIME", "SENIOR", "1200000-1500000",
                "5+ years Java experience, Spring Boot, Microservices, AWS knowledge", recruiter1);

        Job job2 = createJob("React Frontend Developer", "Join our frontend team to build modern web applications with React and TypeScript. Create responsive and interactive user interfaces.",
                "Tech Corp", "Mumbai", "FULL_TIME", "MID", "1000000-1300000",
                "3+ years React experience, TypeScript, REST APIs, HTML/CSS", recruiter1);

        Job job3 = createJob("DevOps Engineer", "Help us build and maintain our cloud infrastructure on AWS. Manage CI/CD pipelines and containerized applications.",
                "Innovation Labs", "Remote", "FULL_TIME", "SENIOR", "1300000-1600000",
                "AWS, Docker, Kubernetes, CI/CD pipelines, Linux administration", recruiter2);

        Job job4 = createJob("Junior Python Developer", "Great opportunity for a junior developer to grow with a supportive team. Work on backend development and data processing.",
                "Innovation Labs", "Hyderabad", "FULL_TIME", "JUNIOR", "700000-900000",
                "Python basics, SQL, REST APIs, eager to learn and grow", recruiter2);

        Job job5 = createJob("Full Stack Intern", "Summer internship for computer science students to learn full-stack development. Great learning opportunity.",
                "Tech Corp", "Delhi", "INTERNSHIP", "ENTRY", "400000-500000",
                "Currently pursuing CS degree, basic web development knowledge", recruiter1);

        // Create Applications
        createApplication(job1, seeker1, "Excited to apply for this senior role. I have 6 years of Java experience.");
        createApplication(job2, seeker1, "I have strong React skills and would love to join your team.");
        createApplication(job1, seeker2, "Passionate Java developer looking for new challenges.");
        createApplication(job3, seeker2, "Experienced with AWS and Docker, ready to contribute.");
        createApplication(job4, seeker1, "Looking to expand my Python skills in a professional setting.");
        createApplication(job5, seeker2, "Eager to learn and grow as a full-stack developer.");

        System.out.println("✅ Hirect initialized: 4 users, 5 jobs in Indian cities with INR salaries, 6 applications");
    }

    private Job createJob(String title, String description, String company, String location,
                          String jobType, String experienceLevel, String salaryRange,
                          String requirements, User recruiter) {
        Job job = new Job();
        job.setTitle(title);
        job.setDescription(description);
        job.setCompany(company);
        job.setLocation(location);
        job.setJobType(jobType);
        job.setExperienceLevel(experienceLevel);
        job.setSalaryRange(salaryRange);
        job.setRequirements(requirements);
        job.setRecruiter(recruiter);
        return jobRepository.save(job);
    }

    private void createApplication(Job job, User applicant, String coverLetter) {
        Application app = new Application();
        app.setJob(job);
        app.setApplicant(applicant);
        app.setCoverLetter(coverLetter);
        applicationRepository.save(app);
    }
}
