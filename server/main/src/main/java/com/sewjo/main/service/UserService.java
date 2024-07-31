package com.sewjo.main.service;

import java.io.IOException;
import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import com.sewjo.main.models.User;
import com.sewjo.main.models.Image;
import com.sewjo.main.models.LoginUser;
import com.sewjo.main.repositories.UserRepository;
import com.sewjo.main.dto.ChangePasswordDTO;
import com.sewjo.main.dto.UserDTO;
import org.springframework.web.multipart.MultipartFile;

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
        // result.rejectValue("confirm", "matches", "Your passwords must match!");
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
        userDTO.setImageId(user.getImage() != null ? user.getImage().getId() : null);
        // Set other fields if necessary
        return userDTO;
    }

    public User changePassword(Long userId, ChangePasswordDTO dto, BindingResult result) {
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            result.rejectValue("confirmPassword", "matches", "Passwords must match!");
            return null;
        }

        Optional<User> optionalUser = userRepo.findById(userId);
        System.out.println("found ther user");
        if (!optionalUser.isPresent()) {
            result.rejectValue("userId", "notFound", "User not found!");
            return null;
        }

        User user = optionalUser.get();

        System.out.println("Old password provided: " + dto.getOldPassword());
        System.out.println("Stored hashed password: " + user.getPassword());
        if (!BCrypt.checkpw(dto.getOldPassword(), user.getPassword())) {
            result.rejectValue("password", "matches", "Password is incorrect!");
            return null;
        }

        user.setConfirm(dto.getConfirmPassword());
        user.setPassword(BCrypt.hashpw(dto.getNewPassword(), BCrypt.gensalt()));
        userRepo.save(user);

        return user;
    }

    public UserDTO changeProfileImage(UserDTO userDTO, MultipartFile imageFile,
            Long userId) throws IOException {
        Optional<User> optionalUser = userRepo.findById(userDTO.getId());
        if (!optionalUser.isPresent() || !optionalUser.get().getId().equals(userId)) {
            throw new IllegalArgumentException("User not found or unauthorized");
        }

        User existingUser = optionalUser.get();
        if (imageFile != null && !imageFile.isEmpty()) {
            Image image = new Image();
            image.setName(imageFile.getOriginalFilename());
            image.setData(imageFile.getBytes());
            existingUser.setImage(image);
            System.out.println(imageFile.getBytes());
        }
        existingUser.setConfirm(existingUser.getPassword());
        userRepo.save(existingUser);
        return convertToDTO(existingUser);
    }
}