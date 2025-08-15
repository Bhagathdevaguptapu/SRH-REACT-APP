package com.cfg.srh.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cfg.srh.dto.AssignTicketRequest;
import com.cfg.srh.dto.CancelTicketRequestDTO;
import com.cfg.srh.dto.EmployeeDtoo;
import com.cfg.srh.exceptions.InvalidDepartmentException;
import com.cfg.srh.services.AdminService;

@Controller
@RestController
public class AdminController {

	@GetMapping("/")
	public String welcome() {
		return "index";
	}


	@Autowired
	private AdminService adminservice;

	

	@GetMapping("/api/admin/employee/tickets/{id}")
	public ResponseData getEmployeeTickets(@PathVariable int id) {
		ResponseData response = new ResponseData();
		EmployeeDtoo dto = adminservice.fetchEmployeeTicketsById(id);

		if (dto != null) {
			response.setStatus("success");
			response.setData(dto);
		} else {
			response.setStatus("failed");
			response.setMessage("Employee not found or no tickets available.");
		}
		return response;
	}

	@GetMapping("/api/admin/employees/tickets")
	public ResponseData getAllEmployeeTickets() {
		ResponseData response = new ResponseData();
		List<EmployeeDtoo> list = adminservice.fetchAllEmployeeTickets();

		if (list != null && !list.isEmpty()) {
			response.setStatus("success");
			response.setData(list);
		} else {
			response.setStatus("failed");
			response.setMessage("No employee ticket records found.");
		}

		return response;
	}

	@PostMapping("/api/admin/ticket/cancel")
	public ResponseData cancelTicket(@RequestBody CancelTicketRequestDTO ticketRequest) {
		ResponseData response = new ResponseData();
		adminservice.cancelTicketById(ticketRequest.getTicketId(), ticketRequest.getCancelReason());
		response.setStatus("success");
		response.setMessage("Ticket with ID " + ticketRequest.getTicketId() + " has been cancelled.");
		return response;
	}

	@PostMapping("/api/admin/assign-ticket")
	public ResponseData assignTicketToDepartment(@RequestBody AssignTicketRequest request) {
		ResponseData response = new ResponseData();
		try {
			String result = adminservice.assignTicketToDepartment(request.getTicketId(), request.getDepartmentId());
			response.setStatus("success");
			response.setMessage(result);
		} catch (InvalidDepartmentException e) {
			response.setStatus("failed");
			response.setMessage(e.getMessage());
		}
		return response;
	}

}
