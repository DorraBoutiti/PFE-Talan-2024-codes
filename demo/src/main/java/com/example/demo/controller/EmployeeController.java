package com.example.demo.controller;

import com.example.demo.models.Employee;
import com.example.demo.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequestMapping("/api/employee")
@RestController
public class EmployeeController {
    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/")
    public List<Employee> getEmployees() {
        return employeeService.getEmployees();
    }

    @GetMapping("/id/{id}")
    public Employee getEmployeeById(@PathVariable Integer id) {
        return employeeService.getEmployeeById(id);
    }

    @GetMapping("/{registrationNumber}")
    public Employee getEmployeeByRegistrationNumber(@PathVariable String registrationNumber) {
        return employeeService.getEmployeeByRegistrationNumber(registrationNumber);
    }

    @GetMapping("/employee-performance/{registrationNumber}")
    public Integer getPerformanceByRegisterNumber(@PathVariable String registrationNumber) {
        return employeeService.getEmployeeByRegistrationNumber(registrationNumber).getPerformance();
    }

    @GetMapping("/employee-salary/{registrationNumber}")
    public Double getSalaryByRegisterNumber(@PathVariable String registrationNumber) {
        return employeeService.getEmployeeByRegistrationNumber(registrationNumber).getSalary();
    }

    @GetMapping("/employee-absenteeism/{registrationNumber}")
    public Double getAbsenteeismByRegisterNumber(@PathVariable String registrationNumber) {
        return employeeService.getEmployeeByRegistrationNumber(registrationNumber).getAbsenteeism();
    }

    @GetMapping("/employee-experience/{registrationNumber}")
    public Integer getExperienceByRegisterNumber(@PathVariable String registrationNumber) {
        return employeeService.getEmployeeByRegistrationNumber(registrationNumber).getExperience();
    }

    @GetMapping("/employee-attendance/{registrationNumber}")
    public Double getAttendanceById(@PathVariable String registrationNumber) {
        return employeeService.getEmployeeByRegistrationNumber(registrationNumber).getAttendance();
    }

    // ## Poste

    @GetMapping("/post/{registrationNumber}")
    public String getPostByRegisterNumber(@PathVariable String registrationNumber) {
        return employeeService.getEmployeeByRegistrationNumber(registrationNumber).getPoste();
    }

    @GetMapping("/post-count/{post}")
    public Integer countEmployeeByPost(@PathVariable String post) {
        return employeeService.countEmployeeByPoste(post);
    }

    // Note globale par poste

    @GetMapping("/post-performance/min")
    public Integer getMinPerformancePost(@RequestParam String post) {
        return employeeService.getMinPerformanceByPoste(post);
    }

    @GetMapping("/post-performance/max")
    public Integer getMaxPerformancePost(@RequestParam String post) {
        return employeeService.getMaxPerformanceByPoste(post);
    }

    @GetMapping("/post-performance/median")
    public Double getMedianPerformancePost(@RequestParam String post) {
        return employeeService.getMedianPerformanceByPost(post);
    }

    @GetMapping("/post-performance/firstQuartile")
    public Double getFirstQuartilePerformancePost(@RequestParam String post) {
        return employeeService.getFirstQuartilePerformanceByPost(post);
    }

    @GetMapping("/post-performance/thirdQuartile")
    public Double getThirdQuartilePerformancePost(@RequestParam String post) {
        return employeeService.getThirdQuartilePerformanceByPoste(post);
    }

    // Montant du salaire par poste

    @GetMapping("/post-salary/min")
    public Double getMinSalaryPost(@RequestParam String post) {
        return employeeService.getMinSalaryByPoste(post);
    }

    @GetMapping("/post-salary/max")
    public Double getMaxSalaryPost(@RequestParam String post) {
        return employeeService.getMaxSalaryByPoste(post);
    }

    @GetMapping("/post-salary/median")
    public Double getMedianSalaryPost(@RequestParam String post) {
        return employeeService.getMedianSalaryByPost(post);
    }

    @GetMapping("/post-salary/firstQuartile")
    public Double getFirstQuartileSalaryPost(@RequestParam String post) {
        return employeeService.getFirstQuartileSalaryByPost(post);
    }

    @GetMapping("/post-salary/thirdQuartile")
    public Double getThirdQuartileSalaryPost(@RequestParam String post) {
        return employeeService.getThirdQuartileSalaryByPoste(post);
    }

    // Taux d'absentéisme par poste

    @GetMapping("/post-absenteeism/min")
    public Double getMinAbsenteeismPost(@RequestParam String post) {
        return employeeService.getMinAbsenteeismByPoste(post);
    }

    @GetMapping("/post-absenteeism/max")
    public Double getMaxAbsenteeismPost(@RequestParam String post) {
        return employeeService.getMaxAbsenteeismByPoste(post);
    }

    @GetMapping("/post-absenteeism/median")
    public Double getMedianAbsenteeismPost(@RequestParam String post) {
        return employeeService.getMedianAbsenteeismByPost(post);
    }

    @GetMapping("/post-absenteeism/firstQuartile")
    public Double getFirstQuartileAbsenteeismPost(@RequestParam String post) {
        return employeeService.getFirstQuartileAbsenteeismByPost(post);
    }

    @GetMapping("/post-absenteeism/thirdQuartile")
    public Double getThirdQuartileAbsenteeismPost(@RequestParam String post) {
        return employeeService.getThirdQuartileAbsenteeismByPoste(post);
    }

    // Expérience par poste

    @GetMapping("/post-experience/min")
    public Integer getMinExperiencePost(@RequestParam String post) {
        return employeeService.getMinExperienceByPoste(post);
    }

    @GetMapping("/post-experience/max")
    public Integer getMaxExperiencePost(@RequestParam String post) {
        return employeeService.getMaxExperienceByPoste(post);
    }

    @GetMapping("/post-experience/median")
    public Double getMedianExperiencePost(@RequestParam String post) {
        return employeeService.getMedianExperienceByPost(post);
    }

    @GetMapping("/post-experience/firstQuartile")
    public Double getFirstQuartileExperiencePost(@RequestParam String post) {
        return employeeService.getFirstQuartileExperienceByPost(post);
    }

    @GetMapping("/post-experience/thirdQuartile")
    public Double getThirdQuartileExperiencePost(@RequestParam String post) {
        return employeeService.getThirdQuartileExperienceByPoste(post);
    }

    // Heures de présence/mois par poste

    @GetMapping("/post-attendance/min")
    public Double getMinAttendancePost(@RequestParam String post) {
        return employeeService.getMinAttendanceByPoste(post);
    }

    @GetMapping("/post-attendance/max")
    public Double getMaxAttendancePost(@RequestParam String post) {
        return employeeService.getMaxAttendanceByPoste(post);
    }

    @GetMapping("/post-attendance/median")
    public Double getMedianAttendancePost(@RequestParam String post) {
        return employeeService.getMedianAttendanceByPost(post);
    }

    @GetMapping("/post-attendance/firstQuartile")
    public Double getFirstQuartileAttendancePost(@RequestParam String post) {
        return employeeService.getFirstQuartileAttendanceByPost(post);
    }

    @GetMapping("/post-attendance/thirdQuartile")
    public Double getThirdQuartileAttendancePost(@RequestParam String post) {
        return employeeService.getThirdQuartileAttendanceByPoste(post);
    }

    // ## Business Unit

    @GetMapping("/businessUnit/{registrationNumber}")
    public String getBusinessUnitByRegisterNumber(@PathVariable String registrationNumber) {
        return employeeService.getEmployeeByRegistrationNumber(registrationNumber).getBusinessUnit().getBusinessUnit();
    }

    @GetMapping("/businessUnit-count/{businessUnit}")
    public Integer countEmployeeByBusinessUnit(@PathVariable String businessUnit) {
        return employeeService.countEmployeeByBusinessUnit(businessUnit);
    }

    // Note globale par business unit

    @GetMapping("/businessUnit-performance/min")
    public Integer getMinPerformanceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMinPerformanceByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-performance/max")
    public Integer getMaxPerformanceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMaxPerformanceByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-performance/median")
    public Double getMedianPerformanceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMedianPerformanceByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-performance/firstQuartile")
    public Double getFirstQuartilePerformanceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getFirstQuartilePerformanceByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-performance/thirdQuartile")
    public Double getThirdQuartilePerformanceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getThirdQuartilePerformanceByBusinessUnit(businessUnit);
    }

    // Montant du salaire par business unit

    @GetMapping("/businessUnit-salary/min")
    public Double getMinSalaryBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMinSalaryByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-salary/max")
    public Double getMaxSalaryBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMaxSalaryByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-salary/median")
    public Double getMedianSalaryBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMedianSalaryByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-salary/firstQuartile")
    public Double getFirstQuartileSalaryBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getFirstQuartileSalaryByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-salary/thirdQuartile")
    public Double getThirdQuartileSalaryBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getThirdQuartileSalaryByBusinessUnit(businessUnit);
    }

    // Taux d'absentéisme par business unit

    @GetMapping("/businessUnit-absenteeism/min")
    public Double getMinAbsenteeismBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMinAbsenteeismByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-absenteeism/max")
    public Double getMaxAbsenteeismBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMaxAbsenteeismByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-absenteeism/median")
    public Double getMedianAbsenteeismBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMedianAbsenteeismByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-absenteeism/firstQuartile")
    public Double getFirstQuartileAbsenteeismBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getFirstQuartileAbsenteeismByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-absenteeism/thirdQuartile")
    public Double getThirdQuartileAbsenteeismBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getThirdQuartileAbsenteeismByBusinessUnit(businessUnit);
    }

    // Expérience par business unit

    @GetMapping("/businessUnit-experience/min")
    public Integer getMinExperienceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMinExperienceByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-experience/max")
    public Integer getMaxExperienceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMaxExperienceByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-experience/median")
    public Double getMedianExperienceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMedianExperienceByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-experience/firstQuartile")
    public Double getFirstQuartileExperienceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getFirstQuartileExperienceByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-experience/thirdQuartile")
    public Double getThirdQuartileExperienceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getThirdQuartileExperienceByBusinessUnit(businessUnit);
    }

    // Heures de présence/mois par business unit

    @GetMapping("/businessUnit-attendance/min")
    public Double getMinAttendanceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMinAttendanceByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-attendance/max")
    public Double getMaxAttendanceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMaxAttendanceByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-attendance/median")
    public Double getMedianAttendanceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getMedianAttendanceByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-attendance/firstQuartile")
    public Double getFirstQuartileAttendanceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getFirstQuartileAttendanceByBusinessUnit(businessUnit);
    }

    @GetMapping("/businessUnit-attendance/thirdQuartile")
    public Double getThirdQuartileAttendanceBusinessUnit(@RequestParam String businessUnit) {
        return employeeService.getThirdQuartileAttendanceByBusinessUnit(businessUnit);
    }

    // ## Classification

    @GetMapping("/classification/{registrationNumber}")
    public String getClassificationByRegisterNumber(@PathVariable String registrationNumber) {
        return employeeService.getEmployeeByRegistrationNumber(registrationNumber).getClassification();
    }

    @GetMapping("/classification-count/{classification}")
    public Integer countEmployeeByClassification(@PathVariable String classification) {
        return employeeService.countEmployeeByClassification(classification);
    }

    // Note globale par classification

    @GetMapping("/classification-performance/min")
    public Integer getMinPerformanceClassification(@RequestParam String classification) {
        return employeeService.getMinPerformanceByClassification(classification);
    }

    @GetMapping("/classification-performance/max")
    public Integer getMaxPerformanceClassification(@RequestParam String classification) {
        return employeeService.getMaxPerformanceByClassification(classification);
    }

    @GetMapping("/classification-performance/median")
    public Double getMedianPerformanceClassification(@RequestParam String classification) {
        return employeeService.getMedianPerformanceByClassification(classification);
    }

    @GetMapping("/classification-performance/firstQuartile")
    public Double getFirstQuartilePerformanceClassification(@RequestParam String classification) {
        return employeeService.getFirstQuartilePerformanceByClassification(classification);
    }

    @GetMapping("/classification-performance/thirdQuartile")
    public Double getThirdQuartilePerformanceClassification(@RequestParam String classification) {
        return employeeService.getThirdQuartilePerformanceByClassification(classification);
    }

    // Montant du salaire par classification

    @GetMapping("/classification-salary/min")
    public Double getMinSalaryClassification(@RequestParam String classification) {
        return employeeService.getMinSalaryByClassification(classification);
    }

    @GetMapping("/classification-salary/max")
    public Double getMaxSalaryClassification(@RequestParam String classification) {
        return employeeService.getMaxSalaryByClassification(classification);
    }

    @GetMapping("/classification-salary/median")
    public Double getMedianSalaryClassification(@RequestParam String classification) {
        return employeeService.getMedianSalaryByClassification(classification);
    }

    @GetMapping("/classification-salary/firstQuartile")
    public Double getFirstQuartileSalaryClassification(@RequestParam String classification) {
        return employeeService.getFirstQuartileSalaryByClassification(classification);
    }

    @GetMapping("/classification-salary/thirdQuartile")
    public Double getThirdQuartileSalaryClassification(@RequestParam String classification) {
        return employeeService.getThirdQuartileSalaryByClassification(classification);
    }

    // Taux d'absentéisme par classification

    @GetMapping("/classification-absenteeism/min")
    public Double getMinAbsenteeismClassification(@RequestParam String classification) {
        return employeeService.getMinAbsenteeismByClassification(classification);
    }

    @GetMapping("/classification-absenteeism/max")
    public Double getMaxAbsenteeismClassification(@RequestParam String classification) {
        return employeeService.getMaxAbsenteeismByClassification(classification);
    }

    @GetMapping("/classification-absenteeism/median")
    public Double getMedianAbsenteeismClassification(@RequestParam String classification) {
        return employeeService.getMedianAbsenteeismByClassification(classification);
    }

    @GetMapping("/classification-absenteeism/firstQuartile")
    public Double getFirstQuartileAbsenteeismClassification(@RequestParam String classification) {
        return employeeService.getFirstQuartileAbsenteeismByClassification(classification);
    }

    @GetMapping("/classification-absenteeism/thirdQuartile")
    public Double getThirdQuartileAbsenteeismClassification(@RequestParam String classification) {
        return employeeService.getThirdQuartileAbsenteeismByClassification(classification);
    }

    // Expérience par classification

    @GetMapping("/classification-experience/min")
    public Integer getMinExperienceClassification(@RequestParam String classification) {
        return employeeService.getMinExperienceByClassification(classification);
    }

    @GetMapping("/classification-experience/max")
    public Integer getMaxExperienceClassification(@RequestParam String classification) {
        return employeeService.getMaxExperienceByClassification(classification);
    }

    @GetMapping("/classification-experience/median")
    public Double getMedianExperienceClassification(@RequestParam String classification) {
        return employeeService.getMedianExperienceByClassification(classification);
    }

    @GetMapping("/classification-experience/firstQuartile")
    public Double getFirstQuartileExperienceClassification(@RequestParam String classification) {
        return employeeService.getFirstQuartileExperienceByClassification(classification);
    }

    @GetMapping("/classification-experience/thirdQuartile")
    public Double getThirdQuartileExperienceClassification(@RequestParam String classification) {
        return employeeService.getThirdQuartileExperienceByClassification(classification);
    }

    // Heures de présence/mois par classification

    @GetMapping("/classification-attendance/min")
    public Double getMinAttendanceClassification(@RequestParam String classification) {
        return employeeService.getMinAttendanceByClassification(classification);
    }

    @GetMapping("/classification-attendance/max")
    public Double getMaxAttendanceClassification(@RequestParam String classification) {
        return employeeService.getMaxAttendanceByClassification(classification);
    }

    @GetMapping("/classification-attendance/median")
    public Double getMedianAttendanceClassification(@RequestParam String classification) {
        return employeeService.getMedianAttendanceByClassification(classification);
    }

    @GetMapping("/classification-attendance/firstQuartile")
    public Double getFirstQuartileAttendanceClassification(@RequestParam String classification) {
        return employeeService.getFirstQuartileAttendanceByClassification(classification);
    }

    @GetMapping("/classification-attendance/thirdQuartile")
    public Double getThirdQuartileAttendanceClassification(@RequestParam String classification) {
        return employeeService.getThirdQuartileAttendanceByClassification(classification);
    }
}
