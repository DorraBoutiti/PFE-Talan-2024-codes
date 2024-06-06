package com.example.demo.repository;

import com.example.demo.models.Role;
import com.example.demo.models.Status;
import com.example.demo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    User findByRegistrationNumber(String registrationNumber);

    /*@Query("SELECT u FROM User u WHERE u.status != 'REJECTED' AND (u.password IS NULL OR u.password = ''"))
    List<User> findUsersWithoutPassword();*/

    List<User> findByStatus(Status status);
    List<User> findByStatusAndIdNot(Status status, Integer id);
    List<User> findByRole(Role role);

    @Query("select u from User u where u.firstName LIKE %:query% OR u.lastName LIKE %:query% OR u.email LIKE %:query%")
    List<User> searchUser(@Param("query") String query);
}
