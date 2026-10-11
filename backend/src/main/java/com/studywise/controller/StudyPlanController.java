package com.studywise.controller;

import com.studywise.dto.request.PlanStatusUpdateRequest;
import com.studywise.dto.request.StudyPlanRequest;
import com.studywise.dto.response.ApiResponse;
import com.studywise.dto.response.StudyPlanResponse;
import com.studywise.service.StudyPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controller exposing RESTful endpoints for study plans, calendar views, and task tracking.
 */
@RestController
@RequestMapping("/api/study-plans")
@RequiredArgsConstructor
public class StudyPlanController {

    private final StudyPlanService studyPlanService;

    /**
     * Retrieves study plans with optional query filters (by single date, date range, or subject).
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<StudyPlanResponse>>> getStudyPlans(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long subjectId
    ) {
        List<StudyPlanResponse> plans;
        if (date != null) {
            plans = studyPlanService.getStudyPlansByDate(date);
        } else if (startDate != null && endDate != null) {
            plans = studyPlanService.getStudyPlansByDateRange(startDate, endDate);
        } else if (subjectId != null) {
            plans = studyPlanService.getStudyPlansBySubject(subjectId);
        } else {
            plans = studyPlanService.getAllStudyPlans();
        }

        return ResponseEntity.ok(ApiResponse.ok("Study plans retrieved successfully", plans));
    }

    /**
     * Retrieves a single study plan by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudyPlanResponse>> getStudyPlanById(@PathVariable Long id) {
        StudyPlanResponse plan = studyPlanService.getStudyPlanById(id);
        return ResponseEntity.ok(ApiResponse.ok("Study plan retrieved successfully", plan));
    }

    /**
     * Creates a new study plan / task.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<StudyPlanResponse>> createStudyPlan(
            @Valid @RequestBody StudyPlanRequest request) {
        StudyPlanResponse createdPlan = studyPlanService.createStudyPlan(request);
        return new ResponseEntity<>(
                ApiResponse.ok("Study plan created successfully", createdPlan),
                HttpStatus.CREATED
        );
    }

    /**
     * Updates an existing study plan by ID.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudyPlanResponse>> updateStudyPlan(
            @PathVariable Long id,
            @Valid @RequestBody StudyPlanRequest request) {
        StudyPlanResponse updatedPlan = studyPlanService.updateStudyPlan(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Study plan updated successfully", updatedPlan));
    }

    /**
     * Updates the status of a study plan (PENDING, IN_PROGRESS, COMPLETED).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<StudyPlanResponse>> updatePlanStatus(
            @PathVariable Long id,
            @Valid @RequestBody PlanStatusUpdateRequest request) {
        StudyPlanResponse updatedPlan = studyPlanService.updatePlanStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Task status updated successfully", updatedPlan));
    }

    /**
     * Deletes a study plan by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudyPlan(@PathVariable Long id) {
        studyPlanService.deleteStudyPlan(id);
        return ResponseEntity.ok(ApiResponse.ok("Study plan deleted successfully", null));
    }
}
