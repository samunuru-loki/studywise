package com.studywise.dto.response;

import com.studywise.entity.PlanStatus;
import com.studywise.entity.Priority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Response DTO for study plans and scheduled tasks.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyPlanResponse {

    private Long id;
    private Long subjectId;
    private String subjectName;
    private String subjectColor;
    private String topic;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Priority priority;
    private PlanStatus status;
    private String notes;
    private LocalDateTime createdAt;
}
