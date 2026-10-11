package com.studywise.dto.request;

import com.studywise.entity.PlanStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for quick status updates of study plans (e.g. checkbox click).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private PlanStatus status;
}
