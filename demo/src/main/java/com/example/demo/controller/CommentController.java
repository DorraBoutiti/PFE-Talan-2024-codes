package com.example.demo.controller;

import com.example.demo.models.Comment;
import com.example.demo.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequestMapping("/api/comment")
@RestController
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/{registrationNumber}")
    public ResponseEntity<List<Comment>> getCommentsByEmployee(@PathVariable String registrationNumber) {
        return ResponseEntity.ok(commentService.getCommentsByEmployee(registrationNumber));
    }

    @PostMapping("/new")
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment) {
        Comment savedComment = commentService.addFeedback(comment);
        return ResponseEntity.ok(savedComment);
    }

    @GetMapping("/employee-count/{registrationNumber}")
    public ResponseEntity<Integer> commentCountByEmployee(@PathVariable String registrationNumber) {
        Integer count = commentService.countCommentByEmployee(registrationNumber);
        return ResponseEntity.ok(count);
    }
}
