package com.example.demo.request;

public class LoginRequest {
    private String registrationNumber;
    private String password;

    public LoginRequest() {
    }
    public LoginRequest(String registrationNumber, String password) {
        super();
        this.registrationNumber = registrationNumber;
        this.password = password;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
