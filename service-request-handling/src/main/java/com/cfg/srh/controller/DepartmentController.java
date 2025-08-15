package com.cfg.srh.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cfg.srh.dto.CloseTicketDTO;
import com.cfg.srh.dto.CommentDTO;
import com.cfg.srh.dto.UpdateStatusDTO;
import com.cfg.srh.entities.Ticket;
import com.cfg.srh.exceptions.InvalidStatusException;
import com.cfg.srh.services.DepartmentService;

@RestController
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping("/api/department/tickets/{departmentId}")
    public ResponseData viewAssignedTickets(@PathVariable("departmentId") Integer departmentId) {
        ResponseData response = new ResponseData();
        List<Ticket> tickets = departmentService.viewAssignedTicketsByID(departmentId);
        if (tickets != null && !tickets.isEmpty()) {
            response.setStatus("success");
            response.setData(tickets);
        } else {
            response.setStatus("failed");
            response.setMessage("No tickets found for the department");
        }
        return response;
    }

    @PutMapping("/api/department/ticket/accept/{ticketId}")
    public ResponseData acceptTicket(@PathVariable("ticketId") Integer ticketId) {
        ResponseData response = new ResponseData();
        String result = departmentService.acceptTicketByID(ticketId);
        response.setStatus("success");
        response.setMessage(result);
        return response;
    }

    @PutMapping("/api/department/ticket/status")
    public ResponseData updateTicketStatus(@RequestBody UpdateStatusDTO dto) {
        ResponseData response = new ResponseData();
        try {
            String result = departmentService.updateTicketStatus(dto);
            response.setStatus("success");
            response.setMessage(result);
        } catch (InvalidStatusException e) {
            response.setStatus("failed");
            response.setMessage(e.getMessage());
        }
        return response;
    }


    @PostMapping("/api/department/ticket/comment")
    public ResponseData addComment(@RequestBody CommentDTO dto) {
        ResponseData response = new ResponseData();
        String result = departmentService.addComment(dto);
        response.setStatus("success");
        response.setMessage(result);
        return response;
    }

    @PutMapping("/api/department/ticket/close")
    public ResponseData closeTicket(@RequestBody CloseTicketDTO dto) {
        ResponseData response = new ResponseData();
        String result = departmentService.closeTicket(dto);
        response.setStatus("success");
        response.setMessage(result);
        return response;
    }
}
