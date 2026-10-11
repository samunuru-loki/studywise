package com.studywise.service;

import com.studywise.dto.request.SubjectRequest;
import com.studywise.dto.response.SubjectResponse;
import com.studywise.entity.PlanStatus;
import com.studywise.entity.Subject;
import com.studywise.entity.User;
import com.studywise.exception.BadRequestException;
import com.studywise.exception.ResourceNotFoundException;
import com.studywise.repository.NoteRepository;
import com.studywise.repository.StudyPlanRepository;
import com.studywise.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing academic subjects with user-scoped isolation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final StudyPlanRepository studyPlanRepository;
    private final NoteRepository noteRepository;
    private final AuthService authService;

    /**
     * Retrieves all subjects belonging to the authenticated student.
     *
     * @return list of SubjectResponse objects
     */
    @Transactional(readOnly = true)
    public List<SubjectResponse> getAllSubjects() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<Subject> subjects = subjectRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());

        return subjects.stream()
                .map(this::mapToSubjectResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single subject by ID ensuring ownership.
     *
     * @param id subject ID
     * @return SubjectResponse
     */
    @Transactional(readOnly = true)
    public SubjectResponse getSubjectById(Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Subject subject = findSubjectAndVerifyOwnership(id, currentUser.getId());
        return mapToSubjectResponse(subject);
    }

    /**
     * Creates a new subject for the authenticated student.
     *
     * @param request subject creation details
     * @return created SubjectResponse
     */
    @Transactional
    public SubjectResponse createSubject(SubjectRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();

        if (subjectRepository.existsByNameIgnoreCaseAndUserId(request.getName().trim(), currentUser.getId())) {
            throw new BadRequestException("Subject with name '" + request.getName() + "' already exists.");
        }

        Subject subject = Subject.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .color(request.getColor() != null ? request.getColor() : "#3B82F6")
                .user(currentUser)
                .build();

        Subject savedSubject = subjectRepository.save(subject);
        log.info("Created new subject '{}' (ID: {}) for user ID: {}", savedSubject.getName(), savedSubject.getId(), currentUser.getId());

        return mapToSubjectResponse(savedSubject);
    }

    /**
     * Updates an existing subject ensuring ownership.
     *
     * @param id subject ID
     * @param request subject update details
     * @return updated SubjectResponse
     */
    @Transactional
    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Subject subject = findSubjectAndVerifyOwnership(id, currentUser.getId());

        if (subjectRepository.existsByNameIgnoreCaseAndUserIdAndIdNot(request.getName().trim(), currentUser.getId(), id)) {
            throw new BadRequestException("Another subject with name '" + request.getName() + "' already exists.");
        }

        subject.setName(request.getName().trim());
        subject.setDescription(request.getDescription());
        subject.setColor(request.getColor());

        Subject updatedSubject = subjectRepository.save(subject);
        log.info("Updated subject ID: {} for user ID: {}", updatedSubject.getId(), currentUser.getId());

        return mapToSubjectResponse(updatedSubject);
    }

    /**
     * Deletes a subject and its cascaded plans/notes ensuring ownership.
     *
     * @param id subject ID
     */
    @Transactional
    public void deleteSubject(Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Subject subject = findSubjectAndVerifyOwnership(id, currentUser.getId());

        subjectRepository.delete(subject);
        log.info("Deleted subject ID: {} for user ID: {}", id, currentUser.getId());
    }

    /**
     * Helper to verify subject ownership.
     */
    public Subject findSubjectAndVerifyOwnership(Long subjectId, Long userId) {
        return subjectRepository.findByIdAndUserId(subjectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", subjectId));
    }

    /**
     * Maps Subject entity to SubjectResponse with aggregated metrics.
     */
    public SubjectResponse mapToSubjectResponse(Subject subject) {
        long totalPlans = studyPlanRepository.countBySubjectId(subject.getId());
        long completedPlans = studyPlanRepository.countBySubjectIdAndStatus(subject.getId(), PlanStatus.COMPLETED);
        long totalNotes = noteRepository.countBySubjectId(subject.getId());

        return SubjectResponse.builder()
                .id(subject.getId())
                .name(subject.getName())
                .description(subject.getDescription())
                .color(subject.getColor())
                .totalPlans(totalPlans)
                .completedPlans(completedPlans)
                .totalNotes(totalNotes)
                .createdAt(subject.getCreatedAt())
                .build();
    }
}
