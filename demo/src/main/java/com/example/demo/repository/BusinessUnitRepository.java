package com.example.demo.repository;

import com.example.demo.models.BusinessUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessUnitRepository extends JpaRepository<BusinessUnit, Integer> {
    BusinessUnit findBusinessUnitByBusinessUnit(String businessUnit);
}
