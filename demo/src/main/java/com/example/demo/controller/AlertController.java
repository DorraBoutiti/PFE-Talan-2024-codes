package com.example.demo.controller;

import com.example.demo.models.Alert;
import com.example.demo.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequestMapping("/api/alert")
@RestController
public class AlertController {
    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Alert>> getAlerts() {
        return ResponseEntity.ok(alertService.getAlerts());
    }

    @GetMapping("/{bu}")
    public ResponseEntity<List<Alert>> getAlertsByBusinessUnit(@PathVariable(name = "bu") String businessUnit) {
        return ResponseEntity.ok(alertService.getAlertsByBusinessUnit(businessUnit));
    }

    @PostMapping("/new")
    public ResponseEntity<Alert> addAlert(@RequestBody Alert alert) {
        return ResponseEntity.ok(alertService.addAlert(alert));
    }

    @DeleteMapping("/delete/{alertId}")
    public void deleteAlert(@PathVariable(name = "alertId") Integer alertId) {
        alertService.deleteAlert(alertId);
    }
}