package com.sewjo.main.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sewjo.main.dto.PatternDTO;
import com.sewjo.main.service.PatternService;

import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.sewjo.main.models.PatternFabrics;

/**
 * Controller for handling pattern-related API requests
 */
@RestController
@RequestMapping("/api/pattern")
public class PatternControllerAPI {

    @Autowired
    private PatternService patternService;

    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    @GetMapping("/all")
    public ResponseEntity<?> getAllPatterns(HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        try {
            List<PatternDTO> patterns = patternService.findAll(userId);
            // for (PatternDTO pattern : patterns) {
            //     System.out.println(pattern.getPatternFabrics());
            // }
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

    @PostMapping(value = "/create", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createPattern(@RequestParam("name") String name,
                                           @RequestParam("brand") String brand,
                                           @RequestParam("description") String description,
                                           @RequestParam("patternType") String patternType,
                                           @RequestParam("format") String format,
                                           @RequestParam("difficulty") Integer difficulty,
                                           @RequestParam("tags") String tags,
                                           @RequestParam("releaseDate") String releaseDate,
                                           @RequestParam("free") Boolean free,
                                           @RequestParam("outOfPrint") Boolean outOfPrint,
                                           @RequestParam(value = "image", required = false) MultipartFile imageFile,
                                           @RequestParam("ageGroups") String ageGroups,
                                           @RequestParam("bodyType") String bodyType,
                                           @RequestParam("sizeRange") String sizeRange,
                                           @RequestParam("cupSizes") String cupSizes,
                                           @RequestParam("bustMin") Double bustMin,
                                           @RequestParam("bustMax") Double bustMax,
                                           @RequestParam("hipMin") Double hipMin,
                                           @RequestParam("hipMax") Double hipMax,
                                           @RequestParam("isImperial") Boolean isImperial,
                                           @RequestParam("supplies") String supplies,
                                           @RequestParam("patternFabrics") String patternFabrics,
                                           HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");

        try {
            Date parsedReleaseDate = parseDate(releaseDate);

            // Deserialize JSON strings into appropriate list types
            List<String> brandList = objectMapper.readValue(brand, new TypeReference<List<String>>() {});
            List<String> tagsList = objectMapper.readValue(tags, new TypeReference<List<String>>() {});
            List<String> ageGroupsList = objectMapper.readValue(ageGroups, new TypeReference<List<String>>() {});
            List<Character> cupSizesList = objectMapper.readValue(cupSizes, new TypeReference<List<Character>>() {});
            List<String> suppliesList = objectMapper.readValue(supplies, new TypeReference<List<String>>() {});
            List<PatternFabrics> patternFabricsList = objectMapper.readValue(patternFabrics, new TypeReference<List<PatternFabrics>>() {});

            PatternDTO patternDTO = patternService.storePattern(name, brandList, description, patternType, format, difficulty,
                    tagsList, parsedReleaseDate, free, outOfPrint, imageFile, ageGroupsList, bodyType, sizeRange, cupSizesList, bustMin,
                    bustMax, hipMin, hipMax, isImperial, suppliesList, patternFabricsList, userId);
            return ResponseEntity.status(200).body(patternDTO);
        } catch (IOException | ParseException e) {
            return ResponseEntity.status(500).body("Failed to upload pattern: " + e.getMessage());
        }
    }


    @PutMapping(value = "/update/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updatePattern(@PathVariable Long id,
                                           @RequestParam("name") String name,
                                           @RequestParam("brand") String brand,
                                           @RequestParam("description") String description,
                                           @RequestParam("patternType") String patternType,
                                           @RequestParam("format") String format,
                                           @RequestParam("difficulty") Integer difficulty,
                                           @RequestParam("tags") String tags,
                                           @RequestParam("releaseDate") String releaseDate,
                                           @RequestParam("free") Boolean free,
                                           @RequestParam("outOfPrint") Boolean outOfPrint,
                                           @RequestParam(value = "image", required = false) MultipartFile imageFile,
                                           @RequestParam("ageGroups") String ageGroups,
                                           @RequestParam("bodyType") String bodyType,
                                           @RequestParam("sizeRange") String sizeRange,
                                           @RequestParam("cupSizes") String cupSizes,
                                           @RequestParam("bustMin") Double bustMin,
                                           @RequestParam("bustMax") Double bustMax,
                                           @RequestParam("hipMin") Double hipMin,
                                           @RequestParam("hipMax") Double hipMax,
                                           @RequestParam("isImperial") Boolean isImperial,
                                           @RequestParam("supplies") String supplies,
                                           @RequestParam("patternFabrics") String patternFabrics,
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

            // Deserialize JSON strings into appropriate list types
            List<String> brandList = objectMapper.readValue(brand, new TypeReference<List<String>>() {});
            List<String> tagsList = objectMapper.readValue(tags, new TypeReference<List<String>>() {});
            List<String> ageGroupsList = objectMapper.readValue(ageGroups, new TypeReference<List<String>>() {});
            List<Character> cupSizesList = objectMapper.readValue(cupSizes, new TypeReference<List<Character>>() {});
            List<String> suppliesList = objectMapper.readValue(supplies, new TypeReference<List<String>>() {});
            List<PatternFabrics> patternFabricsList = objectMapper.readValue(patternFabrics, new TypeReference<List<PatternFabrics>>() {});

            PatternDTO patternDTO = patternService.updatePattern(id, name, brandList, description, patternType, format, difficulty,
                    tagsList, parsedReleaseDate, free, outOfPrint, imageFile, ageGroupsList, bodyType, sizeRange, cupSizesList, bustMin,
                    bustMax, hipMin, hipMax, isImperial, suppliesList, patternFabricsList, userId);
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
