package com.sewjo.main.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;

import com.sewjo.main.models.Fabric;
import com.sewjo.main.service.FabricService;
import com.sewjo.main.service.UserService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/fabric")
public class FabricControllerAPI {

    @Autowired
    private FabricService fabricService;

    @Autowired
    private UserService userServ;

    @GetMapping("/all")
    public ResponseEntity<?> getAllFabrics(HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        List<Fabric> fabrics = fabricService.findAll(userId);
        return ResponseEntity.ok(fabrics);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFabricById(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        Fabric fabric = fabricService.findById(id, userId);
        if (fabric == null) {
            return ResponseEntity.status(404).body("Fabric not found");
        }
        return ResponseEntity.ok(fabric);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createFabric(@RequestBody @Valid Fabric fabric, BindingResult result, HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        fabric.setUser(userServ.findById(userId)); // Assume userServ is available to get the user

        Fabric savedFabric = fabricService.save(fabric, result);
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        return ResponseEntity.ok(savedFabric);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateFabric(@PathVariable Long id, @RequestBody @Valid Fabric fabric, BindingResult result, HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        Fabric existingFabric = fabricService.findById(id, userId);
        if (existingFabric == null) {
            return ResponseEntity.status(404).body("Fabric not found");
        }

        fabric.setId(id);
        fabric.setUser(existingFabric.getUser());

        Fabric updatedFabric = fabricService.update(fabric, result);
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        return ResponseEntity.ok(updatedFabric);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFabric(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        boolean isDeleted = fabricService.deleteById(id, userId);
        if (!isDeleted) {
            return ResponseEntity.status(404).body("Fabric not found or you do not have permission to delete it");
        }
        return ResponseEntity.ok("Fabric deleted successfully");
    }
}
