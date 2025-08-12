package com.cfg.srh.services;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cfg.srh.constants.TicketStatusConstants;
import com.cfg.srh.dto.CloseTicketDTO;
import com.cfg.srh.dto.CommentDTO;
import com.cfg.srh.dto.UpdateStatusDTO;
import com.cfg.srh.entities.Department;
import com.cfg.srh.entities.Ticket;
import com.cfg.srh.entities.TicketComment;
import com.cfg.srh.entities.TicketStatusHistory;
import com.cfg.srh.exceptions.InvalidStatusException;
import com.cfg.srh.repository.DepartmentRepository;
import com.cfg.srh.repository.TicketCommentRepository;
import com.cfg.srh.repository.TicketRepository;
import com.cfg.srh.repository.TicketStatusHistoryRepository;

@Service	
public class DepartmentService {
	
	@Autowired
	private DepartmentRepository departmentRepository;
	
	@Autowired
	private TicketRepository ticketRepository;
	
	@Autowired
	private TicketCommentRepository commentRepo;
	
	@Autowired
	private TicketStatusHistoryRepository statusHistoryRepo;


	public List<Ticket> viewAssignedTicketsByID(Integer departmentId) {
        Optional<Department> dept = departmentRepository.findById(departmentId);
        return dept.map(Department::getAssignedTickets).orElse(null);
    }

    public String acceptTicketByID(Integer ticketId) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            ticket.setStatus(TicketStatusConstants.STARTED);
            ticket.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            ticketRepository.save(ticket);
            saveStatusHistory(ticket, TicketStatusConstants.STARTED, "Department");
            return "Ticket accepted and marked as STARTED";
        }
        return "Ticket not found";
    }

    public String updateTicketStatus(UpdateStatusDTO dto) throws InvalidStatusException {
        if (dto.getStatus() == null || dto.getStatus().trim().isEmpty()) {
            throw new InvalidStatusException("Status cannot be null or empty.");
        }

        Optional<Ticket> ticketOpt = ticketRepository.findById(dto.getTicketId());
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            ticket.setStatus(dto.getStatus());
            ticket.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            ticketRepository.save(ticket);

            saveStatusHistory(ticket, dto.getStatus(), "Department");
            return "Status updated to " + dto.getStatus();
        }

        return "Ticket not found";
    }


    public String addComment(CommentDTO dto) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(dto.getTicketId());
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();

            TicketComment comment = new TicketComment();
            comment.setTicket(ticket);
            comment.setCommentText(dto.getCommentText());
            comment.setCommenterName(dto.getCommenterName());
            comment.setCommenterRole("DEPARTMENT");
            if (ticket.getComments() == null) {
                ticket.setComments(new ArrayList<>());
            }
            ticket.getComments().add(comment); 

            commentRepo.save(comment);
            
            return "Comment added successfully";
        }
        return "Ticket not found";
    }

    public String closeTicket(CloseTicketDTO dto) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(dto.getTicketId());
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            ticket.setStatus(TicketStatusConstants.CLOSED);
            ticket.setCloseReason(dto.getReason());
            ticket.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            ticketRepository.save(ticket);
            saveStatusHistory(ticket, TicketStatusConstants.CLOSED, "Department");
            return "Ticket closed successfully";
        }
        return "Ticket not found";
    }

	private void saveStatusHistory(Ticket ticket, String status, String updatedBy) {
	    TicketStatusHistory history = new TicketStatusHistory();
	    history.setTicket(ticket);
	    history.setStatus(status);
	    history.setUpdatedBy(updatedBy);
	    history.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
	    statusHistoryRepo.save(history);
	}
	
}