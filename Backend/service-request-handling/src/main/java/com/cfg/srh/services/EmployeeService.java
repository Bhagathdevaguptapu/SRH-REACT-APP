package com.cfg.srh.services;

import java.sql.Timestamp;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cfg.srh.dto.EmployeeDTO;
import com.cfg.srh.dto.RaiseTicketDTO;
import com.cfg.srh.dto.TicketDTO;
import com.cfg.srh.entities.EmployeeEntity;
import com.cfg.srh.entities.Ticket;
import com.cfg.srh.entities.TicketComment;
import com.cfg.srh.entities.TicketFeedback;
import com.cfg.srh.exceptions.FeedbackAlreadyGivenException;
import com.cfg.srh.exceptions.InvalidTicketException;
import com.cfg.srh.repository.EmployeeRepository;
import com.cfg.srh.repository.TicketFeedbackRepository;
import com.cfg.srh.repository.TicketRepository;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private TicketRepository ticketRepo;

    @Autowired
    private TicketFeedbackRepository feedbackRepo;

    public void riseTicket(RaiseTicketDTO dto) throws InvalidTicketException {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new InvalidTicketException("Title can't be null");
        }

        Optional<EmployeeEntity> empOpt = employeeRepo.findById(dto.getEmployeeId());
        if (empOpt.isPresent()) {
            Ticket ticket = new Ticket();
            ticket.setTitle(dto.getTitle());
            ticket.setDescription(dto.getDescription());
            ticket.setStatus("RAISED");
            ticket.setCreatedBy(empOpt.get());
            ticket.setCreatedAt(new Timestamp(System.currentTimeMillis()));

            ticketRepo.save(ticket);
        }
    }

    public EmployeeDTO fetchEmployeeTicketsById(int id) {
        Optional<EmployeeEntity> entityOpt = employeeRepo.findById(id);
        if (entityOpt.isPresent()) {
            EmployeeEntity e = entityOpt.get();

            EmployeeDTO emp = new EmployeeDTO();
            emp.setEmployeeId(e.getEmployeeId());
            emp.setEmail(e.getEmail());
            emp.setName(e.getName());

            List<TicketDTO> ticketDTOs = e.getTickets().stream().map(ticket -> {
                // Get the first comment (if any)
                TicketComment comment = (ticket.getComments() != null && !ticket.getComments().isEmpty())
                        ? ticket.getComments().get(0)
                        : null;

                String commentText = comment != null ? comment.getCommentText() : null;
                String commenterName = comment != null ? comment.getCommenterName() : null;
                String commenterRole = comment != null ? comment.getCommenterRole() : null;

                return new TicketDTO(
                    ticket.getTicketId(),
                    ticket.getTitle(),
                    ticket.getDescription(),
                    ticket.getStatus(),
                    commentText,
                    commenterName,
                    commenterRole
                );
            }).collect(Collectors.toList());

            emp.setTickets(ticketDTOs);
            return emp;
        } else {
            return null;
        }
    }

    public void cancelMyTicket(int ticketId) {
        Optional<Ticket> ticketOpt = ticketRepo.findById(ticketId);
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            ticket.setStatus("Cancelled");
            ticketRepo.save(ticket);
        }
    }

    public void giveFeedback(int ticketId, String feedbackText) throws FeedbackAlreadyGivenException {
        Optional<Ticket> ticketOpt = ticketRepo.findById(ticketId);
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();

            if (ticket.getFeedback() != null) {
                throw new FeedbackAlreadyGivenException("Feedback already given for this ticket.");
            }

            TicketFeedback feedback = new TicketFeedback();
            feedback.setTicket(ticket);
            feedback.setEmployee(ticket.getCreatedBy());
            feedback.setFeedbackText(feedbackText);
            feedback.setGivenAt(new Timestamp(System.currentTimeMillis()));

            feedbackRepo.save(feedback);

            ticket.setFeedback(feedback);
            ticketRepo.save(ticket);
        } else {
            throw new RuntimeException("Ticket not found with ID: " + ticketId);
        }
    }
}
