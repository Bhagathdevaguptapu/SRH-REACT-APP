package com.cfg.srh.dto;



import lombok.Data;

@Data
public class RaiseTicketDTO {
    private String title;
    private String description;
    private int employeeId;
}
