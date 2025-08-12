package com.cfg.srh.dto;

import java.util.List;

import lombok.Data;

@Data
public class EmployeeDTO {
	private Integer employeeId;
	private String name;
	private String email;
	private String password;
	List<TicketDTO> tickets;
}
