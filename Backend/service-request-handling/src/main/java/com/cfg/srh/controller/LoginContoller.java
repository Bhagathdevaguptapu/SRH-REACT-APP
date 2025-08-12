package com.cfg.srh.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cfg.srh.dto.LoginRequest;
import com.cfg.srh.entities.EmployeeEntity;
import com.cfg.srh.services.LoginService;

@Controller
@RestController
public class LoginContoller {

	@Autowired
	private LoginService loginservice;

	@PostMapping("/api/admin/login")
	public ResponseData adminLogin(@RequestBody LoginRequest loginRequest) {
		ResponseData response = new ResponseData();
		String result = loginservice.loginAdmin(loginRequest.getEmail(), loginRequest.getPassword());

		if ("Admin login successful".equalsIgnoreCase(result.trim())) {
			response.setStatus("success");
			response.setMessage(result);
		} else {
			response.setStatus("failed");
			response.setMessage(result);
		}

		return response;
	}

	@PostMapping("/api/employee/login")
	public ResponseData employeeLogin(@RequestBody LoginRequest loginRequest) {
		ResponseData response = new ResponseData();
		Optional<EmployeeEntity> empOpt = loginservice.getEmployeeByEmail(loginRequest.getEmail());

		if (empOpt.isPresent()) {
			EmployeeEntity emp = empOpt.get();
			if (emp.getPassword().equals(loginRequest.getPassword())) {
				response.setStatus("success");
				response.setMessage("Employee login successful");
				response.setId(emp.getEmployeeId());
			} else {
				response.setStatus("failed");
				response.setMessage("Incorrect password");
			}
		} else {
			response.setStatus("failed");
			response.setMessage("Employee not found in the database");
		}

		return response;
	}

	@PostMapping("/api/department/login")
	public ResponseData departmentLogin(@RequestBody LoginRequest loginRequest) {
		ResponseData response = new ResponseData();
		String result = loginservice.loginDepartment(loginRequest.getEmail(), loginRequest.getPassword());

		if ("Department login successful".equalsIgnoreCase(result.trim())) {
			response.setStatus("success");
			response.setMessage(result);
		} else {
			response.setStatus("failed");
			response.setMessage(result);
		}

		return response;
	}

}