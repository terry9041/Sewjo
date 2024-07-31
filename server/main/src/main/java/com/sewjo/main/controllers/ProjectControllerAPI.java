package com.sewjo.main.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sewjo.main.dto.ProjectDTO;
import com.sewjo.main.models.SimpleFabric;
import com.sewjo.main.service.ProjectService;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/project")
public class ProjectControllerAPI {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    @GetMapping("/all")
    public ResponseEntity<?> getAllProjects(HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        try {
            List<ProjectDTO> projects = projectService.findAll(userId);
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }

    @Transactional
    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        ProjectDTO project = projectService.findById(id, userId);
        if (project == null) {
            return ResponseEntity.status(404).body("Project not found");
        }
        return ResponseEntity.ok(project);
    }

    @PostMapping(value = "/create", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createProject(
            @RequestParam("name") String name,
            @RequestParam("instructions") String instructions,
            @RequestParam("patternId") Long patternId,
            @RequestParam(value="readyFabrics",required = false) String readyFabricsJson,
            HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        try {
            List<SimpleFabric> readyFabrics = null;
            if (readyFabricsJson != null) {
                readyFabrics = objectMapper.readValue(readyFabricsJson, new TypeReference<List<SimpleFabric>>() {});
            }
            ProjectDTO projectDTO = new ProjectDTO(name, instructions, patternId, readyFabrics, userId);
            ProjectDTO createdProject = projectService.createProject(projectDTO, userId);
            return ResponseEntity.status(201).body(createdProject);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to create project: " + e.getMessage());
        }
    }

    @PutMapping(value = "/update/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateProject(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("instructions") String instructions,
            @RequestParam("patternId") Long patternId,
            @RequestParam(value="readyFabrics", required=false) String readyFabricsJson,
            HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        try {
            List<SimpleFabric> readyFabrics = null;
            if (readyFabricsJson != null) {
                readyFabrics = objectMapper.readValue(readyFabricsJson, new TypeReference<List<SimpleFabric>>() {});
            }
            ProjectDTO projectDTO = new ProjectDTO(name, instructions, patternId, readyFabrics, userId);
            ProjectDTO updatedProject = projectService.updateProject(id, projectDTO, userId);
            if (updatedProject == null) {
                return ResponseEntity.status(404).body("Project not found or you do not have permission to update it");
            }
            return ResponseEntity.ok(updatedProject);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update project: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("id") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long userId = (Long) session.getAttribute("id");
        boolean isDeleted = projectService.deleteById(id, userId);
        if (!isDeleted) {
            return ResponseEntity.status(404).body("Project not found or you do not have permission to delete it");
        }
        return ResponseEntity.ok("Project deleted successfully");
    }
}
