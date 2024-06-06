package com.example.demo.service;

import com.example.demo.models.Comment;
import com.example.demo.models.Employee;
import com.example.demo.models.User;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class CommentService {
    private final CommentRepository commentRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, EmployeeRepository employeeRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    public List<Comment> getCommentsByEmployee(String registrationNumber) {
        return commentRepository.findByEmployeeTo_RegistrationNumberOrderByDateDesc(registrationNumber);
    }

    public Comment addFeedback(Comment comment) {
        Employee managedEmployee = employeeRepository.findById(comment.getEmployeeTo().getId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));

        User managedUser = userRepository.findById(comment.getUserFrom().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        comment.setEmployeeTo(managedEmployee);
        comment.setUserFrom(managedUser);

        comment.setEmployeeTo(managedEmployee);
        return commentRepository.save(comment);
    }

    public Integer countCommentByEmployee(String registrationNumber) {
        return commentRepository.countCommentByEmployeeTo_RegistrationNumber(registrationNumber);
    }
}
