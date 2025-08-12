package com.cfg.srh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cfg.srh.dto.EmployeeDTO;
import com.cfg.srh.dto.FeedbackDTO;
import com.cfg.srh.dto.RaiseTicketDTO;
import com.cfg.srh.exceptions.FeedbackAlreadyGivenException;
import com.cfg.srh.exceptions.InvalidTicketException;
import com.cfg.srh.services.EmployeeService;

@RestController
@RequestMapping("/api")
public class EmployeeContoller {

	@Autowired
	private EmployeeService service;

	@PostMapping("emp/raiseTicket")
	public ResponseData raiseTicket(@RequestBody RaiseTicketDTO dto) {
		ResponseData response = new ResponseData();
		try {
			service.riseTicket(dto);
			response.setStatus("success");
			response.setMessage("Ticket raised successfully.");
		} catch (InvalidTicketException ex) {
			response.setStatus("failed");
			response.setMessage(ex.getMessage()); 
		}
		return response;
	}
   
	@GetMapping("emp/viewMyTickets/{id}")
	public ResponseData viewMyTickets(@PathVariable("id") int employeeId) {
	    ResponseData response = new ResponseData();
	    
	    // Fetch employee and enriched ticket data from service layer
	    EmployeeDTO employee = service.fetchEmployeeTicketsById(employeeId);

	    if (employee != null) {
	        response.setStatus("success");
	        response.setData(employee); // This now includes tickets with commentText, commenterName, commenterRole
	    } else {
	        response.setStatus("failed");
	        response.setMessage("No tickets found for the given employee.");
	    }

	    return response;
	}

	
	
	

	@PostMapping("emp/cancelMyTicket/{id}")
	public ResponseData cancelTicket(@PathVariable("id") int ticketId) {
	    ResponseData response = new ResponseData();
	    try {
	        service.cancelMyTicket(ticketId); // spelling fixed here too
	        response.setStatus("success");
	        response.setMessage("Ticket cancelled successfully.");
	    } catch (Exception e) {
	        response.setStatus("error");
	        response.setMessage("Failed to cancel ticket.");
	    }
	    return response;
	}
	
	
	@PostMapping("emp/giveFeedback")
	public ResponseData giveFeedback(@RequestBody FeedbackDTO feedback) {
	    ResponseData response = new ResponseData();
	    try {
	        service.giveFeedback(feedback.getTicketId(), feedback.getFeedbackText());
	        response.setStatus("success");
	        response.setMessage("Feedback submitted successfully.");
	    } catch (FeedbackAlreadyGivenException e) {
	        response.setStatus("failed");
	        response.setMessage("Feedback already submitted for this ticket.");
	    } catch (Exception e) {
	        response.setStatus("failed");
	        response.setMessage("Something went wrong while submitting feedback.");
	    }
	    return response;
	}
	
	
}
