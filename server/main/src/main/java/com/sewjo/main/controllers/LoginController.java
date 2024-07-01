package com.sewjo.main.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.sewjo.main.models.LoginUser;
import com.sewjo.main.models.User;
import com.sewjo.main.service.UserService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;


@Controller
public class LoginController {
    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    private UserService userServ;

    // @GetMapping("/checkDbConnection")
    // public String checkDbConnection() {
    //     boolean isConnected = userServ.checkDatabaseConnection();
    //     if (isConnected) {
    //         // Handle successful connection
    //         return "redirect:/login";
    //     } else {
    //         // Handle failed connection
    //         return "errorPage"; // Redirect to an error page or handle accordingly
    //     }
    // }

    @GetMapping("/")
    public String index(Model model, HttpSession session) {
        if (session.getAttribute("id") != null) {
            return "redirect:/dashboard";
        }
        model.addAttribute("newLogin", new LoginUser());
        return "login";
    }

    @PostMapping("/sendLogin")
    public String login(@ModelAttribute("newLogin") LoginUser newLogin,
            BindingResult result, Model model, HttpSession session) {
        User user = null;
        try {
            user = userServ.login(newLogin, result);
        } catch (Exception e) {
            logger.error("Login error: {}", e.getMessage());
            model.addAttribute("errorMessage", "An unexpected error occurred. Please try again later.");
            return "error";
        }

        if (result.hasErrors()) {
            result.getAllErrors().forEach(error -> {
                logger.error("Error: {}", error.getDefaultMessage());
            });

            model.addAttribute("newUser", new User());
            model.addAttribute("errors", result.getAllErrors());
            return "loginError"; // Redirect back to the login page with errors
        }

        session.setAttribute("id", user.getId());
        return "redirect:/dashboard";
    }

    @GetMapping("/registrationPage")
    public String showRegistrationPage(Model model, HttpSession session) {

        model.addAttribute("newUser", new User());
        return "register";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("newUser") User newUser,
            BindingResult result, Model model, HttpSession session) {

        User user = userServ.register(newUser, result);

        if (result.hasErrors()) {
            model.addAttribute("newLogin", new LoginUser());
            model.addAttribute("errors", result.getAllErrors());
            return "errorInRegister";
        }

        session.setAttribute("id", user.getId());

        return "redirect:/dashboard";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model, HttpSession session) {
        if (session.getAttribute("id") == null) {
            return "redirect:/";
        }
        model.addAttribute("user", userServ.findById((Long) session.getAttribute("id")));
        model.addAttribute("sessionId", session.getAttribute("id")); // Add session ID to the model
        return "dashboard";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }

    @GetMapping("/edit")
    public String showEditProfileForm(Model model, HttpSession session) {
        Long userId = (Long) session.getAttribute("id");

        if (userId == null) {
            return "redirect:/login";
        }

        User user = userServ.findById(userId);
        if (user == null) {
            return "redirect:/error";
        }

        model.addAttribute("user", user);
        return "editProfile";
    }

    @PostMapping("/edit")
    public String editProfile(@Valid @ModelAttribute("user") User updatedUser,
        BindingResult result, Model model, HttpSession session) {

        if (result.hasErrors()) {
        model.addAttribute("errors", result.getAllErrors());
        return "editProfile";
        }

        User user = userServ.findById((long)session.getAttribute("id"));
        if (user == null) {
        return "redirect:/error";
        }

        user.setUserName(updatedUser.getUserName());
        user.setEmail(updatedUser.getEmail());
        user.setPassword(updatedUser.getPassword());

        userServ.updateUser(user);

        return "redirect:/dashboard";
    }
}
    

