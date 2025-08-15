package com.cfg.srh.services;

import lombok.Data;

@Data
public class DepartmentBO {
	
	private int departmentID;
	
	private String departmentName;
	
    private String email;
    private String password;
}