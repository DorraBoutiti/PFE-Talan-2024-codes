package com.hracces.openhr.repositories;

import com.hracces.openhr.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepo extends JpaRepository<Employee, Long> {


}
