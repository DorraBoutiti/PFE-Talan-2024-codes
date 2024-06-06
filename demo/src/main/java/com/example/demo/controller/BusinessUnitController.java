package com.example.demo.controller;

import com.example.demo.models.BusinessUnit;
import com.example.demo.service.BusinessUnitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequestMapping("/api/businessUnit")
@RestController
public class BusinessUnitController {

    private final BusinessUnitService businessUnitService;

    public BusinessUnitController(BusinessUnitService businessUnitService) {
        this.businessUnitService = businessUnitService;
    }

    @GetMapping("/")
    public ResponseEntity<List<BusinessUnit>> getBusinessUnits() {
        return ResponseEntity.ok(businessUnitService.getBusinessUnits());
    }

    @GetMapping("/{bu}")
    public ResponseEntity<BusinessUnit> getBusinessUnit(@PathVariable(name = "bu") String businessUnit) {
        return ResponseEntity.ok(businessUnitService.getBusinessUnit(businessUnit));
    }
}
