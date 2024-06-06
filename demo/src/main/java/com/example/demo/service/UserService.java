package com.example.demo.service;

import com.example.demo.models.Employee;
import com.example.demo.models.Status;
import com.example.demo.models.User;
import com.example.demo.exceptions.UserException;
import com.example.demo.request.UpdateUserRequest;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface UserService {

    User registerUser(User user) throws UserException;

    User addUser(User user) throws UserException;

    User findUserById(Integer userId) throws UserException;

    User findUserByEmail(String email);

    List<User> findUsersWithoutPassword();

    //public void updateUser(UpdateUserRequest user, Integer userId) throws UserException;

    List<User> searchUser(String query);

    User findUserByJwt(String jwt);

    void updateUserPassword(UpdateUserRequest updateUserRequest, Integer userId) throws UserException;

    void updateUserProfile(UpdateUserRequest user, Integer userId) throws UserException;

    void updateUserEmail(UpdateUserRequest user, Integer userId) throws UserException;

    void disableUserAccount(Integer userId) throws UserException;

    void rejectUser(Integer userId) throws UserException;

    List<User> findByStatusAndIdNot(Integer userID);

    void sendNotificationsExitRisk(Employee employee) throws UserException;
}
