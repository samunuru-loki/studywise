package com.studywise.service;

import com.studywise.dto.request.PlanStatusUpdateRequest;
import com.studywise.dto.request.StudyPlanRequest;
import com.studywise.dto.response.StudyPlanResponse;
import com.studywise.entity.PlanStatus;
import com.studywise.entity.Priority;
import com.studywise.entity.StudyPlan;
import com.studywise.entity.Subject;
import com.studywise.entity.User;
import com.studywise.exception.ResourceNotFoundException;
import com.studywise.repository.StudyPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing study plans and scheduled tasks with user isolation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StudyPlanService {

    private final StudyPlanRepository studyPlanRepository;
    private final SubjectService subjectService;
    private final AuthService authService;

    /**
     * Retrieves all study plans for the current authenticated user.
     */
    @Transactional(readOnly = true)
    public List<StudyPlanResponse> getAllStudyPlans() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        return studyPlanRepository.findByUserIdOrderByDateAscStartTimeAsc(currentUser.getId())
                .stream()
                .map(this::mapToStudyPlanResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves study plans scheduled for a specific date.
     */
    @Transactional(readOnly = true)
    public List<StudyPlanResponse> getStudyPlansByDate(LocalDate date) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        return studyPlanRepository.findByUserIdAndDateOrderByStartTimeAsc(currentUser.getId(), date)
                .stream()
                .map(this::mapToStudyPlanResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves study plans between two dates (e.g. for weekly calendar view).
     */
    @Transactional(readOnly = true)
    public List<StudyPlanResponse> getStudyPlansByDateRange(LocalDate startDate, LocalDate endDate) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        return studyPlanRepository.findByUserIdAndDateBetweenOrderByDateAscStartTimeAsc(currentUser.getId(), startDate, endDate)
                .stream()
                .map(this::mapToStudyPlanResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves study plans for a specific subject.
     */
    @Transactional(readOnly = true)
    public List<StudyPlanResponse> getStudyPlansBySubject(Long subjectId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        // Verify subject ownership
        subjectService.findSubjectAndVerifyOwnership(subjectId, currentUser.getId());

        return studyPlanRepository.findByUserIdAndSubjectIdOrderByDateAscStartTimeAsc(currentUser.getId(), subjectId)
                .stream()
                .map(this::mapToStudyPlanResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single study plan by ID ensuring ownership.
     */
    @Transactional(readOnly = true)
    public StudyPlanResponse getStudyPlanById(Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        StudyPlan plan = findPlanAndVerifyOwnership(id, currentUser.getId());
        return mapToStudyPlanResponse(plan);
    }

    /**
     * Creates a new study plan / task.
     */
    @Transactional
    public StudyPlanResponse createStudyPlan(StudyPlanRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Subject subject = subjectService.findSubjectAndVerifyOwnership(request.getSubjectId(), currentUser.getId());

        StudyPlan plan = StudyPlan.builder()
                .topic(request.getTopic().trim())
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM)
                .status(request.getStatus() != null ? request.getStatus() : PlanStatus.PENDING)
                .notes(request.getNotes())
                .subject(subject)
                .user(currentUser)
                .build();

        StudyPlan savedPlan = studyPlanRepository.save(plan);
        log.info("Created study plan ID: {} for user ID: {}", savedPlan.getId(), currentUser.getId());

        return mapToStudyPlanResponse(savedPlan);
    }

    /**
     * Updates an existing study plan.
     */
    @Transactional
    public StudyPlanResponse updateStudyPlan(Long id, StudyPlanRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        StudyPlan plan = findPlanAndVerifyOwnership(id, currentUser.getId());
        Subject subject = subjectService.findSubjectAndVerifyOwnership(request.getSubjectId(), currentUser.getId());

        plan.setTopic(request.getTopic().trim());
        plan.setDate(request.getDate());
        plan.setStartTime(request.getStartTime());
        plan.setEndTime(request.getEndTime());
        if (request.getPriority() != null) plan.setPriority(request.getPriority());
        if (request.getStatus() != null) plan.setStatus(request.getStatus());
        plan.setNotes(request.getNotes());
        plan.setSubject(subject);

        StudyPlan updatedPlan = studyPlanRepository.save(plan);
        log.info("Updated study plan ID: {} for user ID: {}", updatedPlan.getId(), currentUser.getId());

        return mapToStudyPlanResponse(updatedPlan);
    }

    /**
     * Quick status update for study plan tasks (e.g. checkbox or dropdown).
     */
    @Transactional
    public StudyPlanResponse updatePlanStatus(Long id, PlanStatusUpdateRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        StudyPlan plan = findPlanAndVerifyOwnership(id, currentUser.getId());

        plan.setStatus(request.getStatus());
        StudyPlan updatedPlan = studyPlanRepository.save(plan);
        log.info("Updated status for study plan ID: {} to {}", updatedPlan.getId(), request.getStatus());

        return mapToStudyPlanResponse(updatedPlan);
    }

    /**
     * Deletes a study plan ensuring ownership.
     */
    @Transactional
    public void deleteStudyPlan(Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        StudyPlan plan = findPlanAndVerifyOwnership(id, currentUser.getId());

        studyPlanRepository.delete(plan);
        log.info("Deleted study plan ID: {} for user ID: {}", id, currentUser.getId());
    }

    private StudyPlan findPlanAndVerifyOwnership(Long planId, Long userId) {
        return studyPlanRepository.findByIdAndUserId(planId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("StudyPlan", "id", planId));
    }

    public StudyPlanResponse mapToStudyPlanResponse(StudyPlan plan) {
        return StudyPlanResponse.builder()
                .id(plan.getId())
                .subjectId(plan.getSubject().getId())
                .subjectName(plan.getSubject().getName())
                .subjectColor(plan.getSubject().getColor())
                .topic(plan.getTopic())
                .date(plan.getDate())
                .startTime(plan.getStartTime())
                .endTime(plan.getEndTime())
                .priority(plan.getPriority())
                .status(plan.getStatus())
                .notes(plan.getNotes())
                .createdAt(plan.getCreatedAt())
                .build();
    }
}
