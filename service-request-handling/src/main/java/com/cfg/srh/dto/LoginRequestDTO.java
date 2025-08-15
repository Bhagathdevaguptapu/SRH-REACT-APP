package com.cfg.srh.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
	private String email;
	private String password;

	public LoginRequestDTO() {
	}

	public LoginRequestDTO(String email, String password) {
		this.email = email;
		this.password = password;
	}

}