package com.example.demo.controller;
import java.util.List;
import java.util.Random;

import com.example.demo.config.JwtService;
import com.example.demo.exceptions.UserException;
import com.example.demo.models.Employee;
import com.example.demo.models.Role;
import com.example.demo.models.Status;
import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.email.EmailService;
import com.example.demo.request.UpdateUserRequest;
import com.example.demo.response.AuthResponse;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;
    @Autowired
    EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/api/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/api/users/without-password")
    public List<User> getUsersWithoutPassword() {
        return userService.findUsersWithoutPassword();
    }

    @GetMapping("/api/users/active/{userID}")
    public List<User> getActiveUsers(@PathVariable Integer userID) {
        return userService.findByStatusAndIdNot(userID);
    }

    @PostMapping("/api/users/access/{userId}")
    public User provideAccessForUser(@PathVariable("userId") Integer id) throws Exception {
        User user = userService.findUserById(id);
        user.setPassword(emailService.alphaNumericString(8));
        emailService.sendEmail(user.getEmail(), "Activation de votre compte sur Smart Compensation Toolbox", user.getRegistrationNumber(), user.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(Status.ACTIVE);
        userRepository.save(user);
        return user;
    }

    @GetMapping("/api/users/{userId}")
    public User getUserById(@PathVariable("userId") Integer id) throws Exception {
        return userService.findUserById(id);
    }

    @GetMapping("/api/users/email/{email}")
    public User getUserByEmail(@PathVariable("email") String email) throws Exception {
        return userService.findUserByEmail(email);
    }

    @PutMapping("/api/users")
    public void updateUser(@RequestHeader("Authorization") String jwt, @RequestBody UpdateUserRequest user) throws Exception {
        User reqUser = userService.findUserByJwt(jwt);
        userService.updateUserProfile(user, reqUser.getId());
    }

    @PutMapping("/api/users/email")
    public void updateUserEmail(@RequestHeader("Authorization") String jwt, @RequestBody UpdateUserRequest user) throws Exception {
        User reqUser = userService.findUserByJwt(jwt);
        userService.updateUserEmail(user, reqUser.getId());
    }

    @PutMapping("/api/users/password")
    public void updateUserPassword(@RequestHeader("Authorization") String jwt, @RequestBody UpdateUserRequest user) throws Exception {
        User reqUser = userService.findUserByJwt(jwt);
        userService.updateUserPassword(user, reqUser.getId());
    }

    /*@GetMapping("/users/search")
    public List<User> searchUser(@RequestParam("query") String query){
        List<User> users = userService.searchUser(query);
        return users;
    }*/

    @GetMapping("/api/users/profile")
    public User getUserFromToken(@RequestHeader("Authorization") String jwt) {
        //System.out.println("jwt --- " + jwt);
        //user.setPassword(null);
        return userService.findUserByJwt(jwt);
    }

    @PutMapping("/api/users/reject/{id}")
    public void RejectUserById(@RequestHeader("Authorization") String jwt, @PathVariable(name = "id") Integer userId) throws UserException {
        userService.rejectUser(userId);
    }

    @PutMapping("/api/users/disable/{id}")
    public void disableUserAccount(@PathVariable(name = "id") Integer userId) throws UserException {
        userService.disableUserAccount(userId);
    }

    @PostMapping("/api/users/add")
    public User createUser(@RequestBody User user) throws Exception {
        return userService.addUser(user);
    }

    @PostMapping("/exit-risk")
    public void sendNotificationsExitRisk(@RequestBody Employee employee) throws UserException {
        userService.sendNotificationsExitRisk(employee);
    }
}