package com.studywise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Aggregated analytics and summary stats for the student dashboard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private String userName;
    private long totalSubjects;
    private long todayTasksCount;
    private long pendingTasksCount;
    private long inProgressTasksCount;
    private long completedTasksCount;
    private int studyStreakDays;
    private double weeklyCompletionRate;
    private long weeklyTotalTasks;
    private long weeklyCompletedTasks;
    private List<StudyPlanResponse> todayTasks;
    private List<StudyPlanResponse> upcomingSessions;
}
