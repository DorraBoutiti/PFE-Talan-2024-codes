package com.example.demo.request;

import com.example.demo.models.User;

public class UpdateUserRequest {
    User user;
    String oldPassword;

    public UpdateUserRequest() {
    }

    public UpdateUserRequest(User user, String oldPassword) {
        this.user = user;
        this.oldPassword = oldPassword;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }
}
