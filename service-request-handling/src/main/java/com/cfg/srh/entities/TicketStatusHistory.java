package com.cfg.srh.entities;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data

@Table(schema = "srh", name = "ticketStatusHistory")
public class TicketStatusHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer historyId;

	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JoinColumn(name = "ticketId",referencedColumnName = "ticketId")
	@JsonBackReference
	private Ticket ticket;

	private String status; // RAISED, ASSIGNED, etc.
	private String updatedBy;

	private Timestamp updatedAt;
}
