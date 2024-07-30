package com.sewjo.main.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sewjo.main.dto.PatternDTO;
import com.sewjo.main.service.PatternService;
import com.sewjo.main.service.UserService;

import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/pattern")
public class PatternControllerAPI {

    @Autowired
    private PatternService patternService;

    @Autowired
    private UserService userServ;

    @Transactional
    @GetMapping("/all")
    public ResponseEntity<?> getAllPatterns(HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        try {
            List<PatternDTO> patterns = patternService.findAll(userId);
            return ResponseEntity.ok(patterns);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }

    @Transactional
    @GetMapping("/{id}")
    public ResponseEntity<?> getPatternById(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        PatternDTO pattern = patternService.findById(id, userId);
        if (pattern == null) {
            return ResponseEntity.status(404).body("Pattern not found");
        }
        return ResponseEntity.ok(pattern);
    }

    @PostMapping(value = "/create", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> createPattern(@RequestParam("name") String name,
                                           @RequestParam("brand") List<String> brand,
                                           @RequestParam("description") String description,
                                           @RequestParam("patternType") String patternType,
                                           @RequestParam("format") String format,
                                           @RequestParam("difficulty") Integer difficulty,
                                           @RequestParam("tags") List<String> tags,
                                           @RequestParam("releaseDate") String releaseDate,
                                           @RequestParam("free") Boolean free,
                                           @RequestParam("outOfPrint") Boolean outOfPrint,
                                           @RequestParam(value = "image", required = false) MultipartFile imageFile,
                                           @RequestParam("ageGroups") List<String> ageGroups,
                                           @RequestParam("bodyType") String bodyType,
                                           @RequestParam("sizeRange") String sizeRange,
                                           @RequestParam("cupSizes") List<Character> cupSizes,
                                           @RequestParam("bustMin") Double bustMin,
                                           @RequestParam("bustMax") Double bustMax,
                                           @RequestParam("hipMin") Double hipMin,
                                           @RequestParam("hipMax") Double hipMax,
                                           @RequestParam("isImperial") Boolean isImperial,
                                           @RequestParam("supplies") List<String> supplies,
                                           HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");

        try {
            Date parsedReleaseDate = parseDate(releaseDate);
            PatternDTO patternDTO = patternService.storePattern(name, brand, description, patternType, format, difficulty,
                    tags, parsedReleaseDate, free, outOfPrint, imageFile, ageGroups, bodyType, sizeRange, cupSizes, bustMin,
                    bustMax, hipMin, hipMax, isImperial, supplies, userId);
            return ResponseEntity.status(200).body(patternDTO);
        } catch (IOException | ParseException e) {
            return ResponseEntity.status(500).body("Failed to upload pattern: " + e.getMessage());
        }
    }

    @PutMapping(value = "/update/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updatePattern(@PathVariable Long id,
                                           @RequestParam("name") String name,
                                           @RequestParam("brand") List<String> brand,
                                           @RequestParam("description") String description,
                                           @RequestParam("patternType") String patternType,
                                           @RequestParam("format") String format,
                                           @RequestParam("difficulty") Integer difficulty,
                                           @RequestParam("tags") List<String> tags,
                                           @RequestParam("releaseDate") String releaseDate,
                                           @RequestParam("free") Boolean free,
                                           @RequestParam("outOfPrint") Boolean outOfPrint,
                                           @RequestParam(value = "image", required = false) MultipartFile imageFile,
                                           @RequestParam("ageGroups") List<String> ageGroups,
                                           @RequestParam("bodyType") String bodyType,
                                           @RequestParam("sizeRange") String sizeRange,
                                           @RequestParam("cupSizes") List<Character> cupSizes,
                                           @RequestParam("bustMin") Double bustMin,
                                           @RequestParam("bustMax") Double bustMax,
                                           @RequestParam("hipMin") Double hipMin,
                                           @RequestParam("hipMax") Double hipMax,
                                           @RequestParam("isImperial") Boolean isImperial,
                                           @RequestParam("supplies") List<String> supplies,
                                           HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        PatternDTO existingPattern = patternService.findById(id, userId);
        if (existingPattern == null) {
            return ResponseEntity.status(404).body("Pattern not found");
        }

        try {
            Date parsedReleaseDate = parseDate(releaseDate);
            PatternDTO patternDTO = patternService.updatePattern(id, name, brand, description, patternType, format, difficulty,
                    tags, parsedReleaseDate, free, outOfPrint, imageFile, ageGroups, bodyType, sizeRange, cupSizes, bustMin,
                    bustMax, hipMin, hipMax, isImperial, supplies, userId);
            return ResponseEntity.ok(patternDTO);
        } catch (IOException | ParseException e) {
            return ResponseEntity.status(500).body("Failed to update pattern: " + e.getMessage());
        }
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

    private Date parseDate(String date) throws ParseException {
        if (date == null || date.isEmpty()) {
            return null;
        }
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        return dateFormat.parse(date);
    }
}
