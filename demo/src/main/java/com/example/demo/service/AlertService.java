package com.example.demo.service;

import com.example.demo.models.*;
import com.example.demo.repository.AlertRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class AlertService {
    private final AlertRepository alertRepository;
    private final UserRepository userRepository;

    public AlertService(AlertRepository alertRepository, UserRepository userRepository) {
        this.alertRepository = alertRepository;
        this.userRepository = userRepository;
    }

    public Alert addAlert(Alert alert) {
        User user = userRepository.findById(alert.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        alert.setDate(new Date());
        alert.setUser(user);

        if (user.getRole() == Role.MANAGER) {
            if (user.getBusinessUnit().equals(alert.getBusinessUnit())) {
                return alertRepository.save(alert);
            } else {
                throw new IllegalArgumentException("Vous n'êtes pas autorisés à créer des règles pour des unités organisationnelles autres que la vôtre.");
            }
        } else if (user.getRole() == Role.HR_DIRECTOR) {
            return alertRepository.save(alert);
        } else {
            throw new UnsupportedOperationException("Unsupported role for adding an alert.");
        }
    }

    public List<Alert> getAlerts() {
        return alertRepository.findAll();
    }

    public List<Alert> getAlertsByBusinessUnit(String businessUnit) {
        return alertRepository.findAlertsByBusinessUnit_BusinessUnit(businessUnit);
    }

    public void deleteAlert(Integer alertId) {
        alertRepository.deleteById(alertId);
    }
}
