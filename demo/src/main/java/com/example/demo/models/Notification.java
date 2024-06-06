package com.example.demo.models;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name="notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    //@Column(name = "content")
    private String content;

    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "receiver_id",nullable = false)
    private User userTo;

    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "emitter_id",nullable = false)
    private User userFrom;

    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    @Column(name = "delivred")
    private boolean delivered;
    @Column(name = "is_read")
    private boolean read;

    @Column(name = "date")
    private Date date;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getUserTo() {
        return userTo;
    }

    public void setUserTo(User userTo) {
        this.userTo = userTo;
    }

    public User getUserFrom() {
        return userFrom;
    }

    public void setUserFrom(User userFrom) {
        this.userFrom = userFrom;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public boolean isDelivered() {
        return delivered;
    }

    public void setDelivered(boolean delivered) {
        this.delivered = delivered;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public Date date() {
        return this.date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Notification() {}
    public Notification(Integer id, String content, User userTo, User userFrom, NotificationType notificationType, boolean delivered, boolean read, Date date) {
        this.id = id;
        this.content = content;
        this.userTo = userTo;
        this.userFrom = userFrom;
        this.notificationType = notificationType;
        this.delivered = delivered;
        this.read = read;
        this.date = date;
    }
}