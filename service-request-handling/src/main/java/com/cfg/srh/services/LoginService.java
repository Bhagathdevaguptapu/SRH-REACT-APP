package com.cfg.srh.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cfg.srh.entities.AdminEntity;
import com.cfg.srh.entities.Department;
import com.cfg.srh.entities.EmployeeEntity;
import com.cfg.srh.repository.AdminRepository;
import com.cfg.srh.repository.DepartmentRepository;
import com.cfg.srh.repository.EmployeeRepository;

@Service
public class LoginService {

 @Autowired
 private AdminRepository adminRepo;

 @Autowired
 private EmployeeRepository employeeRepo;
 
 @Autowired
 private DepartmentRepository departmentRepo;

 public String loginAdmin(String email, String password) {
        Optional<AdminEntity> adminOpt = adminRepo.findByEmail(email);

        if (adminOpt.isPresent()) {
            AdminEntity admin = adminOpt.get();
            if (admin.getEmail().equalsIgnoreCase(email) && admin.getPassword().equals(password)) {
                return "Admin login successful";
            } else {
                return "Admin login failed: Incorrect password";
            }
        } else {
            return "Admin not found in the database";
        }
    }


 public String employeeLogin(String email, String password) {
        Optional<EmployeeEntity> empOpt = employeeRepo.findByEmail(email);

        if (empOpt.isPresent()) {
            EmployeeEntity emp = empOpt.get();
            if (emp.getPassword().equals(password)) {
                return "Employee login successful";
            } else {
                return "Employee login failed: Incorrect password";
            }
        } else {
            return "Employee not found in the database";
        }
    }
 
 public Optional<EmployeeEntity> getEmployeeByEmail(String email) {
        return employeeRepo.findByEmail(email);
    }
  
  
  public String loginDepartment(String email, String password) {
      Optional<Department> deptOpt = departmentRepo.findByEmail(email);

      if (deptOpt.isPresent()) {
          Department dept = deptOpt.get();
          if (dept.getEmail().equalsIgnoreCase(email) && dept.getPassword().equals(password)) {
              return "Department login successful";
          } else {
              return "Department login failed: Incorrect password";
          }
      } else {
          return "Department not found in the database";
      }
  }

}