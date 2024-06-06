package com.example.demo.models;

import jakarta.persistence.*;

@Entity
@Table(name="businessUnit")
public class BusinessUnit {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "businessUnit")
    private String businessUnit;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBusinessUnit() {
        return businessUnit;
    }

    public void setBusinessUnit(String businessUnit) {
        this.businessUnit = businessUnit;
    }

    public BusinessUnit() {
    }

    public BusinessUnit(String businessUnit) {
        this.businessUnit = businessUnit;
    }

    public BusinessUnit(Integer id, String businessUnit) {
        this.id = id;
        this.businessUnit = businessUnit;
    }
}

