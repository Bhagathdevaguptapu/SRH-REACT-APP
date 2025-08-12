package com.cfg.srh.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cfg.srh.dto.TicketFeedbackDTO;
import com.cfg.srh.services.FeedbackService;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/feedbacks")
    public ResponseData getAllFeedbacks() {
        ResponseData response = new ResponseData();
        try {
            List<TicketFeedbackDTO> feedbackList = feedbackService.getAllFeedbacks();
            if (feedbackList != null && !feedbackList.isEmpty()) {
                response.setStatus("success");
                response.setData(feedbackList);
            } else {
                response.setStatus("failed");
                response.setMessage("No feedbacks available.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus("error");
            response.setMessage("Server exception: " + e.getMessage());
        }
        return response;
    }
}