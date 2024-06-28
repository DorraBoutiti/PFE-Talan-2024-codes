package com.hracces.openhr.controllers;

import com.hracces.openhr.services.EmployeeService;
import com.hraccess.openhr.exception.AuthenticationException;
import com.hraccess.openhr.exception.SessionBuildException;
import com.hraccess.openhr.exception.SessionConnectionException;
import com.hraccess.openhr.exception.UserConnectionException;
import com.hraccess.openhr.msg.HRResultExtractData;
import org.apache.commons.configuration.ConfigurationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("si")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;
    @GetMapping("/zy")
    public HRResultExtractData executeQuery() throws UserConnectionException, ConfigurationException, AuthenticationException, SessionBuildException, SessionConnectionException {
      return  employeeService.executeQuery();

    }

    }
