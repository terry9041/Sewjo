package com.sewjo.main.controllers;

import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;
import java.io.IOException;

import com.sewjo.main.dto.ChangePasswordDTO;
import com.sewjo.main.dto.UserDTO;
import com.sewjo.main.models.LoginUser;
import com.sewjo.main.models.User;
import com.sewjo.main.service.UserService;

import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controller for handling login and registration requests for the API
 */
@RestController
@RequestMapping("/api/user")
public class LoginControllerAPI {
    private static final Logger logger = LoggerFactory.getLogger(LoginControllerAPI.class);

    @Autowired
    private UserService userServ;

    @Transactional
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginUser newLogin,
            BindingResult result, HttpSession session, HttpServletResponse response) {
        User user;
        try {
            user = userServ.login(newLogin, result);
        } catch (Exception e) {
            logger.error("Login error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("An unexpected error occurred. Please try again later.");
        }

        if (result.hasErrors()) {
            result.getAllErrors().forEach(error -> logger.error("Error: {}", error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }

        session.setAttribute("id", user.getId());
        addSameSiteCookie(response, "JSESSIONID", session.getId(), true);

        UserDTO userDTO = userServ.convertToDTO(user);
        return ResponseEntity.ok(userDTO);
    }

    @Transactional
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid User newUser,
            BindingResult result, HttpSession session, HttpServletResponse response) {
        logger.info("Registering new user: {}", newUser.getEmail());
        User user = userServ.register(newUser, result);

        if (result.hasErrors()) {
            result.getAllErrors().forEach(error -> logger.error("Error: {}", error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }

        session.setAttribute("id", user.getId());
        addSameSiteCookie(response, "JSESSIONID", session.getId(), true);

        UserDTO userDTO = userServ.convertToDTO(user);
        return ResponseEntity.ok(userDTO);
    }

    @Transactional
    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User user = userServ.findById((Long) session.getAttribute("id"));
        UserDTO userDTO = userServ.convertToDTO(user);
        return ResponseEntity.ok(userDTO);
        // return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session, HttpServletResponse response) {
        if (session != null) {
            logger.info("Invalidating session for user id: {}", session.getAttribute("id"));
            session.invalidate();
            clearSameSiteCookie(response, "JSESSIONID");
            return ResponseEntity.ok("Logged out successfully");
        } else {
            logger.warn("Attempted to logout, but no session found.");
            return ResponseEntity.badRequest().body("No session found");
        }
    }

    private void addSameSiteCookie(HttpServletResponse response, String name, String value, boolean secure) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(secure);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(cookie);

        response.addHeader("Set-Cookie",
                String.format("%s=%s; Path=/; Max-Age=%d; HttpOnly; SameSite=None; %s",
                        name, value, 7 * 24 * 60 * 60, secure ? "Secure" : ""));
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(
            @RequestBody @Valid ChangePasswordDTO passwordDTO,
            BindingResult result,
            HttpSession session, HttpServletRequest request) {

        Long userId = (Long) session.getAttribute("id");
        if (userId == null) {

            return ResponseEntity.status(401).body("Unauthorized");
        }

        if (result.hasErrors()) {
            result.getAllErrors().forEach(error -> logger.error("Error: {}", error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        User user = userServ.changePassword(userId, passwordDTO, result);
        UserDTO userDTO = userServ.convertToDTO(user);
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/getProfileImage")
    public ResponseEntity<?> getProfileImage(HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userServ.findById((Long) session.getAttribute("id"));
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        return ResponseEntity.ok(user.getImage());
    }

    @PostMapping(value = "/changeProfileImage", consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> changeProfileImage(
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Long userId = (Long) session.getAttribute("id");
        UserDTO existingUser = userServ.convertToDTO(userServ.findById(userId));
        if (existingUser == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        UserDTO updatedUser;
        try {
            updatedUser = userServ.changeProfileImage(existingUser, imageFile, userId);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to update fabric image");
        }

        return ResponseEntity.ok(updatedUser);
    }

    private void clearSameSiteCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        response.addHeader("Set-Cookie",
                String.format("%s=; Path=/; Max-Age=0; HttpOnly; SameSite=None; Secure", name));
    }
}
