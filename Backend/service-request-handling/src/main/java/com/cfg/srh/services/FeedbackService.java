package com.cfg.srh.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cfg.srh.dto.TicketFeedbackDTO;
import com.cfg.srh.entities.TicketFeedback;
import com.cfg.srh.repository.TicketFeedbackRepository;

import jakarta.transaction.Transactional;

@Service
public class FeedbackService {
	@Autowired
    private TicketFeedbackRepository feedbackRepo;

	@Transactional
	public List<TicketFeedbackDTO> getAllFeedbacks() {
	    List<TicketFeedback> feedbacks = feedbackRepo.findAllWithRelations();
	    return feedbacks.stream().map(fb -> {
	        TicketFeedbackDTO dto = new TicketFeedbackDTO();
	        dto.setFeedbackId(fb.getFeedbackId());
	        dto.setFeedbackText(fb.getFeedbackText());

	        if (fb.getTicket() != null) {
	            dto.setTicketId(fb.getTicket().getTicketId());
	            dto.setTicketTitle(fb.getTicket().getTitle()); // Assuming getTitle() exists
	        }

	        if (fb.getEmployee() != null) {
	            dto.setEmployeeId(fb.getEmployee().getEmployeeId());
	            dto.setEmployeeName(fb.getEmployee().getName()); // Assuming getName() exists
	        }

	        return dto;
	    }).collect(Collectors.toList());
	}


}
