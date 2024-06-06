package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    @Column(unique = true)
    private String registrationNumber;
    private String firstName;
    private String lastName;
    @Column(unique = true)
    private String email;
    private String password;
    @ManyToOne()
    @JoinColumn(name = "businessUnit", nullable = true)
    private BusinessUnit businessUnit;
    private String description;
    private Date dateSendingRequest;
    @Enumerated(EnumType.STRING)
    private Status status;
    @Enumerated(EnumType.STRING)
    private Role role;

    /*@ElementCollection
    //@CollectionTable(name = "user_followers", joinColumns = @JoinColumn(name = "user_id"))
    //@Column(name = "follower_id")
    private List<Integer> followers = new ArrayList<>();

    @ElementCollection
    //@CollectionTable(name = "user_followings", joinColumns = @JoinColumn(name = "user_id"))
    //@Column(name = "following_id")
    private List<Integer> followings = new ArrayList<>();

    /*@ManyToMany
    private List<Post> savedPost = new ArrayList<>();*/

    public User() {
    }

    public User(Integer id, String registrationNumber, String firstName, String lastName, String email, String password, BusinessUnit businessUnit, String description, Date dateSendingRequest, Status status, Role role) {
        this.id = id;
        this.registrationNumber = registrationNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.businessUnit = businessUnit;
        this.description = description;
        this.dateSendingRequest = dateSendingRequest;
        this.status = status;
        this.role = role;
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

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public BusinessUnit getBusinessUnit() {
        return businessUnit;
    }

    public void setBusinessUnit(BusinessUnit businessUnit) {
        this.businessUnit = businessUnit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDateSendingRequest() {
        return dateSendingRequest;
    }

    public void setDateSendingRequest(Date dateSendingRequest) {
        this.dateSendingRequest = dateSendingRequest;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
