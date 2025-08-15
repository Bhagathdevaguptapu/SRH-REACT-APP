package com.cfg.srh.dto;

import lombok.Data;

@Data
public class CancelTicketRequestDTO {
	private Integer ticketId;
    private String cancelReason;

}