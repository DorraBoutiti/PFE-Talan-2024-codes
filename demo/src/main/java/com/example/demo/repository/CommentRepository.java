package com.example.demo.repository;

import com.example.demo.models.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByEmployeeTo_RegistrationNumberOrderByDateDesc(String registrationNumber);

    Integer countCommentByEmployeeTo_RegistrationNumber(String registrationNumber);
}
