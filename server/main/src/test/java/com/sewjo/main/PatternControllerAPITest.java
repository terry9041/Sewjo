package com.sewjo.main;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.http.HttpSession;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;

import com.sewjo.main.models.Pattern;
import com.sewjo.main.models.User;
import com.sewjo.main.service.PatternService;
import com.sewjo.main.service.UserService;
import com.sewjo.main.controllers.PatternControllerAPI;

@ExtendWith(MockitoExtension.class)
public class PatternControllerAPITest {

    @InjectMocks
    private PatternControllerAPI controller;

    @Mock
    private PatternService patternService;

    @Mock
    private UserService userServ;

    @Mock
    private HttpSession session;

    @Mock
    private BindingResult bindingResult;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllPatterns_Authorized() {
        // Arrange
        Long userId = 1L;
        when(session.getAttribute("id")).thenReturn(userId);
        List<Pattern> patterns = new ArrayList<>();
        patterns.add(new Pattern());
        when(patternService.findAll(userId)).thenReturn(patterns);

        // Act
        ResponseEntity<?> response = controller.getAllPatterns(session);

        // Assert
        assertEquals(200, response.getStatusCode().value());
        assertEquals(patterns, response.getBody());
        verify(session, times(1)).getAttribute("id");
        verify(patternService, times(1)).findAll(userId);
    }

    @Test
    void testGetAllPatterns_Unauthorized() {
        // Arrange
        when(session.getAttribute("id")).thenReturn(null);

        // Act
        ResponseEntity<?> response = controller.getAllPatterns(session);

        // Assert
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
        verify(session, times(1)).getAttribute("id");
        verify(patternService, never()).findAll(anyLong());
    }

    @Test
    void testGetPatternById_AuthorizedAndFound() {
        // Arrange
        Long userId = 1L;
        Long patternId = 1L;
        when(session.getAttribute("id")).thenReturn(userId);
        Pattern pattern = new Pattern();
        when(patternService.findById(patternId, userId)).thenReturn(pattern);

        // Act
        ResponseEntity<?> response = controller.getPatternById(patternId, session);

        // Assert
        assertEquals(200, response.getStatusCode().value());
        assertEquals(pattern, response.getBody());
        verify(session, times(1)).getAttribute("id");
        verify(patternService, times(1)).findById(patternId, userId);
    }

    @Test
    void testGetPatternById_AuthorizedAndNotFound() {
        // Arrange
        Long userId = 1L;
        Long patternId = 1L;
        when(session.getAttribute("id")).thenReturn(userId);
        when(patternService.findById(patternId, userId)).thenReturn(null);

        // Act
        ResponseEntity<?> response = controller.getPatternById(patternId, session);

        // Assert
        assertEquals(404, response.getStatusCode().value());
        assertEquals("Pattern not found", response.getBody());
        verify(session, times(1)).getAttribute("id");
        verify(patternService, times(1)).findById(patternId, userId);
    }

    @Test
    void testGetPatternById_Unauthorized() {
        // Arrange
        when(session.getAttribute("id")).thenReturn(null);

        // Act
        ResponseEntity<?> response = controller.getPatternById(1L, session);

        // Assert
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
        verify(session, times(1)).getAttribute("id");
        verify(patternService, never()).findById(anyLong(), anyLong());
    }

    @Test
    void testCreatePattern_AuthorizedAndValid() {
        // Arrange
        Long userId = 1L;
        when(session.getAttribute("id")).thenReturn(userId);
        Pattern pattern = new Pattern();
        User user = new User();
        when(userServ.findById(userId)).thenReturn(user);
        when(patternService.save(any(Pattern.class), any(BindingResult.class))).thenReturn(pattern);

        // Act
        ResponseEntity<?> response = controller.createPattern(pattern, bindingResult, session);

        // Assert
        assertEquals(200, response.getStatusCode().value());
        assertEquals(pattern, response.getBody());
        verify(session, times(1)).getAttribute("id");
        verify(userServ, times(1)).findById(userId);
        verify(patternService, times(1)).save(pattern, bindingResult);
    }

    @Test
    void testCreatePattern_AuthorizedAndInvalid() {
        // Arrange
        Long userId = 1L;
        when(session.getAttribute("id")).thenReturn(userId);
        Pattern pattern = new Pattern();
        User user = new User();
        when(userServ.findById(userId)).thenReturn(user);
        when(bindingResult.hasErrors()).thenReturn(true);

        // Act
        ResponseEntity<?> response = controller.createPattern(pattern, bindingResult, session);

        // Assert
        assertEquals(400, response.getStatusCode().value());
        assertEquals(bindingResult.getAllErrors(), response.getBody());
        verify(session, times(1)).getAttribute("id");
        verify(userServ, times(1)).findById(userId);
        verify(patternService, never()).save(any(Pattern.class), any(BindingResult.class));
    }

    @Test
    void testCreatePattern_Unauthorized() {
        // Arrange
        when(session.getAttribute("id")).thenReturn(null);

        // Act
        ResponseEntity<?> response = controller.createPattern(new Pattern(), bindingResult, session);

        // Assert
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
        verify(session, times(1)).getAttribute("id");
        verify(userServ, never()).findById(anyLong());
        verify(patternService, never()).save(any(Pattern.class), any(BindingResult.class));
    }

    @Test
    void testUpdatePattern_AuthorizedAndFound() {
        // Arrange
        Long userId = 1L;
        Long patternId = 1L;
        when(session.getAttribute("id")).thenReturn(userId);
        Pattern pattern = new Pattern();
        Pattern existingPattern = new Pattern();
        existingPattern.setUser(new User());
        when(patternService.findById(patternId, userId)).thenReturn(existingPattern);
        when(patternService.update(any(Pattern.class), any(BindingResult.class))).thenReturn(pattern);

        // Act
        ResponseEntity<?> response = controller.updatePattern(patternId, pattern, bindingResult, session);

        // Assert
        assertEquals(200, response.getStatusCode().value());
        assertEquals(pattern, response.getBody());
        verify(session, times(1)).getAttribute("id");
        verify(patternService, times(1)).findById(patternId, userId);
        verify(patternService, times(1)).update(pattern, bindingResult);
    }

    @Test
    void testUpdatePattern_AuthorizedAndNotFound() {
        // Arrange
        Long userId = 1L;
        Long patternId = 1L;
        when(session.getAttribute("id")).thenReturn(userId);
        when(patternService.findById(patternId, userId)).thenReturn(null);

        // Act
        ResponseEntity<?> response = controller.updatePattern(patternId, new Pattern(), bindingResult, session);

        // Assert
        assertEquals(404, response.getStatusCode().value());
        assertEquals("Pattern not found", response.getBody());
        verify(session, times(1)).getAttribute("id");
        verify(patternService, times(1)).findById(patternId, userId);
        verify(patternService, never()).update(any(Pattern.class), any(BindingResult.class));
    }

    @Test
    void testUpdatePattern_Unauthorized() {
        // Arrange
        when(session.getAttribute("id")).thenReturn(null);

        // Act
        ResponseEntity<?> response = controller.updatePattern(1L, new Pattern(), bindingResult, session);

        // Assert
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
        verify(session, times(1)).getAttribute("id");
        verify(patternService, never()).findById(anyLong(), anyLong());
        verify(patternService, never()).update(any(Pattern.class), any(BindingResult.class));
    }

    @Test
    void testDeletePattern_AuthorizedAndFound() {
        // Arrange
        Long userId = 1L;
        Long patternId = 1L;
        when(session.getAttribute("id")).thenReturn(userId);
        when(patternService.deleteById(patternId, userId)).thenReturn(true);

        // Act
        ResponseEntity<?> response = controller.deletePattern(patternId, session);

        // Assert
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Pattern deleted successfully", response.getBody());
        verify(session, times(1)).getAttribute("id");
        verify(patternService, times(1)).deleteById(patternId, userId);
    }

    @Test
    void testDeletePattern_AuthorizedAndNotFound() {
        // Arrange
        Long userId = 1L;
        Long patternId = 1L;
        when(session.getAttribute("id")).thenReturn(userId);
        when(patternService.deleteById(patternId, userId)).thenReturn(false);

        // Act
        ResponseEntity<?> response = controller.deletePattern(patternId, session);

        // Assert
        assertEquals(404, response.getStatusCode().value());
        assertEquals("Pattern not found or you do not have permission to delete it", response.getBody());
        verify(session, times(1)).getAttribute("id");
        verify(patternService, times(1)).deleteById(patternId, userId);
    }

    @Test
    void testDeletePattern_Unauthorized() {
        // Arrange
        when(session.getAttribute("id")).thenReturn(null);

        // Act
        ResponseEntity<?> response = controller.deletePattern(1L, session);

        // Assert
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
        verify(session, times(1)).getAttribute("id");
        verify(patternService, never()).deleteById(anyLong(), anyLong());
    }
}
