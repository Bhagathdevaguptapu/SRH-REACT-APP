package com.cfg.srh.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(schema = "srh", name = "department")
public class Department {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer departmentId;
	
	private String email;

	private String name; // IT, NON_IT, HR_FINANCE
	
	private String password;

	@OneToMany(mappedBy = "assignedToDepartment")
	@JsonManagedReference
	private List<Ticket> assignedTickets;
}
