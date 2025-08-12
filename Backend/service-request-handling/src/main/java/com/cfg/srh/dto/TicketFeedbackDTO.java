package com.cfg.srh.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TicketFeedbackDTO {
	private int feedbackId;
    private int ticketId;
    private String ticketTitle;
    private int employeeId;
    private String employeeName;
    private String feedbackText;
    private LocalDateTime givenAt;
}
