package com.example.demo.service;

import com.example.demo.models.Employee;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeByRegistrationNumber(String registrationNumber) {
        return employeeRepository.findEmployeeByRegistrationNumber(registrationNumber);
    }

    public Employee getEmployeeById(Integer id) {
        return employeeRepository.findEmployeeById(id);
    }

    // ### Poste

    public Integer countEmployeeByPoste(String poste) {
        return employeeRepository.countEmployeeByPoste(poste);
    }

    // Note globale par poste

    public Integer getMinPerformanceByPoste(String post) {
        return employeeRepository.findMinPerformanceByPost(post);
    }

    public Integer getMaxPerformanceByPoste(String post) {
        return employeeRepository.findMaxPerformanceByPost(post);
    }

    public Double getMedianPerformanceByPost(String post) {
        List<Double> notes = employeeRepository.findPerformanceByPostOrdered(post);
        return calculateMedian(notes);
    }

    public Double getFirstQuartilePerformanceByPost(String post) {
        List<Double> notes = employeeRepository.findPerformanceByPostOrdered(post);
        return calculatePercentile(notes, 25);
    }

    public Double getThirdQuartilePerformanceByPoste(String post) {
        List<Double> notes = employeeRepository.findPerformanceByPostOrdered(post);
        return calculatePercentile(notes, 75);
    }

    // Montant du salaire par poste

    public Double getMinSalaryByPoste(String post) {
        return employeeRepository.findMinSalaryByPost(post);
    }

    public Double getMaxSalaryByPoste(String post) {
        return employeeRepository.findMaxSalaryByPost(post);
    }

    public Double getMedianSalaryByPost(String post) {
        List<Double> salaries = employeeRepository.findSalaryByPostOrdered(post);
        return calculateMedian(salaries);
    }

    public Double getFirstQuartileSalaryByPost(String post) {
        List<Double> salaries = employeeRepository.findSalaryByPostOrdered(post);
        return calculatePercentile(salaries, 25);
    }

    public Double getThirdQuartileSalaryByPoste(String post) {
        List<Double> salaries = employeeRepository.findSalaryByPostOrdered(post);
        return calculatePercentile(salaries, 75);
    }

    // Taux d'absentéisme par poste

    public Double getMinAbsenteeismByPoste(String post) {
        return employeeRepository.findMinAbsenteeismByPost(post);
    }

    public Double getMaxAbsenteeismByPoste(String post) {
        return employeeRepository.findMaxAbsenteeismByPost(post);
    }

    public Double getMedianAbsenteeismByPost(String post) {
        List<Double> absenteeism = employeeRepository.findAbsenteeismByPostOrdered(post);
        return calculateMedian(absenteeism);
    }

    public Double getFirstQuartileAbsenteeismByPost(String post) {
        List<Double> absenteeism = employeeRepository.findAbsenteeismByPostOrdered(post);
        return calculatePercentile(absenteeism, 25);
    }

    public Double getThirdQuartileAbsenteeismByPoste(String post) {
        List<Double> absenteeism = employeeRepository.findAbsenteeismByPostOrdered(post);
        return calculatePercentile(absenteeism, 75);
    }

    // Expérience par poste

    public Integer getMinExperienceByPoste(String post) {
        return employeeRepository.findMinExperienceByPost(post);
    }

    public Integer getMaxExperienceByPoste(String post) {
        return employeeRepository.findMaxExperienceByPost(post);
    }

    public Double getMedianExperienceByPost(String post) {
        List<Double> experience = employeeRepository.findExperienceByPostOrdered(post);
        return calculateMedian(experience);
    }

    public Double getFirstQuartileExperienceByPost(String post) {
        List<Double> experience = employeeRepository.findExperienceByPostOrdered(post);
        return calculatePercentile(experience, 25);
    }

    public Double getThirdQuartileExperienceByPoste(String post) {
        List<Double> experience = employeeRepository.findExperienceByPostOrdered(post);
        return calculatePercentile(experience, 75);
    }

    // Heures de présence/ mois par poste

    public Double getMinAttendanceByPoste(String post) {
        return employeeRepository.findMinAttendanceByPost(post);
    }

    public Double getMaxAttendanceByPoste(String post) {
        return employeeRepository.findMaxAttendanceByPost(post);
    }

    public Double getMedianAttendanceByPost(String post) {
        List<Double> experience = employeeRepository.findAttendanceByPostOrdered(post);
        return calculateMedian(experience);
    }

    public Double getFirstQuartileAttendanceByPost(String post) {
        List<Double> experience = employeeRepository.findAttendanceByPostOrdered(post);
        return calculatePercentile(experience, 25);
    }

    public Double getThirdQuartileAttendanceByPoste(String post) {
        List<Double> experience = employeeRepository.findAttendanceByPostOrdered(post);
        return calculatePercentile(experience, 75);
    }

    public Integer countEmployeeByBusinessUnit(String businessUnit) {
        return employeeRepository.countEmployeeByBusinessUnit_BusinessUnit(businessUnit);
    }

    // ### UO

    // Note globale par UO

    public Integer getMinPerformanceByBusinessUnit(String businessUnit) {
        return employeeRepository.findMinPerformanceByBusinessUnit(businessUnit);
    }

    public Integer getMaxPerformanceByBusinessUnit(String businessUnit) {
        return employeeRepository.findMaxPerformanceByBusinessUnit(businessUnit);
    }

    public Double getMedianPerformanceByBusinessUnit(String businessUnit) {
        List<Double> notes = employeeRepository.findPerformanceByBusinessUnitOrdered(businessUnit);
        return calculateMedian(notes);
    }

    public Double getFirstQuartilePerformanceByBusinessUnit(String businessUnit) {
        List<Double> notes = employeeRepository.findPerformanceByBusinessUnitOrdered(businessUnit);
        return calculatePercentile(notes, 25);
    }

    public Double getThirdQuartilePerformanceByBusinessUnit(String businessUnit) {
        List<Double> notes = employeeRepository.findPerformanceByBusinessUnitOrdered(businessUnit);
        return calculatePercentile(notes, 75);
    }

    // Montant du salaire par UO

    public Double getMinSalaryByBusinessUnit(String businessUnit) {
        return employeeRepository.findMinSalaryByBusinessUnit(businessUnit);
    }

    public Double getMaxSalaryByBusinessUnit(String businessUnit) {
        return employeeRepository.findMaxSalaryByBusinessUnit(businessUnit);
    }

    public Double getMedianSalaryByBusinessUnit(String businessUnit) {
        List<Double> salaries = employeeRepository.findSalaryByBusinessUnitOrdered(businessUnit);
        return calculateMedian(salaries);
    }

    public Double getFirstQuartileSalaryByBusinessUnit(String businessUnit) {
        List<Double> salaries = employeeRepository.findSalaryByBusinessUnitOrdered(businessUnit);
        return calculatePercentile(salaries, 25);
    }

    public Double getThirdQuartileSalaryByBusinessUnit(String businessUnit) {
        List<Double> salaries = employeeRepository.findSalaryByBusinessUnitOrdered(businessUnit);
        return calculatePercentile(salaries, 75);
    }

    // Taux d'absentéisme par UO

    public Double getMinAbsenteeismByBusinessUnit(String businessUnit) {
        return employeeRepository.findMinAbsenteeismByBusinessUnit(businessUnit);
    }

    public Double getMaxAbsenteeismByBusinessUnit(String businessUnit) {
        return employeeRepository.findMaxAbsenteeismByBusinessUnit(businessUnit);
    }

    public Double getMedianAbsenteeismByBusinessUnit(String businessUnit) {
        List<Double> absenteeism = employeeRepository.findAbsenteeismByBusinessUnitOrdered(businessUnit);
        return calculateMedian(absenteeism);
    }

    public Double getFirstQuartileAbsenteeismByBusinessUnit(String businessUnit) {
        List<Double> absenteeism = employeeRepository.findAbsenteeismByBusinessUnitOrdered(businessUnit);
        return calculatePercentile(absenteeism, 25);
    }

    public Double getThirdQuartileAbsenteeismByBusinessUnit(String businessUnit) {
        List<Double> absenteeism = employeeRepository.findAbsenteeismByBusinessUnitOrdered(businessUnit);
        return calculatePercentile(absenteeism, 75);
    }

    // Expérience par UO

    public Integer getMinExperienceByBusinessUnit(String businessUnit) {
        return employeeRepository.findMinExperienceByBusinessUnit(businessUnit);
    }

    public Integer getMaxExperienceByBusinessUnit(String businessUnit) {
        return employeeRepository.findMaxExperienceByBusinessUnit(businessUnit);
    }

    public Double getMedianExperienceByBusinessUnit(String businessUnit) {
        List<Double> experience = employeeRepository.findExperienceByBusinessUnitOrdered(businessUnit);
        return calculateMedian(experience);
    }

    public Double getFirstQuartileExperienceByBusinessUnit(String businessUnit) {
        List<Double> experience = employeeRepository.findExperienceByBusinessUnitOrdered(businessUnit);
        return calculatePercentile(experience, 25);
    }

    public Double getThirdQuartileExperienceByBusinessUnit(String businessUnit) {
        List<Double> experience = employeeRepository.findExperienceByBusinessUnitOrdered(businessUnit);
        return calculatePercentile(experience, 75);
    }

    // Heures de présence/mois par unité commerciale

    public Double getMinAttendanceByBusinessUnit(String businessUnit) {
        return employeeRepository.findMinAttendanceByBusinessUnit(businessUnit);
    }

    public Double getMaxAttendanceByBusinessUnit(String businessUnit) {
        return employeeRepository.findMaxAttendanceByBusinessUnit(businessUnit);
    }

    public Double getMedianAttendanceByBusinessUnit(String businessUnit) {
        List<Double> attendance = employeeRepository.findAttendanceByBusinessUnitOrdered(businessUnit);
        return calculateMedian(attendance);
    }

    public Double getFirstQuartileAttendanceByBusinessUnit(String businessUnit) {
        List<Double> attendance = employeeRepository.findAttendanceByBusinessUnitOrdered(businessUnit);
        return calculatePercentile(attendance, 25);
    }

    public Double getThirdQuartileAttendanceByBusinessUnit(String businessUnit) {
        List<Double> attendance = employeeRepository.findAttendanceByBusinessUnitOrdered(businessUnit);
        return calculatePercentile(attendance, 75);
    }

    // ### Classification

    public Integer countEmployeeByClassification(String classification) {
        return employeeRepository.countEmployeeByClassification(classification);
    }

    // Note globale par Classification

    public Integer getMinPerformanceByClassification(String classification) {
        return employeeRepository.findMinPerformanceByClassification(classification);
    }

    public Integer getMaxPerformanceByClassification(String classification) {
        return employeeRepository.findMaxPerformanceByClassification(classification);
    }

    public Double getMedianPerformanceByClassification(String classification) {
        List<Double> notes = employeeRepository.findPerformanceByClassificationOrdered(classification);
        return calculateMedian(notes);
    }

    public Double getFirstQuartilePerformanceByClassification(String classification) {
        List<Double> notes = employeeRepository.findPerformanceByClassificationOrdered(classification);
        return calculatePercentile(notes, 25);
    }

    public Double getThirdQuartilePerformanceByClassification(String classification) {
        List<Double> notes = employeeRepository.findPerformanceByClassificationOrdered(classification);
        return calculatePercentile(notes, 75);
    }

    // Montant du salaire par Classification

    public Double getMinSalaryByClassification(String classification) {
        return employeeRepository.findMinSalaryByClassification(classification);
    }

    public Double getMaxSalaryByClassification(String classification) {
        return employeeRepository.findMaxSalaryByClassification(classification);
    }

    public Double getMedianSalaryByClassification(String classification) {
        List<Double> salaries = employeeRepository.findSalaryByClassificationOrdered(classification);
        return calculateMedian(salaries);
    }

    public Double getFirstQuartileSalaryByClassification(String classification) {
        List<Double> salaries = employeeRepository.findSalaryByClassificationOrdered(classification);
        return calculatePercentile(salaries, 25);
    }

    public Double getThirdQuartileSalaryByClassification(String classification) {
        List<Double> salaries = employeeRepository.findSalaryByClassificationOrdered(classification);
        return calculatePercentile(salaries, 75);
    }

    // Taux d'absentéisme par Classification

    public Double getMinAbsenteeismByClassification(String classification) {
        return employeeRepository.findMinAbsenteeismByClassification(classification);
    }

    public Double getMaxAbsenteeismByClassification(String classification) {
        return employeeRepository.findMaxAbsenteeismByClassification(classification);
    }

    public Double getMedianAbsenteeismByClassification(String classification) {
        List<Double> absenteeism = employeeRepository.findAbsenteeismByClassificationOrdered(classification);
        return calculateMedian(absenteeism);
    }

    public Double getFirstQuartileAbsenteeismByClassification(String classification) {
        List<Double> absenteeism = employeeRepository.findAbsenteeismByClassificationOrdered(classification);
        return calculatePercentile(absenteeism, 25);
    }

    public Double getThirdQuartileAbsenteeismByClassification(String classification) {
        List<Double> absenteeism = employeeRepository.findAbsenteeismByClassificationOrdered(classification);
        return calculatePercentile(absenteeism, 75);
    }

    // Expérience par Classification

    public Integer getMinExperienceByClassification(String classification) {
        return employeeRepository.findMinExperienceByClassification(classification);
    }

    public Integer getMaxExperienceByClassification(String classification) {
        return employeeRepository.findMaxExperienceByClassification(classification);
    }

    public Double getMedianExperienceByClassification(String classification) {
        List<Double> experience = employeeRepository.findExperienceByClassificationOrdered(classification);
        return calculateMedian(experience);
    }

    public Double getFirstQuartileExperienceByClassification(String classification) {
        List<Double> experience = employeeRepository.findExperienceByClassificationOrdered(classification);
        return calculatePercentile(experience, 25);
    }

    public Double getThirdQuartileExperienceByClassification(String classification) {
        List<Double> experience = employeeRepository.findExperienceByClassificationOrdered(classification);
        return calculatePercentile(experience, 75);
    }

    // Heures de présence/mois par Classification

    public Double getMinAttendanceByClassification(String classification) {
        return employeeRepository.findMinAttendanceByClassification(classification);
    }

    public Double getMaxAttendanceByClassification(String classification) {
        return employeeRepository.findMaxAttendanceByClassification(classification);
    }

    public Double getMedianAttendanceByClassification(String classification) {
        List<Double> attendance = employeeRepository.findAttendanceByClassificationOrdered(classification);
        return calculateMedian(attendance);
    }

    public Double getFirstQuartileAttendanceByClassification(String classification) {
        List<Double> attendance = employeeRepository.findAttendanceByClassificationOrdered(classification);
        return calculatePercentile(attendance, 25);
    }

    public Double getThirdQuartileAttendanceByClassification(String classification) {
        List<Double> attendance = employeeRepository.findAttendanceByClassificationOrdered(classification);
        return calculatePercentile(attendance, 75);
    }

    // ###

    private Double calculateMedian(List<Double> values) {
        int size = values.size();
        if (size == 0) return null;
        if (size % 2 == 0) {
            return (values.get(size / 2 - 1) + values.get(size / 2)) / 2.0;
        } else {
            return values.get(size / 2);
        }
    }

    private Double calculatePercentile(List<Double> values, int percentile) {
        if (values.isEmpty()) return null;
        double index = percentile / 100.0 * (values.size() - 1);
        int lower = (int) Math.floor(index);
        int upper = (int) Math.ceil(index);
        if (lower == upper) return values.get(lower);
        return values.get(lower) * (upper - index) + values.get(upper) * (index - lower);
    }
}
