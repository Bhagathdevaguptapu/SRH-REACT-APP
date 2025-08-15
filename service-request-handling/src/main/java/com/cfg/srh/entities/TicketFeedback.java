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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(schema = "srh", name = "ticketfeedback")
public class TicketFeedback {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer feedbackId;
	@OneToOne
	@JoinColumn(name = "ticketId")
	@JsonBackReference
	private Ticket ticket;
	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JoinColumn(name = "employee_id",referencedColumnName = "employeeId")
	@JsonBackReference
	private EmployeeEntity employee;
	private String feedbackText;
	private Timestamp givenAt;
}
