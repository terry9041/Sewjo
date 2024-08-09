package com.sewjo.main;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sewjo.main.controllers.PatternControllerAPI;
import com.sewjo.main.dto.PatternDTO;
import com.sewjo.main.models.PatternFabrics;
import com.sewjo.main.models.SimpleFabric;
import com.sewjo.main.service.PatternService;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.io.IOException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import com.sewjo.main.controllers.PatternControllerAPI;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class PatternControllerAPITest {

    @Mock
    private PatternService patternService;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private PatternControllerAPI patternControllerAPI;

    private MockHttpSession session;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        session = new MockHttpSession();
        session.setAttribute("id", 1L);
    }

    @Test
    void testGetAllPatterns_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = patternControllerAPI.getAllPatterns(session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testGetAllPatterns_Success() {
        List<PatternDTO> patterns = new ArrayList<>();
        when(patternService.findAll(anyLong())).thenReturn(patterns);

        ResponseEntity<?> response = patternControllerAPI.getAllPatterns(session);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(patterns, response.getBody());
    }

    @Test
    void testGetAllPatterns_InternalServerError() {
        when(patternService.findAll(anyLong())).thenThrow(new RuntimeException("Test exception"));

        ResponseEntity<?> response = patternControllerAPI.getAllPatterns(session);
        assertEquals(500, response.getStatusCode().value());
        assertEquals("Internal Server Error: Test exception", response.getBody());
    }

    @Test
    void testGetPatternById_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = patternControllerAPI.getPatternById(1L, session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testGetPatternById_NotFound() {
        when(patternService.findById(anyLong(), anyLong())).thenReturn(null);

        ResponseEntity<?> response = patternControllerAPI.getPatternById(1L, session);
        assertEquals(404, response.getStatusCode().value());
        assertEquals("Pattern not found", response.getBody());
    }

    @Test
    void testGetPatternById_Success() {
        PatternDTO pattern = new PatternDTO();
        when(patternService.findById(anyLong(), anyLong())).thenReturn(pattern);

        ResponseEntity<?> response = patternControllerAPI.getPatternById(1L, session);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(pattern, response.getBody());
    }

    @Test
    void testCreatePattern_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = patternControllerAPI.createPattern(
                "name", "[]", "description", "type", "format", 1,
                "[]", "2023-01-01", true, false, null,
                "[]", "bodyType", "sizeRange", "[]",
                1.0, 2.0, 3.0, 4.0, true, "[]", "[]", session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    // @Test
    // void testCreatePattern_Failure() throws IOException {
    //     // Arrange
    //     when(patternService.storePattern(
    //             anyString(), anyList(), anyString(), anyString(), anyString(), anyInt(),
    //             anyList(), any(Date.class), anyBoolean(), anyBoolean(), any(MultipartFile.class),
    //             anyList(), anyString(), anyString(), anyList(), anyDouble(), anyDouble(),
    //             anyDouble(), anyDouble(), anyBoolean(), anyList(), anyList(), anyLong()))
    //             .thenThrow(new IOException("Test exception"));

    //     // Act
    //     ResponseEntity<?> response = patternControllerAPI.createPattern(
    //             "name", "[]", "description", "type", "format", 1,
    //             "[]", "2023-01-01", true, false, null,
    //             "[]", "bodyType", "sizeRange", "[]",
    //             1.0, 2.0, 3.0, 4.0, true, "[]", "[]", session);

    //     // Debugging prints
    //     System.out.println("Actual status code: " + response.getStatusCode().value());
    //     System.out.println("Response body: " + response.getBody());

    //     // Assert
    //     assertEquals(500, response.getStatusCode().value(), "Expected status code 500 for pattern creation failure");
    //     assertEquals("Failed to upload pattern: Test exception", response.getBody(),
    //             "Expected failure message for pattern creation failure");
    // }

    @Test
    void testUpdatePattern_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = patternControllerAPI.updatePattern(
                1L, "name", "[]", "description", "type", "format", 1,
                "[]", "2023-01-01", true, false, null,
                "[]", "bodyType", "sizeRange", "[]",
                1.0, 2.0, 3.0, 4.0, true, "[]", "[]", session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testUpdatePattern_NotFound() {
        when(patternService.findById(anyLong(), anyLong())).thenReturn(null);

        ResponseEntity<?> response = patternControllerAPI.updatePattern(
                1L, "name", "[]", "description", "type", "format", 1,
                "[]", "2023-01-01", true, false, null,
                "[]", "bodyType", "sizeRange", "[]",
                1.0, 2.0, 3.0, 4.0, true, "[]", "[]", session);
        assertEquals(404, response.getStatusCode().value());
        assertEquals("Pattern not found", response.getBody());
    }

    // @Test
    // void testUpdatePattern_Failure() throws IOException {
    //     when(patternService.findById(anyLong(), anyLong())).thenReturn(new PatternDTO());

    //     when(patternService.updatePattern(
    //             anyLong(), anyString(), anyList(), anyString(), anyString(), anyString(), anyInt(),
    //             anyList(), any(Date.class), anyBoolean(), anyBoolean(), any(MultipartFile.class),
    //             anyList(), anyString(), anyString(), anyList(), anyDouble(), anyDouble(),
    //             anyDouble(), anyDouble(), anyBoolean(), anyList(), anyList(), anyLong()))
    //             .thenThrow(new IOException("Update failed"));

    //     ResponseEntity<?> response = patternControllerAPI.updatePattern(
    //             1L, "name", "[]", "description", "type", "format", 1,
    //             "[]", "2023-01-01", true, false, null,
    //             "[]", "bodyType", "sizeRange", "[]",
    //             1.0, 2.0, 3.0, 4.0, true, "[]", "[]", session);

    //     assertEquals(500, response.getStatusCode().value());
    //     assertEquals("Failed to update pattern: Update failed", response.getBody());
    // }

    @Test
    void testDeletePattern_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = patternControllerAPI.deletePattern(1L, session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testDeletePattern_NotFound() {
        when(patternService.deleteById(anyLong(), anyLong())).thenReturn(false);

        ResponseEntity<?> response = patternControllerAPI.deletePattern(1L, session);
        assertEquals(404, response.getStatusCode().value());
        assertEquals("Pattern not found or you do not have permission to delete it", response.getBody());
    }

    @Test
    void testDeletePattern_Success() {
        when(patternService.deleteById(anyLong(), anyLong())).thenReturn(true);

        ResponseEntity<?> response = patternControllerAPI.deletePattern(1L, session);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Pattern deleted successfully", response.getBody());
    }

    @Test
    void testParseDate_ValidDate() throws ParseException {
        String dateString = "2023-01-01";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT"));
        Date expectedDate = sdf.parse(dateString);

        Date actualDate = patternControllerAPI.parseDate(dateString);

        sdf.setTimeZone(TimeZone.getTimeZone("GMT"));
        String actualDateString = sdf.format(actualDate);
        Date actualDateInGMT = sdf.parse(actualDateString);

        assertEquals(expectedDate, actualDateInGMT);
    }

    @Test
    void testParseDate_NullDate() {
        // Act
        Date parsedDate = null;
        try {
            parsedDate = patternControllerAPI.parseDate(null);
        } catch (ParseException e) {
            // Handle exception if necessary
        }

        // Assert
        assertNull(parsedDate, "Parsed date should be null for null input");
    }

    @Test
    void testParseDate_EmptyString() {
        // Act
        Date parsedDate = null;
        try {
            parsedDate = patternControllerAPI.parseDate("");
        } catch (ParseException e) {
            // Handle exception if necessary
        }

        // Assert
        assertNull(parsedDate, "Parsed date should be null for empty string input");
    }

    @Test
    void testParseDate_InvalidFormat() {
        String invalidDate = "01-01-2023";
        try {
            patternControllerAPI.parseDate(invalidDate);
        } catch (ParseException e) {
            assertEquals("Unparseable date: \"01-01-2023\"", e.getMessage());
        }
    }
}
