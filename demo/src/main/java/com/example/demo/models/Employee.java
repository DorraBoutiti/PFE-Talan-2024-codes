package com.example.demo.models;

import jakarta.persistence.*;

@Entity
@Table(name="employees")
public class Employee {
    /*'Genre', 'Age', 'Pays de naissance',
                'Ville de naissance', 'Etablissement',
                'Code-Qualification', 'Code-Niveau d'expérience',
                'Code-Type de contrat', 'Type de temps contractuel',
                'Heures de présence / jour', 'Heures de présence / semaine',
                'Type travail', 'Etat de la mobilité',
                'NbAbsencesTotaleParEmployé', 'Droits Congés Payés',
                'Rubrique', 'Montant de l'augmentation',
                'Taux d'augmentation', 'Motif d'augmentation',
                'Situation'*/
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Integer id;

    @Column(name = "matricule")
    private String registrationNumber;

    @Column(name = "Expérience en Année")
    private Integer experience;

    @Column(name = "Heures de présence / mois")
    private Double attendance;

    @Column(name = "Montant du salaire")
    private Double salary;

    @Column(name = "Poste")
    private String poste;

    /*@Column(name = "Unité organisationnelle")
    private String businessUnit;*/
    @ManyToOne()
    @JoinColumn(name = "businessUnit", nullable = true)
    private BusinessUnit businessUnit;

    @Column(name = "Classification")
    private String classification;

    @Column(name = "Département")
    private String departement;

    @Column(name = "Note globale")
    private Integer performance;

    @Column(name = "TauxAbsenteisme")
    private Double absenteeism;

    @Column(name = "Recommanded Increase (amount)")
    private Double recommandedIncreaseAmount;

    @Column(name = "Recommanded Increase (%)")
    private String recommandedIncreasePourcentage;

    @Column(name = "New Base Salary")
    private Double NewBaseSalary;

    public Employee() {
    }

    public Employee(Integer id, String registrationNumber, Integer experience, Double attendance, Double salary, String poste, BusinessUnit businessUnit, String classification, String departement, Integer performance, Double absenteeism, Double recommandedIncreaseAmount, String recommandedIncreasePourcentage, Double newBaseSalary) {
        this.id = id;
        this.registrationNumber = registrationNumber;
        this.experience = experience;
        this.attendance = attendance;
        this.salary = salary;
        this.poste = poste;
        this.businessUnit = businessUnit;
        this.classification = classification;
        this.departement = departement;
        this.performance = performance;
        this.absenteeism = absenteeism;
        this.recommandedIncreaseAmount = recommandedIncreaseAmount;
        this.recommandedIncreasePourcentage = recommandedIncreasePourcentage;
        NewBaseSalary = newBaseSalary;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registerNumber) {
        this.registrationNumber = registerNumber;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public Double getAttendance() {
        return attendance;
    }

    public void setAttendance(Double attendance) {
        this.attendance = attendance;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getPoste() {
        return poste;
    }

    public void setPoste(String poste) {
        this.poste = poste;
    }

    public BusinessUnit getBusinessUnit() {
        return businessUnit;
    }

    public void setBusinessUnit(BusinessUnit businessUnit) {
        this.businessUnit = businessUnit;
    }

    public String getClassification() {
        return classification;
    }

    public void setClassification(String classification) {
        this.classification = classification;
    }

    public String getDepartement() {
        return departement;
    }

    public void setDepartement(String departement) {
        this.departement = departement;
    }

    public Integer getPerformance() {
        return performance;
    }

    public void setPerformance(Integer performance) {
        this.performance = performance;
    }

    public Double getAbsenteeism() {
        return absenteeism;
    }

    public void setAbsenteeism(Double absenteeism) {
        this.absenteeism = absenteeism;
    }

    public Double getRecommandedIncreaseAmount() {
        return recommandedIncreaseAmount;
    }

    public void setRecommandedIncreaseAmount(Double recommandedIncreaseAmount) {
        this.recommandedIncreaseAmount = recommandedIncreaseAmount;
    }

    public String getRecommandedIncreasePourcentage() {
        return recommandedIncreasePourcentage;
    }

    public void setRecommandedIncreasePourcentage(String recommandedIncreasePourcentage) {
        this.recommandedIncreasePourcentage = recommandedIncreasePourcentage;
    }

    public Double getNewBaseSalary() {
        return NewBaseSalary;
    }

    public void setNewBaseSalary(Double newBaseSalary) {
        NewBaseSalary = newBaseSalary;
    }
}
