package com.sewjo.main.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;

import com.sewjo.main.models.Pattern;
import com.sewjo.main.service.PatternService;
import com.sewjo.main.service.UserService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/pattern")
public class PatternControllerAPI {

    @Autowired
    private PatternService patternService;

    @Autowired
    private UserService userServ;

    @GetMapping("/all")
    public ResponseEntity<?> getAllPatterns(HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        List<Pattern> patterns = patternService.findAll(userId);
        return ResponseEntity.ok(patterns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPatternById(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        Pattern pattern = patternService.findById(id, userId);
        if (pattern == null) {
            return ResponseEntity.status(404).body("Pattern not found");
        }
        return ResponseEntity.ok(pattern);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPattern(@RequestBody @Valid Pattern pattern, BindingResult result, HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        pattern.setUser(userServ.findById(userId)); // Assume userServ is available to get the user

        Pattern savedPattern = patternService.save(pattern, result);
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        return ResponseEntity.ok(savedPattern);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePattern(@PathVariable Long id, @RequestBody @Valid Pattern pattern, BindingResult result, HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        Pattern existingPattern = patternService.findById(id, userId);
        if (existingPattern == null) {
            return ResponseEntity.status(404).body("Pattern not found");
        }

        pattern.setId(id);
        pattern.setUser(existingPattern.getUser());

        Pattern updatedPattern = patternService.update(pattern, result);
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        return ResponseEntity.ok(updatedPattern);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePattern(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        boolean isDeleted = patternService.deleteById(id, userId);
        if (!isDeleted) {
            return ResponseEntity.status(404).body("Pattern not found or you do not have permission to delete it");
        }
        return ResponseEntity.ok("Pattern deleted successfully");
    }
}
