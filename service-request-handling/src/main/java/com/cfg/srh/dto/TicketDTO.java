package com.cfg.srh.dto;

import lombok.Data;

@Data
public class TicketDTO {
	private int ticketId;
	private String title;
	private String description;
	private String status;

	private String commentText;
	private String commenterName;
	private String commenterRole;

	public TicketDTO(int ticketId, String title, String description, String status, String commentText,
			String commenterName, String commenterRole) {
		this.ticketId = ticketId;
		this.title = title;
		this.description = description;
		this.status = status;
		this.commentText = commentText;
		this.commenterName = commenterName;
		this.commenterRole = commenterRole;
	}
}