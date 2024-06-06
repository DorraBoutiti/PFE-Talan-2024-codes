package com.example.demo.repository;

import com.example.demo.models.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Integer> {
    List<Alert> findAlertsByBusinessUnit_BusinessUnit(String BusinessUnit);
}
