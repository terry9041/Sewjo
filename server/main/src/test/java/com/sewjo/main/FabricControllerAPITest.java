package com.sewjo.main;

import com.sewjo.main.controllers.FabricControllerAPI;
import com.sewjo.main.dto.FabricDTO;
import com.sewjo.main.service.FabricService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.mock.web.MockHttpSession;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyFloat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class FabricControllerAPITest {

    @Mock
    private FabricService fabricService;

    @InjectMocks
    private FabricControllerAPI fabricControllerAPI;

    private MockHttpSession session;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        session = new MockHttpSession();
        session.setAttribute("id", 1L);
    }

    @Test
    void testCreateFabric_Failure() throws IOException {
        // Simulate an IOException for the storeFabric method
        doThrow(new IOException("Failed to read file")).when(fabricService).storeFabric(
                anyString(), anyDouble(), anyBoolean(), anyDouble(), anyBoolean(), anyBoolean(),
                any(MultipartFile.class), anyString(), anyString(), anyString(), anyString(),
                anyString(), anyString(), anyFloat(), anyBoolean(), anyString(), anyString(),
                anyBoolean(), anyFloat(), anyFloat(), anyFloat(), anyLong());

        // Call the method to test
        ResponseEntity<?> response = fabricControllerAPI.createFabric("name", 2.0, true, 2.0, true, true,
                new MockMultipartFile("image", new byte[0]), "composition", "structure", "color", "print",
                "description", "brand", 1.0f, true, "care", "location", true, 1.0f, 1.0f, 1.0f, session);

        // Print the response for debugging
        System.out.println("Response status: " + response.getStatusCode().value());
        System.out.println("Response body: " + response.getBody());

        // Verify the response
        assertEquals(500, response.getStatusCode().value());
        assertEquals("Failed to upload fabric", response.getBody());

        // Verify that storeFabric was called with the expected parameters
        verify(fabricService).storeFabric(anyString(), anyDouble(), anyBoolean(), anyDouble(), anyBoolean(),
                anyBoolean(),
                any(MultipartFile.class), anyString(), anyString(), anyString(), anyString(),
                anyString(), anyString(), anyFloat(), anyBoolean(), anyString(), anyString(),
                anyBoolean(), anyFloat(), anyFloat(), anyFloat(), anyLong());

        System.out.println("storeFabric method was called with the expected parameters.");
    }


    @Test
    void testUpdateFabric_Failure() throws IOException {
    FabricDTO fabric = new FabricDTO();
    fabric.setId(1L);

    when(fabricService.findById(anyLong(), anyLong())).thenReturn(fabric);
    doThrow(new IOException()).when(fabricService).update(any(FabricDTO.class),
    any(MultipartFile.class),
    anyLong());

    ResponseEntity<?> response = fabricControllerAPI.updateFabric(1L, "name",
    2.0, true, 2.0, true, true,
            new MockMultipartFile("image", new byte[0]), "composition", "structure", "color", "print", "description", "brand",
    1.0f,
    true, "care", "location", true, 1.0f, 1.0f, 1.0f, session);
    assertEquals(500, response.getStatusCode().value());
    assertEquals("Failed to update fabric image", response.getBody());
    }

    @Test
    void testGetAllFabrics_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = fabricControllerAPI.getAllFabrics(session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testGetAllFabrics_Authorized() {
        List<FabricDTO> fabrics = new ArrayList<>();
        when(fabricService.findAll(anyLong())).thenReturn(fabrics);

        ResponseEntity<?> response = fabricControllerAPI.getAllFabrics(session);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(fabrics, response.getBody());
    }

    @Test
    void testGetFabricById_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = fabricControllerAPI.getFabricById(1L, session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testGetFabricById_NotFound() {
        when(fabricService.findById(anyLong(), anyLong())).thenReturn(null);

        ResponseEntity<?> response = fabricControllerAPI.getFabricById(1L, session);
        assertEquals(404, response.getStatusCode().value());
        assertEquals("Fabric not found", response.getBody());
    }

    @Test
    void testGetFabricById_Found() {
        FabricDTO fabric = new FabricDTO();
        fabric.setId(1L);
        when(fabricService.findById(anyLong(), anyLong())).thenReturn(fabric);

        ResponseEntity<?> response = fabricControllerAPI.getFabricById(1L, session);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(fabric, response.getBody());
    }

    @Test
    void testCreateFabric_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = fabricControllerAPI.createFabric("name", 2.0, true, 2.0, true, true,
                null, "composition", "structure", "color", "print", "description", "brand", 1.0f,
                true, "care", "location", true, 1.0f, 1.0f, 1.0f, session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testCreateFabric_Success() throws IOException {
        MultipartFile imageFile = new MockMultipartFile("image", new byte[0]);
        FabricDTO fabric = new FabricDTO();
        when(fabricService.storeFabric(anyString(), anyDouble(), anyBoolean(), anyDouble(), anyBoolean(), anyBoolean(),
                any(MultipartFile.class), anyString(), anyString(), anyString(), anyString(), anyString(), anyString(),
                anyFloat(), anyBoolean(), anyString(), anyString(), anyBoolean(), anyFloat(), anyFloat(), anyFloat(),
                anyLong()))
                .thenReturn(fabric);

        ResponseEntity<?> response = fabricControllerAPI.createFabric("name", 2.0, true, 2.0, true, true,
                imageFile, "composition", "structure", "color", "print", "description", "brand", 1.0f,
                true, "care", "location", true, 1.0f, 1.0f, 1.0f, session);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(fabric, response.getBody());
    }

    

    @Test
    void testUpdateFabric_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = fabricControllerAPI.updateFabric(1L, "name", 2.0, true, 2.0, true, true,
                null, "composition", "structure", "color", "print", "description", "brand", 1.0f,
                true, "care", "location", true, 1.0f, 1.0f, 1.0f, session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testUpdateFabric_NotFound() {
        when(fabricService.findById(anyLong(), anyLong())).thenReturn(null);

        ResponseEntity<?> response = fabricControllerAPI.updateFabric(1L, "name", 2.0, true, 2.0, true, true,
                null, "composition", "structure", "color", "print", "description", "brand", 1.0f,
                true, "care", "location", true, 1.0f, 1.0f, 1.0f, session);
        assertEquals(404, response.getStatusCode().value());
        assertEquals("Fabric not found", response.getBody());
    }

     @Test
    void testUpdateFabric_Success() throws IOException {
        FabricDTO fabric = new FabricDTO();
        fabric.setId(1L); // Ensure the fabric has an ID

        // Mock the service methods
        when(fabricService.findById(anyLong(), anyLong())).thenReturn(fabric);
        when(fabricService.update(any(FabricDTO.class), any(MockMultipartFile.class), anyLong())).thenReturn(fabric);

        // Mock the file upload if necessary
        MockMultipartFile file = new MockMultipartFile("file", "filename.txt", "text/plain", "content".getBytes());

        // Call the controller method
        ResponseEntity<?> response = fabricControllerAPI.updateFabric(
                1L, "name", 2.0, true, 2.0, true, true,
                file, "composition", "structure", "color", "print", "description", "brand", 1.0f,
                true, "care", "location", true, 1.0f, 1.0f, 1.0f, session);

        // Assert the response
        assertEquals(200, response.getStatusCode().value());
        assertEquals(fabric, response.getBody());
    }
   
    

    @Test
    void testDeleteFabric_Unauthorized() {
        session.removeAttribute("id");
        ResponseEntity<?> response = fabricControllerAPI.deleteFabric(1L, session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testDeleteFabric_NotFound() {
        when(fabricService.deleteById(anyLong(), anyLong())).thenReturn(false);

        ResponseEntity<?> response = fabricControllerAPI.deleteFabric(1L, session);
        assertEquals(404, response.getStatusCode().value());
        assertEquals("Fabric not found or you do not have permission to delete it", response.getBody());
    }

    @Test
    void testDeleteFabric_Success() {
        when(fabricService.deleteById(anyLong(), anyLong())).thenReturn(true);

        ResponseEntity<?> response = fabricControllerAPI.deleteFabric(1L, session);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Fabric deleted successfully", response.getBody());
    }
}
