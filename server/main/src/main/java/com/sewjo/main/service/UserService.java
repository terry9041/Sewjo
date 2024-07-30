package com.sewjo.main.service;

import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import com.sewjo.main.models.User;
import com.sewjo.main.models.LoginUser;
import com.sewjo.main.repositories.UserRepository;
import com.sewjo.main.dto.ChangePasswordDTO;
import com.sewjo.main.dto.UserDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    public boolean checkDatabaseConnection() {
        try {
            userRepo.count(); // Simple query to check the database connection
            return true; // Connection is okay
        } catch (Exception e) {
            return false; // Connection failed
        }
    }

    public User register(User newUser, BindingResult result) {
        Optional<User> dupe = userRepo.findByEmail(newUser.getEmail());
        if (dupe.isPresent()) {
            result.rejectValue("email", "taken", "That email is already taken!");
        }
        // if (!newUser.getPassword().equals(newUser.getConfirm())) {
        //     result.rejectValue("confirm", "matches", "Your passwords must match!");
        // }
        if (result.hasErrors()) {
            return null;
        }
        newUser.setPassword(BCrypt.hashpw(newUser.getPassword(), BCrypt.gensalt()));
        userRepo.save(newUser);

        return newUser;
    }

    public User login(LoginUser newLoginObject, BindingResult result) {
        Optional<User> u = userRepo.findByEmail(newLoginObject.getEmail());
        if (!u.isPresent()) {
            String errorMessage = "Email " + newLoginObject.getEmail() + " is invalid!";
            result.rejectValue("email", "invalid", errorMessage);
            return null;
        }
        if (!BCrypt.checkpw(newLoginObject.getPassword(), u.get().getPassword())) {
            result.rejectValue("password", "matches", "Password is incorrect!");
            return null;
        }
        return u.get();
    }

    public User findById(Long id) {
        Optional<User> u = userRepo.findById(id);
        if (!u.isPresent()) {
            return null;
        }
        return u.get();
    }

    // Method to convert User entity to UserDTO
    public UserDTO convertToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUserName(user.getUserName());
        userDTO.setEmail(user.getEmail());
        // Set other fields if necessary
        return userDTO;
    }

    public User changePassword(Long userId, ChangePasswordDTO dto, BindingResult result) {
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            result.rejectValue("confirmPassword", "matches", "Passwords must match!");
            return null;
        }
        System.out.println("about to find ther user");
        Optional<User> optionalUser = userRepo.findById(userId);
        System.out.println("found ther user");
        if (!optionalUser.isPresent()) {
            result.rejectValue("userId", "notFound", "User not found!");
            return null;
        }

        User user = optionalUser.get();

        user.setPassword(BCrypt.hashpw(dto.getNewPassword(), BCrypt.gensalt()));
        userRepo.save(user);

        return user;
    }
}