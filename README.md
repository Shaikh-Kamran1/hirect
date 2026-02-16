# Hirect Web Application

A full-stack job posting and application platform with multi-role authentication built with Spring Boot and React.

## Features

- **Multi-Role Authentication**
  - Recruiter registration & login
  - Job Seeker registration & login
  - Profile management for both roles
  - JWT-based authentication

- **Recruiter Features**
  - Post new jobs
  - Edit/Update job listings
  - Delete job postings
  - View applications for posted jobs
  - Manage application status (Accept/Reject)
  - Dashboard with job statistics

- **Job Seeker Features**
  - Browse all job listings
  - Search jobs by keywords, location, company
  - Filter jobs by category, experience level, salary
  - View job details
  - Apply for jobs with resume and cover letter
  - Track application status
  - View application history

- **Responsive UI**
  - Role-based interface
  - Mobile-friendly design
  - Real-time updates
  - Form validation
  - Toast notifications

## Technology Stack

### Backend
- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17
- **Security:** Spring Security, JWT (JJWT)
- **Database:** MySQL 8.x
- **ORM:** Spring Data JPA
- **Documentation:** Swagger/OpenAPI
- **Build Tool:** Maven

### Frontend
- **Framework:** React 18.2.0
- **Routing:** React Router DOM 6
- **HTTP Client:** Axios
- **UI Framework:** Bootstrap 5, React Bootstrap
- **Form Handling:** Formik + Yup
- **Notifications:** React Toastify
- **Build Tool:** Vite
- **Date Handling:** date-fns

## Project Structure

```
job-portal/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/jobportal/
│   │   │   │   ├── config/           (Security, CORS configs)
│   │   │   │   ├── controller/       (REST endpoints)
│   │   │   │   ├── service/          (Business logic)
│   │   │   │   ├── repository/       (Database access)
│   │   │   │   ├── model/            (Entity models)
│   │   │   │   ├── dto/              (Data Transfer Objects)
│   │   │   │   ├── security/         (JWT implementation)
│   │   │   │   ├── exception/        (Error handling)
│   │   │   │   └── JobPortalApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Jobs/
│   │   │   ├── Recruiter/
│   │   │   ├── JobSeeker/
│   │   │   └── Layout/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── database/
    ├── schema.sql             (Database schema)
    └── sample-data.sql        (Sample data)
```

## Setup Instructions

### Prerequisites
- Java 17 or higher
- MySQL 8.x
- Node.js 16+ and npm

### Database Setup

1. Create the database:

```sql
CREATE DATABASE job_portal;
```

2. Run the schema file:

```bash
mysql -u root -p job_portal < database/schema.sql
```

3. (Optional) Insert sample data:

```bash
mysql -u root -p job_portal < database/sample-data.sql
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Update database credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/job_portal
spring.datasource.username=root
spring.datasource.password=your_password
```

3. Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

API Documentation (Swagger): `http://localhost:8080/swagger-ui.html`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user (recruiter or job seeker) |
| POST | `/api/auth/login` | User login |

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs` | Post a new job (recruiters only) |
| GET | `/api/jobs` | Get all active jobs with optional search filters |
| GET | `/api/jobs/{id}` | Get job details by ID |
| GET | `/api/jobs/my-jobs` | Get recruiter's posted jobs |
| PUT | `/api/jobs/{id}` | Update job posting (recruiter only) |
| DELETE | `/api/jobs/{id}` | Delete job posting (recruiter only) |

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Apply for a job |
| GET | `/api/applications/my-applications` | Get user's applications |
| GET | `/api/applications/job/{jobId}` | Get applications for a job (recruiter only) |
| GET | `/api/applications/{id}` | Get application details |
| PATCH | `/api/applications/{id}/status` | Update application status (recruiter only) |
| DELETE | `/api/applications/{id}` | Withdraw an application |

## Example API Usage

### Register as Recruiter
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@company.com",
    "fullName": "John Recruiter",
    "password": "password123",
    "role": "RECRUITER",
    "companyName": "Tech Corp",
    "phone": "555-1234"
  }'
```

### Register as Job Seeker
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seeker@example.com",
    "fullName": "Alex Developer",
    "password": "password123",
    "role": "JOB_SEEKER",
    "phone": "555-9999"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@company.com",
    "password": "password123"
  }'
```

### Post a Job
```bash
curl -X POST http://localhost:8080/api/jobs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Java Developer",
    "description": "Looking for an experienced Java developer",
    "company": "Tech Corp",
    "location": "New York, NY",
    "jobType": "Full-time",
    "experienceLevel": "Senior",
    "salaryRange": "$120,000 - $150,000",
    "requirements": "Java, Spring Boot, REST API, MySQL"
  }'
```

### Search Jobs
```bash
curl -X GET "http://localhost:8080/api/jobs?title=Java&location=New%20York&experienceLevel=Senior" \
  -H "Content-Type: application/json"
```

### Apply for Job
```bash
curl -X POST "http://localhost:8080/api/applications?jobId=1&resumePath=/resumes/cv.pdf&coverLetter=Great%20opportunity" \
  -H "Authorization: Bearer <token>"
```

## User Roles

### Recruiter
- Post new job listings
- Edit and delete job postings
- View applications for posted jobs
- Accept or reject applications
- See candidate profiles and resumes

### Job Seeker
- Browse all available jobs
- Search and filter jobs
- Apply for jobs with resume and cover letter
- Track application status
- Withdraw applications

## Features Overview

### For Recruiters
- **Job Posting:** Easily post new job opportunities with full details
- **Application Management:** Review all applications and manage their status
- **Dashboard:** View job postings and application statistics
- **Search Candidates:** Find applications by status and other criteria

### For Job Seekers
- **Job Discovery:** Browse and search jobs that match your profile
- **Application Tracking:** Keep track of all applied jobs and their status
- **Profile Management:** Upload resume and maintain profile information
- **Application Management:** Withdraw applications if needed

## Security Features

- JWT-based authentication for secure API access
- Role-based authorization (Recruiter/Job Seeker)
- Password encryption with BCrypt
- Protected API endpoints
- User-specific data isolation

## Future Enhancements

- [ ] Email notifications for new applications
- [ ] Interview scheduling system
- [ ] Advanced analytics for recruiters
- [ ] Candidate skill assessment
- [ ] Salary expectation matching
- [ ] Interview feedback
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Video interview integration
- [ ] Mobile app
- [ ] Job recommendation engine
- [ ] AI-powered resume screening

## Testing

### Backend Tests
```bash
mvn test
```

### Frontend Tests
```bash
npm test
```

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check database credentials in application.properties
- Ensure database exists

### Port Already in Use
- Backend: Change port in application.properties
- Frontend: Change port in vite.config.js

### CORS Errors
- Ensure frontend URL is allowed in SecurityConfig
- Check backend is running before frontend

### Application Not Showing
- Verify recruiter owns the job posting
- Check user role (recruiter vs job seeker)

## Performance Optimization

- Database indexes on frequently searched columns
- Lazy loading of related entities
- Query optimization with JPA
- Frontend code splitting with React

## License

MIT License

## Author

Created as a full-stack demonstration project for resume portfolio
