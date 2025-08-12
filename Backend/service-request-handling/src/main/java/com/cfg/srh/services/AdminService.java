package com.cfg.srh.services;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cfg.srh.dto.EmployeeDtoo;
import com.cfg.srh.dto.TicketSummaryDTO;
import com.cfg.srh.entities.Department;
import com.cfg.srh.entities.EmployeeEntity;
import com.cfg.srh.entities.Ticket;
import com.cfg.srh.exceptions.InvalidDepartmentException;
import com.cfg.srh.repository.DepartmentRepository;
import com.cfg.srh.repository.EmployeeRepository;
import com.cfg.srh.repository.TicketRepository;

@Service
public class AdminService {

	@Autowired
	public TicketRepository ticketrepo;

	@Autowired
	public DepartmentRepository departmentrepo;

	@Autowired
	public EmployeeRepository employeeRepo;
	

	
	
	public EmployeeDtoo fetchEmployeeTicketsById(int id) {
	    Optional<EmployeeEntity> entityopt = employeeRepo.findById(id);
	    if (entityopt.isPresent()) {
	        EmployeeEntity e = entityopt.get();
	        EmployeeDtoo emp = new EmployeeDtoo();
	        emp.setEmployeeId(e.getEmployeeId());
	        emp.setName(e.getName());
	        emp.setEmail(e.getEmail());

	        List<TicketSummaryDTO> ticketDtos = e.getTickets().stream().map(t -> {
	            TicketSummaryDTO tDto = new TicketSummaryDTO();
	            tDto.setTicketId(t.getTicketId());
	            tDto.setTitle(t.getTitle());
	            tDto.setDescription(t.getDescription());
	            tDto.setCreatedAt(t.getCreatedAt());
	            
	            if (t.getAssignedToDepartment() != null) {
	                tDto.setAssignedToDepartment(t.getAssignedToDepartment().getDepartmentId());
	                tDto.setAssignedToDepartmentName(t.getAssignedToDepartment().getName());
	            }

	            tDto.setStatus(t.getStatus());
	            tDto.setUpdatedAt(t.getUpdatedAt());
	            tDto.setCancelReason(t.getCancelReason());
	            tDto.setCloseReason(t.getCloseReason());
	            return tDto;
	        }).collect(Collectors.toList());

	        emp.setTickets(ticketDtos);
	        return emp;
	    } else {
	        return null;
	    }
	}

	
	public List<EmployeeDtoo> fetchAllEmployeeTickets() {
	    List<EmployeeEntity> empEntities = employeeRepo.findAll();
	    return empEntities.stream().map(e -> {
	    	EmployeeDtoo empDto = new EmployeeDtoo();
	        empDto.setEmployeeId(e.getEmployeeId());
	        empDto.setName(e.getName());
	        empDto.setEmail(e.getEmail());

	        List<TicketSummaryDTO> ticketDtos = e.getTickets().stream().map(t -> {
	            TicketSummaryDTO tDto = new TicketSummaryDTO();
	            tDto.setTicketId(t.getTicketId());
	            tDto.setTitle(t.getTitle());
	            tDto.setDescription(t.getDescription());
	            tDto.setCreatedAt(t.getCreatedAt());
	            if (t.getAssignedToDepartment() != null) {
	                tDto.setAssignedToDepartment(t.getAssignedToDepartment().getDepartmentId());
	                tDto.setAssignedToDepartmentName(t.getAssignedToDepartment().getName());
	            }
	            tDto.setStatus(t.getStatus());
	            tDto.setUpdatedAt(t.getUpdatedAt());
	            tDto.setCancelReason(t.getCancelReason());
	            tDto.setCloseReason(t.getCloseReason());
	            return tDto;
	        }).collect(Collectors.toList());

	        empDto.setTickets(ticketDtos);

	        return empDto;
	    }).collect(Collectors.toList());
	}


	public void cancelTicketById(Integer ticketId, String cancelReason) {
		Optional<Ticket> ticketOpt = ticketrepo.findById(ticketId);
		if (ticketOpt.isEmpty()) {
			throw new RuntimeException("Ticket not found with id: " + ticketId);
		}
		Ticket ticket = ticketOpt.get();
		ticket.setStatus("CANCELLED"); 
		ticket.setCancelReason(cancelReason);
		ticketrepo.save(ticket);
	}

	public String assignTicketToDepartment(int ticketId, int departmentId) throws InvalidDepartmentException {
	    Optional<Ticket> ticketOpt = ticketrepo.findById(ticketId);
	    Optional<Department> departmentOpt = departmentrepo.findById(departmentId);

	    if (!ticketOpt.isPresent()) {
	        throw new InvalidDepartmentException("Ticket with ID " + ticketId + " not found.");
	    }

	    if (!departmentOpt.isPresent()) {
	        throw new InvalidDepartmentException("Department with ID " + departmentId + " not found.");
	    }

	    Ticket ticket = ticketOpt.get();
	    Department department = departmentOpt.get();

	    ticket.setAssignedToDepartment(department);
	    ticket.setStatus("ASSIGNED");
	    ticket.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

	    ticketrepo.save(ticket);

	    return "Ticket ID " + ticketId + " successfully assigned to Department ID " + departmentId;
	}

}
