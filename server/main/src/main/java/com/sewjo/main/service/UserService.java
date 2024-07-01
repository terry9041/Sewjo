package com.sewjo.main.service;

import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import com.sewjo.main.models.LoginUser;
import com.sewjo.main.models.User;
import com.sewjo.main.repositories.UserRepository;

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
        if (!newUser.getPassword().equals(newUser.getConfirm())) {
            result.rejectValue("confirm", "matches", "Your passwords must match!");
        }
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

    public void update(User u) {
        userRepo.save(u);
    }
}