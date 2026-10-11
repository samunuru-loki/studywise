package com.studywise.controller;

import com.studywise.dto.request.SubjectRequest;
import com.studywise.dto.response.ApiResponse;
import com.studywise.dto.response.SubjectResponse;
import com.studywise.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller exposing RESTful CRUD endpoints for subject management.
 */
@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    /**
     * Retrieves all subjects belonging to the authenticated user.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAllSubjects() {
        List<SubjectResponse> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(ApiResponse.ok("Subjects retrieved successfully", subjects));
    }

    /**
     * Retrieves a single subject by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectResponse>> getSubjectById(@PathVariable Long id) {
        SubjectResponse subject = subjectService.getSubjectById(id);
        return ResponseEntity.ok(ApiResponse.ok("Subject retrieved successfully", subject));
    }

    /**
     * Creates a new subject for the authenticated user.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<SubjectResponse>> createSubject(@Valid @RequestBody SubjectRequest request) {
        SubjectResponse createdSubject = subjectService.createSubject(request);
        return new ResponseEntity<>(
                ApiResponse.ok("Subject created successfully", createdSubject),
                HttpStatus.CREATED
        );
    }

    /**
     * Updates an existing subject by ID.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectResponse>> updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody SubjectRequest request) {
        SubjectResponse updatedSubject = subjectService.updateSubject(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Subject updated successfully", updatedSubject));
    }

    /**
     * Deletes a subject and its associated data by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok(ApiResponse.ok("Subject deleted successfully", null));
    }
}
