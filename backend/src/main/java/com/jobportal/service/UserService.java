package com.jobportal.service;

import com.jobportal.dto.AuthResponse;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.User;
import com.jobportal.model.UserRole;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String email, String fullName, String password, String role,
                           String companyName, String phone) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(UserRole.valueOf(role));
        user.setCompanyName(companyName);
        user.setPhone(phone);

        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public AuthResponse convertToAuthResponse(User user) {
        return new AuthResponse(
            null,
            "Bearer",
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            user.getRole().toString(),
            user.getCompanyName()
        );
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public boolean isRecruiter(Long userId) {
        User user = findById(userId);
        return user.getRole() == UserRole.RECRUITER;
    }

    public boolean isJobSeeker(Long userId) {
        User user = findById(userId);
        return user.getRole() == UserRole.JOB_SEEKER;
    }
}
