package com.sewjo.main;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sewjo.main.controllers.ProjectControllerAPI;
import com.sewjo.main.dto.ProjectDTO;
import com.sewjo.main.models.SimpleFabric;
import com.sewjo.main.service.ProjectService;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpSession;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ProjectControllerAPITest {

    @Mock
    private ProjectService projectService;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private ProjectControllerAPI projectControllerAPI;

    private MockHttpSession session;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        session = new MockHttpSession();
        session.setAttribute("id", 1L);
    }

    @Test
    void testGetAllProjects_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = projectControllerAPI.getAllProjects(session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testGetAllProjects_Success() {
        List<ProjectDTO> projects = new ArrayList<>();
        when(projectService.findAll(anyLong())).thenReturn(projects);

        ResponseEntity<?> response = projectControllerAPI.getAllProjects(session);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(projects, response.getBody());
    }

    @Test
    void testGetAllProjects_InternalServerError() {
        when(projectService.findAll(anyLong())).thenThrow(new RuntimeException("Test exception"));

        ResponseEntity<?> response = projectControllerAPI.getAllProjects(session);
        assertEquals(500, response.getStatusCode().value());
        assertEquals("Internal Server Error: Test exception", response.getBody());
    }

    @Test
    void testGetProjectById_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = projectControllerAPI.getProjectById(1L, session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testGetProjectById_NotFound() {
        when(projectService.findById(anyLong(), anyLong())).thenReturn(null);

        ResponseEntity<?> response = projectControllerAPI.getProjectById(1L, session);
        assertEquals(404, response.getStatusCode().value());
        assertEquals("Project not found", response.getBody());
    }

    @Test
    void testGetProjectById_Success() {
        ProjectDTO project = new ProjectDTO();
        when(projectService.findById(anyLong(), anyLong())).thenReturn(project);

        ResponseEntity<?> response = projectControllerAPI.getProjectById(1L, session);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(project, response.getBody());
    }

    @Test
    void testCreateProject_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = projectControllerAPI.createProject(
                "name", "instructions", 1L, null, session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
void testCreateProject_Failure() throws Exception {
    // Mock ObjectMapper to throw JsonProcessingException
    when(objectMapper.readValue(anyString(), any(TypeReference.class)))
            .thenThrow(new JsonProcessingException("Invalid JSON") {});

    ResponseEntity<?> response = projectControllerAPI.createProject(
            "name", "instructions", 1L, "invalid-json", session);
    assertEquals(500, response.getStatusCode().value());
    assertEquals("Failed to create project: Invalid JSON", response.getBody());
}


    @Test
    void testCreateProject_Success() throws Exception {
        SimpleFabric fabric = new SimpleFabric();
        List<SimpleFabric> fabrics = List.of(fabric);
        when(objectMapper.readValue(anyString(), any(TypeReference.class)))
                .thenReturn(fabrics);

        ProjectDTO mockProjectDTO = new ProjectDTO();
        when(projectService.createProject(any(ProjectDTO.class), anyLong())).thenReturn(mockProjectDTO);

        ResponseEntity<?> response = projectControllerAPI.createProject(
                "name", "instructions", 1L, "[]", session);
        assertEquals(201, response.getStatusCode().value());
        assertEquals(mockProjectDTO, response.getBody());
    }

    @Test
    void testUpdateProject_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = projectControllerAPI.updateProject(
                1L, "name", "instructions", 1L, null, session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testUpdateProject_NotFound() throws Exception {
        when(objectMapper.readValue(anyString(), any(TypeReference.class)))
                .thenReturn(new ArrayList<>());
        when(projectService.updateProject(anyLong(), any(ProjectDTO.class), anyLong())).thenReturn(null);

        ResponseEntity<?> response = projectControllerAPI.updateProject(
                1L, "name", "instructions", 1L, "[]", session);
        assertEquals(404, response.getStatusCode().value());
        assertEquals("Project not found or you do not have permission to update it", response.getBody());
    }

    @Test
    void testUpdateProject_Failure() throws Exception {
        // Mock ObjectMapper to return a list of SimpleFabric
        when(objectMapper.readValue(anyString(), any(TypeReference.class)))
                .thenReturn(new ArrayList<>());

        // Mock ProjectService to throw an exception
        when(projectService.updateProject(anyLong(), any(ProjectDTO.class), anyLong()))
                .thenThrow(new RuntimeException("Update failed"));

        ResponseEntity<?> response = projectControllerAPI.updateProject(
                1L, "name", "instructions", 1L, "[]", session);
        assertEquals(500, response.getStatusCode().value());
        assertEquals("Failed to update project: Update failed", response.getBody());
    }

    @Test
    void testUpdateProject_Success() throws Exception {
        SimpleFabric fabric = new SimpleFabric();
        List<SimpleFabric> fabrics = List.of(fabric);
        when(objectMapper.readValue(anyString(), any(TypeReference.class)))
                .thenReturn(fabrics);

        ProjectDTO mockProjectDTO = new ProjectDTO();
        when(projectService.updateProject(anyLong(), any(ProjectDTO.class), anyLong())).thenReturn(mockProjectDTO);

        ResponseEntity<?> response = projectControllerAPI.updateProject(
                1L, "name", "instructions", 1L, "[]", session);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(mockProjectDTO, response.getBody());
    }

    @Test
    void testDeleteProject_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = projectControllerAPI.deleteProject(1L, session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testDeleteProject_NotFound() {
        when(projectService.deleteById(anyLong(), anyLong())).thenReturn(false);

        ResponseEntity<?> response = projectControllerAPI.deleteProject(1L, session);
        assertEquals(404, response.getStatusCode().value());
        assertEquals("Project not found or you do not have permission to delete it", response.getBody());
    }

    @Test
    void testDeleteProject_Success() {
        when(projectService.deleteById(anyLong(), anyLong())).thenReturn(true);

        ResponseEntity<?> response = projectControllerAPI.deleteProject(1L, session);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Project deleted successfully", response.getBody());
    }
}
