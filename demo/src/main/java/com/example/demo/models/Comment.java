package com.example.demo.models;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name="comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "comment")
    private String comment;

    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "received_id", nullable = false)
    private Employee employeeTo;

    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "emitter_id", nullable = false)
    private User userFrom;

    @Column(name = "date")
    private Date date;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Employee getEmployeeTo() {
        return employeeTo;
    }

    public void setEmployeeTo(Employee employeeTo) {
        this.employeeTo = employeeTo;
    }

    public User getUserFrom() {
        return userFrom;
    }

    public void setUserFrom(User userFrom) {
        this.userFrom = userFrom;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Comment(Integer id, String comment, Employee employeeTo, User userFrom, Date date) {
        this.id = id;
        this.comment = comment;
        this.employeeTo = employeeTo;
        this.userFrom = userFrom;
        this.date = date;
    }

    public Comment() {
    }
}
