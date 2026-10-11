package com.studywise.controller;

import com.studywise.dto.request.LoginRequest;
import com.studywise.dto.request.RegisterRequest;
import com.studywise.dto.response.ApiResponse;
import com.studywise.dto.response.AuthResponse;
import com.studywise.entity.User;
import com.studywise.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller handling user registration, authentication, and session identity.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint to register a new student account.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return new ResponseEntity<>(
                ApiResponse.ok("User registered successfully", authResponse),
                HttpStatus.CREATED
        );
    }

    /**
     * Endpoint to authenticate an existing student.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authResponse));
    }

    /**
     * Endpoint to fetch the current logged-in user profile.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        AuthResponse authResponse = AuthResponse.builder()
                .id(currentUser.getId())
                .name(currentUser.getName())
                .email(currentUser.getEmail())
                .role(currentUser.getRole().name())
                .build();
        return ResponseEntity.ok(ApiResponse.ok("Current user profile retrieved", authResponse));
    }
}
