package com.cfg.srh.dto;

import java.util.List;

import com.cfg.srh.entities.Ticket;

import lombok.Data;

@Data
public class DepartmentDTO {
	private Integer departmentId;
    private String name;
    private String email;
    private String password;
    private List<Ticket> assignedTickets;

}
