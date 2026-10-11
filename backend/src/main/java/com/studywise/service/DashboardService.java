package com.studywise.service;

import com.studywise.dto.response.DashboardStatsResponse;
import com.studywise.dto.response.StudyPlanResponse;
import com.studywise.entity.PlanStatus;
import com.studywise.entity.StudyPlan;
import com.studywise.entity.User;
import com.studywise.repository.StudyPlanRepository;
import com.studywise.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service aggregating student progress metrics, study streak, and dashboard overviews.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final SubjectRepository subjectRepository;
    private final StudyPlanRepository studyPlanRepository;
    private final StudyPlanService studyPlanService;
    private final AuthService authService;

    /**
     * Calculates comprehensive dashboard statistics for the logged-in student.
     *
     * @return DashboardStatsResponse containing totals, progress rate, and upcoming sessions
     */
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Long userId = currentUser.getId();
        LocalDate today = LocalDate.now();

        // Total subjects
        long totalSubjects = subjectRepository.countByUserId(userId);

        // Today's tasks
        List<StudyPlan> todayPlans = studyPlanRepository.findByUserIdAndDateOrderByStartTimeAsc(userId, today);
        List<StudyPlanResponse> todayResponses = todayPlans.stream()
                .map(studyPlanService::mapToStudyPlanResponse)
                .collect(Collectors.toList());

        // Status counts across all plans
        long pendingCount = studyPlanRepository.countByUserIdAndStatus(userId, PlanStatus.PENDING);
        long inProgressCount = studyPlanRepository.countByUserIdAndStatus(userId, PlanStatus.IN_PROGRESS);
        long completedCount = studyPlanRepository.countByUserIdAndStatus(userId, PlanStatus.COMPLETED);

        // Weekly range calculations (Monday to Sunday)
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        long weeklyTotal = studyPlanRepository.countByUserIdAndDateBetween(userId, startOfWeek, endOfWeek);
        long weeklyCompleted = studyPlanRepository.countByUserIdAndStatusAndDateBetween(userId, PlanStatus.COMPLETED, startOfWeek, endOfWeek);

        double weeklyRate = 0.0;
        if (weeklyTotal > 0) {
            weeklyRate = Math.round((((double) weeklyCompleted / weeklyTotal) * 100.0) * 10.0) / 10.0;
        }

        // Upcoming sessions (next 5)
        List<StudyPlan> upcomingPlans = studyPlanRepository.findUpcomingSessions(userId, today);
        List<StudyPlanResponse> upcomingResponses = upcomingPlans.stream()
                .limit(6)
                .map(studyPlanService::mapToStudyPlanResponse)
                .collect(Collectors.toList());

        // Calculate dynamic study streak
        int streakDays = calculateStudyStreak(userId, today);

        return DashboardStatsResponse.builder()
                .userName(currentUser.getName())
                .totalSubjects(totalSubjects)
                .todayTasksCount(todayResponses.size())
                .pendingTasksCount(pendingCount)
                .inProgressTasksCount(inProgressCount)
                .completedTasksCount(completedCount)
                .studyStreakDays(streakDays)
                .weeklyCompletionRate(weeklyRate)
                .weeklyTotalTasks(weeklyTotal)
                .weeklyCompletedTasks(weeklyCompleted)
                .todayTasks(todayResponses)
                .upcomingSessions(upcomingResponses)
                .build();
    }

    /**
     * Calculates consecutive days student completed at least one study task.
     */
    private int calculateStudyStreak(Long userId, LocalDate today) {
        int streak = 0;
        LocalDate checkDate = today;

        // Check if user has completed any tasks today
        long todayCompleted = studyPlanRepository.countByUserIdAndStatusAndDateBetween(
                userId, PlanStatus.COMPLETED, today, today);

        if (todayCompleted > 0) {
            streak++;
            checkDate = today.minusDays(1);
        } else {
            // Check yesterday to not break streak if today is just starting
            checkDate = today.minusDays(1);
        }

        // Look back up to 30 days
        for (int i = 0; i < 30; i++) {
            long count = studyPlanRepository.countByUserIdAndStatusAndDateBetween(
                    userId, PlanStatus.COMPLETED, checkDate, checkDate);
            if (count > 0) {
                streak++;
                checkDate = checkDate.minusDays(1);
            } else {
                break;
            }
        }

        // Return minimum 1 if user has completed plans overall to encourage students, or actual streak
        return Math.max(streak, (studyPlanRepository.countByUserIdAndStatus(userId, PlanStatus.COMPLETED) > 0 ? 1 : 0));
    }
}
