package com.cfg.srh.dto;

import java.util.List;

import lombok.Data;
@Data
public class EmployeeDtoo {
	private Integer employeeId;
	private String name;
	private String email;
	private String password;
	private List<TicketSummaryDTO> tickets;

}
