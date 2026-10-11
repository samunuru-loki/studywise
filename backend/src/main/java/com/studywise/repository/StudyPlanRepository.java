package com.studywise.repository;

import com.studywise.entity.PlanStatus;
import com.studywise.entity.StudyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for StudyPlan entity.
 */
@Repository
public interface StudyPlanRepository extends JpaRepository<StudyPlan, Long> {

    List<StudyPlan> findByUserIdOrderByDateAscStartTimeAsc(Long userId);

    Optional<StudyPlan> findByIdAndUserId(Long id, Long userId);

    List<StudyPlan> findByUserIdAndDateOrderByStartTimeAsc(Long userId, LocalDate date);

    List<StudyPlan> findByUserIdAndDateBetweenOrderByDateAscStartTimeAsc(Long userId, LocalDate startDate, LocalDate endDate);

    List<StudyPlan> findByUserIdAndSubjectIdOrderByDateAscStartTimeAsc(Long userId, Long subjectId);

    long countByUserId(Long userId);

    long countBySubjectId(Long subjectId);

    long countBySubjectIdAndStatus(Long subjectId, PlanStatus status);

    long countByUserIdAndStatus(Long userId, PlanStatus status);

    long countByUserIdAndDate(Long userId, LocalDate date);

    long countByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    long countByUserIdAndStatusAndDateBetween(Long userId, PlanStatus status, LocalDate startDate, LocalDate endDate);

    @Query("SELECT sp FROM StudyPlan sp WHERE sp.user.id = :userId AND sp.date >= :startDate ORDER BY sp.date ASC, sp.startTime ASC")
    List<StudyPlan> findUpcomingSessions(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);
}
