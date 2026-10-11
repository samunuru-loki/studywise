package com.studywise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for subject details with associated task and note counts.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectResponse {

    private Long id;
    private String name;
    private String description;
    private String color;
    private long totalPlans;
    private long completedPlans;
    private long totalNotes;
    private LocalDateTime createdAt;
}
