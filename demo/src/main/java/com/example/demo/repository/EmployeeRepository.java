package com.example.demo.repository;

import com.example.demo.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    Employee findEmployeeByRegistrationNumber(String registrationNumber);
    Employee findEmployeeById(Integer id);

    // ### Poste
    Integer countEmployeeByPoste(String poste);

    // Note globale par poste
    @Query("SELECT MIN(s.performance) FROM Employee s WHERE s.poste = :post AND s.performance != -99")
    Integer findMinPerformanceByPost(@Param("post") String post);
    @Query("SELECT MAX(s.performance) FROM Employee s WHERE s.poste = :post AND s.performance != -99")
    Integer findMaxPerformanceByPost(@Param("post") String post);
    @Query("SELECT s.performance FROM Employee s WHERE s.poste = :post AND s.performance != -99 ORDER BY s.performance")
    List<Double> findPerformanceByPostOrdered(@Param("post") String post);

    // Montant du salaire par poste
    @Query("SELECT MIN(s.salary) FROM Employee s WHERE s.poste = :post")
    Double findMinSalaryByPost(@Param("post") String post);
    @Query("SELECT MAX(s.salary) FROM Employee s WHERE s.poste = :post")
    Double findMaxSalaryByPost(@Param("post") String post);
    @Query("SELECT s.salary FROM Employee s WHERE s.poste = :post ORDER BY s.salary")
    List<Double> findSalaryByPostOrdered(@Param("post") String post);

    // Taux d'absentéisme par poste
    @Query("SELECT MIN(s.absenteeism) FROM Employee s WHERE s.poste = :post")
    Double findMinAbsenteeismByPost(@Param("post") String post);
    @Query("SELECT MAX(s.absenteeism) FROM Employee s WHERE s.poste = :post")
    Double findMaxAbsenteeismByPost(@Param("post") String post);
    @Query("SELECT s.absenteeism FROM Employee s WHERE s.poste = :post ORDER BY s.absenteeism")
    List<Double> findAbsenteeismByPostOrdered(@Param("post") String post);

    // Expérience par poste
    @Query("SELECT MIN(s.experience) FROM Employee s WHERE s.poste = :post")
    Integer findMinExperienceByPost(@Param("post") String post);
    @Query("SELECT MAX(s.experience) FROM Employee s WHERE s.poste = :post")
    Integer findMaxExperienceByPost(@Param("post") String post);
    @Query("SELECT s.experience FROM Employee s WHERE s.poste = :post ORDER BY s.experience")
    List<Double> findExperienceByPostOrdered(@Param("post") String post);

    // Heures de présence/ mois par poste
    @Query("SELECT MIN(s.attendance) FROM Employee s WHERE s.poste = :post")
    Double findMinAttendanceByPost(@Param("post") String post);
    @Query("SELECT MAX(s.attendance) FROM Employee s WHERE s.poste = :post")
    Double findMaxAttendanceByPost(@Param("post") String post);
    @Query("SELECT s.attendance FROM Employee s WHERE s.poste = :post ORDER BY s.attendance")
    List<Double> findAttendanceByPostOrdered(@Param("post") String post);

    // ### UO
    Integer countEmployeeByBusinessUnit_BusinessUnit(String businessUnit);

    // Note globale par poste
    @Query("SELECT MIN(s.performance) FROM Employee s WHERE s.businessUnit.businessUnit = :bu AND s.performance != -99")
    Integer findMinPerformanceByBusinessUnit(@Param("bu") String businessUnit);
    @Query("SELECT MAX(s.performance) FROM Employee s WHERE s.businessUnit.businessUnit = :bu AND s.performance != -99")
    Integer findMaxPerformanceByBusinessUnit(@Param("bu") String businessUnit);
    @Query("SELECT s.performance FROM Employee s WHERE s.businessUnit.businessUnit = :bu AND s.performance != -99 ORDER BY s.performance")
    List<Double> findPerformanceByBusinessUnitOrdered(@Param("bu") String businessUnit);

    // Montant du salaire par poste
    @Query("SELECT MIN(s.salary) FROM Employee s WHERE s.businessUnit.businessUnit = :bu")
    Double findMinSalaryByBusinessUnit(@Param("bu") String businessUnit);
    @Query("SELECT MAX(s.salary) FROM Employee s WHERE s.businessUnit.businessUnit = :bu")
    Double findMaxSalaryByBusinessUnit(@Param("bu") String businessUnit);
    @Query("SELECT s.salary FROM Employee s WHERE s.businessUnit.businessUnit = :bu ORDER BY s.salary")
    List<Double> findSalaryByBusinessUnitOrdered(@Param("bu") String businessUnit);

    // Taux d'absentéisme par poste
    @Query("SELECT MIN(s.absenteeism) FROM Employee s WHERE s.businessUnit.businessUnit = :bu")
    Double findMinAbsenteeismByBusinessUnit(@Param("bu") String businessUnit);
    @Query("SELECT MAX(s.absenteeism) FROM Employee s WHERE s.businessUnit.businessUnit = :bu")
    Double findMaxAbsenteeismByBusinessUnit(@Param("bu") String businessUnit);
    @Query("SELECT s.absenteeism FROM Employee s WHERE s.businessUnit.businessUnit = :bu ORDER BY s.absenteeism")
    List<Double> findAbsenteeismByBusinessUnitOrdered(@Param("bu") String businessUnit);

    // Expérience par poste
    @Query("SELECT MIN(s.experience) FROM Employee s WHERE s.businessUnit.businessUnit = :bu")
    Integer findMinExperienceByBusinessUnit(@Param("bu") String businessUnit);
    @Query("SELECT MAX(s.experience) FROM Employee s WHERE s.businessUnit.businessUnit = :bu")
    Integer findMaxExperienceByBusinessUnit(@Param("bu") String businessUnit);
    @Query("SELECT s.experience FROM Employee s WHERE s.businessUnit.businessUnit = :bu ORDER BY s.experience")
    List<Double> findExperienceByBusinessUnitOrdered(@Param("bu") String businessUnit);

    // Heures de présence/ mois par poste
    @Query("SELECT MIN(s.attendance) FROM Employee s WHERE s.businessUnit.businessUnit = :bu")
    Double findMinAttendanceByBusinessUnit(@Param("bu") String businessUnit);
    @Query("SELECT MAX(s.attendance) FROM Employee s WHERE s.businessUnit.businessUnit = :bu")
    Double findMaxAttendanceByBusinessUnit(@Param("bu") String businessUnit);
    @Query("SELECT s.attendance FROM Employee s WHERE s.businessUnit.businessUnit = :bu ORDER BY s.attendance")
    List<Double> findAttendanceByBusinessUnitOrdered(@Param("bu") String businessUnit);

    // ### Classification
    Integer countEmployeeByClassification(String classification);

    // Note globale par Classification
    @Query("SELECT MIN(s.performance) FROM Employee s WHERE s.classification = :classif AND s.performance != -99")
    Integer findMinPerformanceByClassification(@Param("classif") String classification);
    @Query("SELECT MAX(s.performance) FROM Employee s WHERE s.classification = :classif AND s.performance != -99")
    Integer findMaxPerformanceByClassification(@Param("classif") String classification);
    @Query("SELECT s.performance FROM Employee s WHERE s.classification = :classif AND s.performance != -99 ORDER BY s.performance")
    List<Double> findPerformanceByClassificationOrdered(@Param("classif") String classification);

    // Montant du salaire par Classification
    @Query("SELECT MIN(s.salary) FROM Employee s WHERE s.classification = :classif")
    Double findMinSalaryByClassification(@Param("classif") String classification);
    @Query("SELECT MAX(s.salary) FROM Employee s WHERE s.classification = :classif")
    Double findMaxSalaryByClassification(@Param("classif") String classification);
    @Query("SELECT s.salary FROM Employee s WHERE s.classification = :classif ORDER BY s.salary")
    List<Double> findSalaryByClassificationOrdered(@Param("classif") String classification);

    // Taux d'absentéisme par Classification
    @Query("SELECT MIN(s.absenteeism) FROM Employee s WHERE s.classification = :classif")
    Double findMinAbsenteeismByClassification(@Param("classif") String classification);
    @Query("SELECT MAX(s.absenteeism) FROM Employee s WHERE s.classification = :classif")
    Double findMaxAbsenteeismByClassification(@Param("classif") String classification);
    @Query("SELECT s.absenteeism FROM Employee s WHERE s.classification = :classif ORDER BY s.absenteeism")
    List<Double> findAbsenteeismByClassificationOrdered(@Param("classif") String classification);

    // Expérience par Classification
    @Query("SELECT MIN(s.experience) FROM Employee s WHERE s.classification = :classif")
    Integer findMinExperienceByClassification(@Param("classif") String classification);
    @Query("SELECT MAX(s.experience) FROM Employee s WHERE s.classification = :classif")
    Integer findMaxExperienceByClassification(@Param("classif") String classification);
    @Query("SELECT s.experience FROM Employee s WHERE s.classification = :classif ORDER BY s.experience")
    List<Double> findExperienceByClassificationOrdered(@Param("classif") String classification);

    // Heures de présence/mois par Classification
    @Query("SELECT MIN(s.attendance) FROM Employee s WHERE s.classification = :classif")
    Double findMinAttendanceByClassification(@Param("classif") String classification);
    @Query("SELECT MAX(s.attendance) FROM Employee s WHERE s.classification = :classif")
    Double findMaxAttendanceByClassification(@Param("classif") String classification);
    @Query("SELECT s.attendance FROM Employee s WHERE s.classification = :classif ORDER BY s.attendance")
    List<Double> findAttendanceByClassificationOrdered(@Param("classif") String classification);
}