package com.example.demo.controller;

import com.example.demo.config.JwtService;
import com.example.demo.models.Role;
import com.example.demo.models.Status;
import com.example.demo.models.User;
import com.example.demo.request.LoginRequest;
import com.example.demo.response.AuthResponse;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CustomerUserDetailsService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private CustomerUserDetailsService customerUserDetails;

    @PostMapping("/signup") // /auth/signup
    public User createUser(@RequestBody User user) throws Exception {
        User isExist = userRepository.findByRegistrationNumber(user.getRegistrationNumber());
        if(isExist != null) {
            throw new Exception("this registration number is already with another account");
        }
        User newUser = new User();
        newUser.setRegistrationNumber(user.getRegistrationNumber());
        newUser.setEmail(user.getEmail());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setDescription(user.getDescription());
        newUser.setRole(user.getRole());
        newUser.setStatus(Status.PENDING);
        //newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userService.registerUser(newUser);

        /*Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getRegistrationNumber(), savedUser.getPassword());
        String token = JwtService.generateToken(authentication);
        return new AuthResponse(token, "Register Success");*/
        return savedUser;
    }

    @PostMapping("/signin") // /auth/signin
    public AuthResponse signin(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticate(loginRequest.getRegistrationNumber(), loginRequest.getPassword());
        String token = JwtService.generateToken(authentication);
        return new AuthResponse(token, "Login Success");
    }

    private Authentication authenticate(String registrationNumber, String password) {
        UserDetails userDetails = customerUserDetails.loadUserByUsername(registrationNumber);
        if(userDetails==null) {
            throw new BadCredentialsException("invalid username");
        }
        System.out.println(password);
        System.out.println(userDetails.getPassword());
        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("password not matched");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
