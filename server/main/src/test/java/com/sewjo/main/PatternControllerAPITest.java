package com.sewjo.main;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sewjo.main.controllers.PatternControllerAPI;
import com.sewjo.main.dto.PatternDTO;
import com.sewjo.main.models.PatternFabrics;
import com.sewjo.main.models.SimpleFabric;
import com.sewjo.main.service.PatternService;

import java.util.Collections;
// Remove the conflicting import statement
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import java.text.SimpleDateFormat;
import org.springframework.web.multipart.MultipartFile;
import java.util.Date;
import java.util.List;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.TimeZone;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
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

//     @Test
// void testCreatePattern_Success() throws IOException, ParseException {
//     // Mock input data
//     String name = "Test Pattern";
//     String brand = "[\"Brand1\"]";
//     String description = "Test Description";
//     String patternType = "Type1";
//     String format = "PDF";
//     Integer difficulty = 2;
//     String tags = "[\"tag1\", \"tag2\"]";
//     String releaseDate = "2023-01-01";
//     Boolean free = true;
//     Boolean outOfPrint = false;
//     MultipartFile imageFile = new MockMultipartFile("image", new byte[0]);
//     String ageGroups = "[\"Adult\"]";
//     String bodyType = "All";
//     String sizeRange = "XS-XL";
//     String cupSizes = "[\"A\", \"B\"]";
//     Double bustMin = 32.0;
//     Double bustMax = 40.0;
//     Double hipMin = 34.0;
//     Double hipMax = 42.0;
//     Boolean isImperial = true;
//     String supplies = "[\"Fabric\", \"Thread\"]";
//     String patternFabrics = "[{\"size\":\"Size1\",\"fabrics\":[{\"fabricType\":\"Cotton\",\"yardage\":2.5}]}]";

//     // Mock ObjectMapper behavior
//     when(objectMapper.readValue(eq(brand), any(TypeReference.class))).thenReturn(Arrays.asList("Brand1"));
//     when(objectMapper.readValue(eq(tags), any(TypeReference.class))).thenReturn(Arrays.asList("tag1", "tag2"));
//     when(objectMapper.readValue(eq(ageGroups), any(TypeReference.class))).thenReturn(Arrays.asList("Adult"));
//     when(objectMapper.readValue(eq(cupSizes), any(TypeReference.class))).thenReturn(Arrays.asList('A', 'B'));
//     when(objectMapper.readValue(eq(supplies), any(TypeReference.class))).thenReturn(Arrays.asList("Fabric", "Thread"));
//     when(objectMapper.readValue(eq(patternFabrics), any(TypeReference.class)))
//             .thenReturn(Arrays.asList(new PatternFabrics("Size1", Arrays.asList(new SimpleFabric("Cotton", 2.5)))));

//     // Mock PatternService behavior
//     PatternDTO mockPatternDTO = new PatternDTO();
//     when(patternService.storePattern(
//             anyString(), anyList(), anyString(), anyString(), anyString(), anyInt(),
//             anyList(), any(Date.class), anyBoolean(), anyBoolean(), any(MultipartFile.class),
//             anyList(), anyString(), anyString(), anyList(), anyDouble(), anyDouble(),
//             anyDouble(), anyDouble(), anyBoolean(), anyList(), anyList(), anyLong())).thenReturn(mockPatternDTO);

//     // Call the method
//     mockMvc.perform(multipart("/api/pattern/create")
//             .file(imageFile)
//             .param("name", name)
//             .param("brand", brand)
//             .param("description", description)
//             .param("patternType", patternType)
//             .param("format", format)
//             .param("difficulty", difficulty.toString())
//             .param("tags", tags)
//             .param("releaseDate", releaseDate)
//             .param("free", free.toString())
//             .param("outOfPrint", outOfPrint.toString())
//             .param("ageGroups", ageGroups)
//             .param("bodyType", bodyType)
//             .param("sizeRange", sizeRange)
//             .param("cupSizes", cupSizes)
//             .param("bustMin", bustMin.toString())
//             .param("bustMax", bustMax.toString())
//             .param("hipMin", hipMin.toString())
//             .param("hipMax", hipMax.toString())
//             .param("isImperial", isImperial.toString())
//             .param("supplies", supplies)
//             .param("patternFabrics", patternFabrics)
//             .sessionAttr("id", 1L))
//             .andExpect(status().isOk())
//             .andExpect(result -> {
//                 assertEquals(mockPatternDTO, objectMapper.readValue(result.getResponse().getContentAsString(), PatternDTO.class));
//             });
// }


    @Test
    void testCreatePattern_Failure() throws IOException, ParseException {
        // Similar setup as testCreatePattern_Success
        // But make the patternService.storePattern throw an exception
        when(patternService.storePattern(
                anyString(), anyList(), anyString(), anyString(), anyString(), anyInt(),
                anyList(), any(Date.class), anyBoolean(), anyBoolean(), any(MultipartFile.class),
                anyList(), anyString(), anyString(), anyList(), anyDouble(), anyDouble(),
                anyDouble(), anyDouble(), anyBoolean(), anyList(), anyList(), anyLong()))
                .thenThrow(new IOException("Test exception"));

        ResponseEntity<?> response = patternControllerAPI.createPattern(
                "name", "[]", "description", "type", "format", 1,
                "[]", "2023-01-01", true, false, null,
                "[]", "bodyType", "sizeRange", "[]",
                1.0, 2.0, 3.0, 4.0, true, "[]", "[]", session);

        assertEquals(500, response.getStatusCode().value());
        assertEquals("Failed to upload pattern: Test exception", response.getBody());
    }

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
    // void testUpdatePattern_Success() throws IOException, ParseException {
    //     // Mock existing pattern
    //     PatternDTO existingPattern = new PatternDTO();
    //     when(patternService.findById(anyLong(), anyLong())).thenReturn(existingPattern);

    //     // Mock input data (similar to createPattern test)
    //     String name = "Updated Pattern";
    //     String brand = "[\"Brand2\"]";
    //     String description = "Updated Description";
    //     String patternType = "Type2";
    //     String format = "Paper";
    //     Integer difficulty = 3;
    //     String tags = "[\"tag3\", \"tag4\"]";
    //     String releaseDate = "2023-02-01";
    //     Boolean free = false;
    //     Boolean outOfPrint = true;
    //     MultipartFile imageFile = new MockMultipartFile("image", new byte[0]);
    //     String ageGroups = "[\"Child\"]";
    //     String bodyType = "Petite";
    //     String sizeRange = "S-L";
    //     String cupSizes = "[\"C\", \"D\"]";
    //     Double bustMin = 30.0;
    //     Double bustMax = 38.0;
    //     Double hipMin = 32.0;
    //     Double hipMax = 40.0;
    //     Boolean isImperial = false;
    //     String supplies = "[\"Zipper\", \"Buttons\"]";
    //     String patternFabrics = "[{\"fabricType\":\"Silk\",\"yardage\":1.5}]";

    //     // Mock ObjectMapper behavior (similar to createPattern test)
    //     when(objectMapper.readValue(eq(brand), any(Class.class))).thenReturn(Arrays.asList("Brand2"));
    //     when(objectMapper.readValue(eq(tags), any(Class.class))).thenReturn(Arrays.asList("tag3", "tag4"));
    //     when(objectMapper.readValue(eq(ageGroups), any(Class.class))).thenReturn(Arrays.asList("Child"));
    //     when(objectMapper.readValue(eq(cupSizes), any(Class.class))).thenReturn(Arrays.asList('C', 'D'));
    //     when(objectMapper.readValue(eq(supplies), any(Class.class))).thenReturn(Arrays.asList("Zipper", "Buttons"));
    //     when(objectMapper.readValue(eq(patternFabrics), any(Class.class)))
    //             .thenReturn(Arrays.asList(new PatternFabrics("Silk", 1.5)));

    //     // Mock PatternService behavior
    //     PatternDTO updatedPatternDTO = new PatternDTO();
    //     when(patternService.updatePattern(
    //             anyLong(), anyString(), anyList(), anyString(), anyString(), anyString(), anyInt(),
    //             anyList(), any(Date.class), anyBoolean(), anyBoolean(), any(MultipartFile.class),
    //             anyList(), anyString(), anyString(), anyList(), anyDouble(), anyDouble(),
    //             anyDouble(), anyDouble(), anyBoolean(), anyList(), anyList(), anyLong())).thenReturn(updatedPatternDTO);

    //     // Call the method
    //     ResponseEntity<?> response = patternControllerAPI.updatePattern(
    //             1L, name, brand, description, patternType, format, difficulty,
    //             tags, releaseDate, free, outOfPrint, imageFile,
    //             ageGroups, bodyType, sizeRange, cupSizes,
    //             bustMin, bustMax, hipMin, hipMax, isImperial, supplies, patternFabrics, session);

    //     // Verify the response
    //     assertEquals(200, response.getStatusCode().value());
    //     assertEquals(updatedPatternDTO, response.getBody());
    // }

    @Test
    void testUpdatePattern_Failure() throws IOException, ParseException {
        // Mock existing pattern
        PatternDTO existingPattern = new PatternDTO();
        when(patternService.findById(anyLong(), anyLong())).thenReturn(existingPattern);

        // Make the patternService.updatePattern throw an exception
        when(patternService.updatePattern(
                anyLong(), anyString(), anyList(), anyString(), anyString(), anyString(), anyInt(),
                anyList(), any(Date.class), anyBoolean(), anyBoolean(), any(MultipartFile.class),
                anyList(), anyString(), anyString(), anyList(), anyDouble(), anyDouble(),
                anyDouble(), anyDouble(), anyBoolean(), anyList(), anyList(), anyLong()))
                .thenThrow(new IOException("Update failed"));

        ResponseEntity<?> response = patternControllerAPI.updatePattern(
                1L, "name", "[]", "description", "type", "format", 1,
                "[]", "2023-01-01", true, false, null,
                "[]", "bodyType", "sizeRange", "[]",
                1.0, 2.0, 3.0, 4.0, true, "[]", "[]", session);

        assertEquals(500, response.getStatusCode().value());
        assertEquals("Failed to update pattern: Update failed", response.getBody());
    }

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

        // Assuming parseDate is a method in your PatternControllerAPI class
        Date actualDate = patternControllerAPI.parseDate(dateString);

        // Convert actualDate to GMT for comparison
        sdf.setTimeZone(TimeZone.getTimeZone("GMT"));
        String actualDateString = sdf.format(actualDate);
        Date actualDateInGMT = sdf.parse(actualDateString);

        assertEquals(expectedDate, actualDateInGMT);
    }

    @Test
    void testParseDate_NullDate() throws ParseException {
        Date parsedDate = patternControllerAPI.parseDate(null);
        assertEquals(null, parsedDate);
    }

    @Test
    void testParseDate_EmptyString() throws ParseException {
        Date parsedDate = patternControllerAPI.parseDate("");
        assertEquals(null, parsedDate);
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

    // Additional tests for edge cases and error handling

    @Test
    void testCreatePattern_InvalidReleaseDate() {
        ResponseEntity<?> response = patternControllerAPI.createPattern(
                "name", "[]", "description", "type", "format", 1,
                "[]", "invalid-date", true, false, null,
                "[]", "bodyType", "sizeRange", "[]",
                1.0, 2.0, 3.0, 4.0, true, "[]", "[]", session);
        assertEquals(500, response.getStatusCode().value());
        assertTrue(response.getBody().toString().contains("Failed to upload pattern"));
    }

    @Test
    void testUpdatePattern_InvalidReleaseDate() {
        when(patternService.findById(anyLong(), anyLong())).thenReturn(new PatternDTO());

        ResponseEntity<?> response = patternControllerAPI.updatePattern(
                1L, "name", "[]", "description", "type", "format", 1,
                "[]", "invalid-date", true, false, null,
                "[]", "bodyType", "sizeRange", "[]",
                1.0, 2.0, 3.0, 4.0, true, "[]", "[]", session);
        assertEquals(500, response.getStatusCode().value());
        assertTrue(response.getBody().toString().contains("Failed to update pattern"));
    }

    @Test
    void testCreatePattern_JsonProcessingException() throws JsonProcessingException {
        when(objectMapper.readValue(anyString(), any(Class.class)))
                .thenThrow(new JsonProcessingException("Invalid JSON") {
                });

        ResponseEntity<?> response = patternControllerAPI.createPattern(
                "name", "invalid-json", "description", "type", "format", 1,
                "[]", "2023-01-01", true, false, null,
                "[]", "bodyType", "sizeRange", "[]",
                1.0, 2.0, 3.0, 4.0, true, "[]", "[]", session);
        assertEquals(500, response.getStatusCode().value());
        assertTrue(response.getBody().toString().contains("Failed to upload pattern"));
    }

    @Test
    void testUpdatePattern_JsonProcessingException() throws JsonProcessingException {
        when(patternService.findById(anyLong(), anyLong())).thenReturn(new PatternDTO());
        when(objectMapper.readValue(anyString(), any(Class.class)))
                .thenThrow(new JsonProcessingException("Invalid JSON") {
                });

        ResponseEntity<?> response = patternControllerAPI.updatePattern(
                1L, "name", "invalid-json", "description", "type", "format", 1,
                "[]", "2023-01-01", true, false, null,
                "[]", "bodyType", "sizeRange", "[]",
                1.0, 2.0, 3.0, 4.0, true, "[]", "[]", session);
        assertEquals(500, response.getStatusCode().value());
        assertTrue(response.getBody().toString().contains("Failed to update pattern"));
    }

    // Test for null MultipartFile
    @Test
    void testCreatePattern_NullImageFile() throws IOException, ParseException {
        PatternDTO mockPatternDTO = new PatternDTO();
        when(patternService.storePattern(
                anyString(), anyList(), anyString(), anyString(), anyString(), anyInt(),
                anyList(), any(Date.class), anyBoolean(), anyBoolean(), isNull(),
                anyList(), anyString(), anyString(), anyList(), anyDouble(), anyDouble(),
                anyDouble(), anyDouble(), anyBoolean(), anyList(), anyList(), anyLong())).thenReturn(mockPatternDTO);

        ResponseEntity<?> response = patternControllerAPI.createPattern(
                "name", "[]", "description", "type", "format", 1,
                "[]", "2023-01-01", true, false, null,
                "[]", "bodyType", "sizeRange", "[]",
                1.0, 2.0, 3.0, 4.0, true, "[]", "[]", session);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(mockPatternDTO, response.getBody());
    }


}