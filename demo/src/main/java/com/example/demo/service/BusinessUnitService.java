package com.example.demo.service;

import com.example.demo.models.BusinessUnit;
import com.example.demo.models.Comment;
import com.example.demo.repository.BusinessUnitRepository;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class BusinessUnitService {
    private final BusinessUnitRepository businessUnitRepository;

    public BusinessUnitService(BusinessUnitRepository businessUnitRepository) {
        this.businessUnitRepository = businessUnitRepository;
    }
    public List<BusinessUnit> getBusinessUnits() {
        return businessUnitRepository.findAll();
    }

    public BusinessUnit getBusinessUnit(String bu) {
        return businessUnitRepository.findBusinessUnitByBusinessUnit(bu);
    }
}
