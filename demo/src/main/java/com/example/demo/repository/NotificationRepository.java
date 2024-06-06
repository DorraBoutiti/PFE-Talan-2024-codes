package com.example.demo.repository;

import com.example.demo.models.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    //Optional<Notification> findById(Integer id);
    List<Notification> findByUserToIdOrderByDateDesc(Integer id);
    Page<Notification> findByUserToIdOrderByDateDesc(Integer id, Pageable pageable);
    List<Notification> findByUserToIdAndDeliveredFalse(Integer id);
    List<Notification> findByUserToIdAndReadFalseOrderByDateDesc(Integer id);
    Integer countByUserToIdAndReadFalse(Integer id);
}
