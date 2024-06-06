package com.example.demo.service;

import com.example.demo.config.JwtService;
import com.example.demo.controller.NotificationController;
import com.example.demo.email.EmailService;
import com.example.demo.models.*;
import com.example.demo.exceptions.UserException;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.request.UpdateUserRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UserServiceImplementation implements UserService {
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmployeeRepository employeeRepository;

    private final NotificationController notificationController;
    private final EmailService emailService;

    UserServiceImplementation(UserRepository userRepository, NotificationService notificationService, NotificationController notificationController, EmailService emailService, EmployeeRepository employeeRepository) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.notificationController = notificationController;
        this.employeeRepository = employeeRepository;
        this.emailService = emailService;
    }

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public User registerUser(User user) throws UserException {
        Optional<User> userByEmail = userRepository.findByEmail(user.getEmail());

        if (userByEmail.isPresent()) {
            throw new UserException("Email already exists: " + user.getEmail());
        }

        User newUser = new User();

        if(user.getRole() == Role.MANAGER) {
            Employee employee = employeeRepository.findEmployeeByRegistrationNumber(user.getRegistrationNumber());
            if (employee == null) {
                throw new UserException("Manager not exist: " + user.getRegistrationNumber());
            }
            newUser.setRegistrationNumber(employee.getRegistrationNumber());
            newUser.setBusinessUnit(employee.getBusinessUnit());
        } else {
            newUser.setRegistrationNumber(user.getRegistrationNumber());
        }

        newUser.setEmail(user.getEmail());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setDescription(user.getDescription());
        newUser.setDateSendingRequest(new Date(System.currentTimeMillis()));
        // newUser.setPassword(user.getPassword());
        newUser.setRole(user.getRole());
        newUser.setStatus(Status.PENDING);

        List<User> admins = userRepository.findByRole(Role.HR_DIRECTOR);

        for (User admin : admins) {
            Notification notification = new Notification();
            notification.setDelivered(false);
            notification.setContent(newUser.getFirstName() + " " + newUser.getLastName() + " a envoyé une demande d'accès");
            notification.setNotificationType(NotificationType.ACCESS);
            notification.setUserFrom(newUser);
            notification.setUserTo(admin);
            notification.setDate(new Date());

            notificationService.createNotificationStorage(notification);

            List<Notification> notifications = notificationService.getNotificationsByUserIDNotRead(admin.getId());
            Integer count = notificationService.countByUserToIdAndReadFalse((admin.getId()));

            notificationController.dispatchEventToSpecificUser(notifications, count);
        }

        return userRepository.save(newUser);
    }

    @Override
    public User findUserById(Integer userId) throws UserException {

        Optional<User> user = userRepository.findById(userId);

        if(user.isPresent()) {
            return user.get();
        }

        throw new UserException("user not exist with userid " + userId);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).get();
    }

    @Override
    public List<User> findUsersWithoutPassword() {
        return userRepository.findByStatus(Status.PENDING);
    }

    @Override
    public List<User> findByStatusAndIdNot(Integer userID) {
        return userRepository.findByStatusAndIdNot(Status.ACTIVE, userID);
    }

    /*@Override
    public void updateUser(UpdateUserRequest updateUserRequest, Integer userId) throws UserException {

        Optional<User> user1 = userRepository.findById(userId);

        if (user1.isEmpty()) {
            throw new UserException("user not exit with id " + userId);
        }

        User oldUser = user1.get();

        if (updateUserRequest.getUser().getFirstName() != null) {
            oldUser.setFirstName(updateUserRequest.getUser().getFirstName());
        }
        if (updateUserRequest.getUser().getLastName() != null) {
            oldUser.setLastName(updateUserRequest.getUser().getLastName());
        }
        System.out.println(oldUser.getPassword());
        System.out.println(updateUserRequest.getOldPassword());

        if (passwordEncoder.matches(updateUserRequest.getOldPassword(), oldUser.getPassword())) {
            System.out.println("parfait");
            oldUser.setPassword(passwordEncoder.encode(updateUserRequest.getOldPassword())); // new pwd
        }
        if (oldUser.getStatus().equals(Status.ACTIVE)) {
            userRepository.save(oldUser);
        }
    }*/

    @Override
    public void updateUserProfile(UpdateUserRequest user, Integer userId) throws UserException {

        Optional<User> user1 = userRepository.findById(userId);

        if (user1.isEmpty()) {
            throw new UserException("user not exit with id " + userId);
        }

        User oldUser = user1.get();

        if (user.getUser().getFirstName() != null) {
            oldUser.setFirstName(user.getUser().getFirstName());
        }
        if (user.getUser().getLastName() != null) {
            oldUser.setLastName(user.getUser().getLastName());
        }

        System.out.println(user.getOldPassword());
        System.out.println(oldUser.getPassword());

        System.out.println(oldUser.getStatus());
        System.out.println(Status.ACTIVE);

        if (passwordEncoder.matches(user.getOldPassword(), oldUser.getPassword()) && oldUser.getStatus().equals(Status.ACTIVE)) {
            userRepository.save(oldUser);
        }
    }

    @Override
    public void updateUserEmail(UpdateUserRequest user, Integer userId) throws UserException {

        Optional<User> user1 = userRepository.findById(userId);

        if (user1.isEmpty()) {
            throw new UserException("user not exit with id " + userId);
        }

        User oldUser = user1.get();

        if (user.getUser().getEmail() != null) {
            oldUser.setEmail(user.getUser().getEmail());
        }

        if (passwordEncoder.matches(user.getOldPassword(), oldUser.getPassword()) && oldUser.getStatus().equals(Status.ACTIVE)) {
            userRepository.save(oldUser);
        }
    }
    @Override
    public void updateUserPassword(UpdateUserRequest updateUserRequest, Integer userId) throws UserException {

        Optional<User> user1 = userRepository.findById(userId);

        if (user1.isEmpty()) {
            throw new UserException("user not exit with id " + userId);
        }

        User oldUser = user1.get();

        if (passwordEncoder.matches(updateUserRequest.getOldPassword(), oldUser.getPassword())) {
            oldUser.setPassword(passwordEncoder.encode(updateUserRequest.getUser().getPassword()));
        }
        if (oldUser.getStatus().equals(Status.ACTIVE)) {
            userRepository.save(oldUser);
        }
    }

    @Override
    public void rejectUser(Integer userId) throws UserException {

        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            throw new UserException("user not exit with id " + userId);
        }

        User oldUser = user.get();
        oldUser.setPassword(null);
        oldUser.setStatus(Status.REJECTED);

        userRepository.save(oldUser);
        emailService.sendEmailReject(oldUser.getEmail(), "Demande refusé", oldUser.getFirstName());
    }

    @Override
    public void disableUserAccount(Integer userId) throws UserException {

        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            throw new UserException("user not exit with id " + userId);
        }

        User oldUser = user.get();
        oldUser.setPassword(null);
        oldUser.setStatus(Status.DISABLED);

        userRepository.save(oldUser);
        emailService.sendEmailDisabledAccount(oldUser.getEmail(), "Compte désactivé", oldUser.getFirstName());
    }

    @Override
    public List<User> searchUser(String query) {
        return userRepository.searchUser(query);
    }

    @Override
    public User findUserByJwt(String jwt) {
        String registrationNumber = JwtService.getRegistrationNumberFromJwtToken(jwt);
        return userRepository.findByRegistrationNumber(registrationNumber);
    }

    @Transactional
    @Override
    public User addUser(User user) throws UserException {

        Optional<User> userByEmail = userRepository.findByEmail(user.getEmail());
        Optional<User> userByRegisterNumber = userRepository.findByEmail(user.getRegistrationNumber());

        if (userByEmail.isEmpty()) {
            if (userByRegisterNumber.isEmpty()) {
                User newUser = new User();
                newUser.setRegistrationNumber(user.getRegistrationNumber());
                newUser.setEmail(user.getEmail());
                newUser.setFirstName(user.getFirstName());
                newUser.setLastName(user.getLastName());
                //newUser.setPassword(user.getPassword());
                newUser.setRole(user.getRole());
                newUser.setStatus(Status.ACTIVE);

                newUser.setPassword(emailService.alphaNumericString(8));
                emailService.sendAddUserEmail(user.getEmail(), "Bienvenue sur Smart Compensation Management - Votre compte a été créé !", newUser.getRegistrationNumber(), user.getRole(), newUser.getPassword());
                newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
                newUser.setStatus(Status.ACTIVE);
                return userRepository.save(newUser);
            } else {
                throw new UserException("registerNumber exist : " + user.getRegistrationNumber());
            }
        } else {
            throw new UserException("email exist : " + user.getEmail());
        }
    }

    @Override
    public void sendNotificationsExitRisk(Employee employee) throws UserException {
        List<User> admins = userRepository.findByRole(Role.HR_DIRECTOR);

        // Vérification si la liste des administrateurs est vide
        if (admins.isEmpty()) {
            throw new UserException("No HR Directors found");
        }

        for (User admin : admins) {
            Notification notification = new Notification();
            notification.setDelivered(false);
            notification.setContent("L'employé ayant le matricule " + employee.getRegistrationNumber() + " présente un risque de départ");
            notification.setNotificationType(NotificationType.CHURN);
            notification.setUserFrom(admin); // Assure que 'employee' est de type 'User' ou adapté ici
            notification.setUserTo(admin);
            notification.setDate(new Date());

            notificationService.createNotificationStorage(notification);

            List<Notification> notifications = notificationService.getNotificationsByUserIDNotRead(admin.getId());
            Integer count = notificationService.countByUserToIdAndReadFalse(admin.getId());

            notificationController.dispatchEventToSpecificUser(notifications, count);
        }
    }

}