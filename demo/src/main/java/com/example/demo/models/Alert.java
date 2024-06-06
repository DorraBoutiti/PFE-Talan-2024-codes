package com.example.demo.models;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "alerts", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"alertType", "businessUnit"})
})
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "alertType")
    private AlertType alertType;

    @ManyToOne()
    @JoinColumn(name = "businessUnit", nullable = false)
    private BusinessUnit businessUnit;

    @Column(name = "pourcentageMin")
    private Integer pourcentageMin;

    @Column(name = "pourcentageMax")
    private Integer pourcentageMax;

    @ManyToOne()
    @JoinColumn(name = "user", nullable = false)
    private User user;

    @Column(name = "date")
    private Date date;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public AlertType getAlertType() {
        return alertType;
    }

    public void setAlertType(AlertType alertType) {
        this.alertType = alertType;
    }

    public BusinessUnit getBusinessUnit() {
        return businessUnit;
    }

    public void setBusinessUnit(BusinessUnit businessUnit) {
        this.businessUnit = businessUnit;
    }

    public Integer getPourcentageMin() {
        return pourcentageMin;
    }

    public void setPourcentageMin(Integer pourcentageMin) {
        this.pourcentageMin = pourcentageMin;
    }

    public Integer getPourcentageMax() {
        return pourcentageMax;
    }

    public void setPourcentageMax(Integer pourcentageMax) {
        this.pourcentageMax = pourcentageMax;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Alert() {
    }

    public Alert(Integer id, AlertType alertType, BusinessUnit businessUnit, User user, Date date, Integer pourcentageMin, Integer pourcentageMax) {
        this.id = id;
        this.alertType = alertType;
        this.businessUnit = businessUnit;
        this.user = user;
        this.date = date;
        this.pourcentageMin = pourcentageMin;
        this.pourcentageMax = pourcentageMax;
    }
}
