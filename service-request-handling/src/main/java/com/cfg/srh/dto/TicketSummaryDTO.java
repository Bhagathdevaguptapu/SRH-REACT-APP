package com.cfg.srh.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class TicketSummaryDTO {
    private Integer ticketId;
    private String title;
    private String description;
    private Timestamp createdAt;
    private Integer assignedToDepartment;
    private String assignedToDepartmentName; // 👈 add this
    private String status;
    private Timestamp updatedAt;
    private String cancelReason;
    private String closeReason;
}
