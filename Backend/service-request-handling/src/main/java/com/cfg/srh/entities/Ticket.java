package com.cfg.srh.entities;

import java.sql.Timestamp;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(schema = "srh", name = "ticket")
public class Ticket {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer ticketId;

	@ManyToOne
	@JoinColumn(name = "adminid")
	@JsonBackReference
	private AdminEntity adminid;

	
	private String title;
	private String description;

	private String status; // RAISED, ASSIGNED, STARTED, etc.

	private String cancelReason;
	private String closeReason;

	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JoinColumn(name = "createdBy", referencedColumnName = "employeeId")
	@JsonBackReference
	private EmployeeEntity createdBy;

	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JoinColumn(name = "assignedToDepartment",referencedColumnName = "departmentId")
	@JsonBackReference
	private Department assignedToDepartment;

	private Timestamp createdAt;
	private Timestamp updatedAt;
	
	@OneToMany(mappedBy = "ticket", fetch = FetchType.EAGER)
	@JsonManagedReference
	private List<TicketComment> comments;


	@OneToMany(mappedBy = "ticket")
	@JsonBackReference
	private List<TicketStatusHistory> statusHistory;

	@OneToOne(mappedBy = "ticket")
	@JsonBackReference
	private TicketFeedback feedback;
}

