package com.studywise.dto.request;

import com.studywise.entity.PlanStatus;
import com.studywise.entity.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * DTO for creating or updating a study plan/task.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyPlanRequest {

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotBlank(message = "Topic is required")
    private String topic;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private Priority priority;

    private PlanStatus status;

    private String notes;
}
