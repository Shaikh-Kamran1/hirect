-- Sample data for Job Portal
-- Note: Passwords are hashed with BCrypt. The plain passwords are shown in comments.

USE job_portal;

-- Sample users (Plain passwords: recruiter123, seeker123)
-- Recruiters
INSERT INTO users (email, password, full_name, role, company_name, phone) VALUES
('recruiter1@company.com', '$2a$10$slYQmyNdGzin7olVN3p5aOYe15ipv.zdbQi3CMr94nPPbI3H6Yhauq', 'John Recruiter', 'RECRUITER', 'Tech Corp', '555-1234'),
('recruiter2@company.com', '$2a$10$slYQmyNdGzin7olVN3p5aOYe15ipv.zdbQi3CMr94nPPbI3H6YHOUQ', 'Jane HR', 'RECRUITER', 'Innovation Inc', '555-5678');

-- Job Seekers
INSERT INTO users (email, password, full_name, role, phone) VALUES
('seeker1@example.com', '$2a$10$slYQmyNdGzin7olVN3p5aOYe15ipv.zdbQi3CMr94nPPbI3H6Yhauq', 'Alex Developer', 'JOB_SEEKER', '555-9999'),
('seeker2@example.com', '$2a$10$slYQmyNdGzin7olVN3p5aOYe15ipv.zdbQi3CMr94nPPbI3H6YHOUQ', 'Sarah Designer', 'JOB_SEEKER', '555-8888');

-- Sample jobs posted by recruiter1
INSERT INTO jobs (title, description, company, location, job_type, experience_level, salary_range, requirements, recruiter_id, status) VALUES
('Senior Java Developer', 'Looking for an experienced Java developer with Spring Boot expertise', 'Tech Corp', 'New York, NY', 'Full-time', 'Senior', '$120,000 - $150,000', 'Java, Spring Boot, REST API, MySQL', 1, 'ACTIVE'),
('React Frontend Engineer', 'Seeking a talented React developer for our web platform', 'Tech Corp', 'San Francisco, CA', 'Full-time', 'Mid-level', '$100,000 - $130,000', 'React, JavaScript, CSS, Redux', 1, 'ACTIVE'),
('DevOps Engineer', 'Help us scale our infrastructure with AWS and Docker', 'Tech Corp', 'Austin, TX', 'Full-time', 'Senior', '$130,000 - $160,000', 'AWS, Docker, Kubernetes, CI/CD', 1, 'ACTIVE');

-- Sample jobs posted by recruiter2
INSERT INTO jobs (title, description, company, location, job_type, experience_level, salary_range, requirements, recruiter_id, status) VALUES
('UI/UX Designer', 'Design beautiful and intuitive user interfaces', 'Innovation Inc', 'Chicago, IL', 'Full-time', 'Mid-level', '$80,000 - $110,000', 'Figma, UX Design, Prototyping', 2, 'ACTIVE'),
('Data Analyst', 'Analyze data and provide insights for business decisions', 'Innovation Inc', 'Boston, MA', 'Full-time', 'Entry-level', '$60,000 - $80,000', 'SQL, Python, Data Visualization', 2, 'ACTIVE');

-- Sample applications
INSERT INTO applications (job_id, applicant_id, resume_path, cover_letter, status) VALUES
(1, 3, '/resumes/alex_resume.pdf', 'I am very interested in this Senior Java Developer position.', 'PENDING'),
(1, 4, '/resumes/sarah_resume.pdf', 'Excited to apply for this opportunity.', 'ACCEPTED'),
(2, 3, '/resumes/alex_resume.pdf', 'I would like to apply for the React position.', 'PENDING'),
(3, 4, '/resumes/sarah_resume.pdf', 'Interested in DevOps role.', 'REJECTED'),
(4, 3, '/resumes/alex_resume.pdf', 'Great opportunity for UI/UX design.', 'PENDING'),
(5, 4, '/resumes/sarah_resume.pdf', 'Looking forward to data analyst role.', 'PENDING');
