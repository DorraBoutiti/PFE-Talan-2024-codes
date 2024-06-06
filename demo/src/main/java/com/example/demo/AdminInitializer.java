package com.example.demo;

import com.example.demo.models.Role;
import com.example.demo.models.Status;
import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.test.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;

@Component
public class AdminInitializer implements ApplicationRunner {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.findByRegistrationNumber("111DATA000") == null) {
            User admin = new User();
            admin.setRegistrationNumber("111DATA000");
            admin.setPassword(passwordEncoder.encode("ons111"));
            admin.setRole(Role.HR_DIRECTOR);
            admin.setStatus(Status.ACTIVE);
            admin.setFirstName("Foulen");
            admin.setLastName("Ben Foulen");
            userRepository.save(admin);
        }
    }
}
