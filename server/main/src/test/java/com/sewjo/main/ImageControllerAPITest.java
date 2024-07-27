package com.sewjo.main;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.sewjo.main.controllers.ImageControllerAPI;
import com.sewjo.main.models.Image;
import com.sewjo.main.service.ImageService;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

class ImageControllerAPITest {

    @InjectMocks
    private ImageControllerAPI imageControllerAPI;

    @Mock
    private ImageService imageService;

    @Mock
    private MultipartFile file;

    @BeforeEach
    void setUp() {
        // Initialize the mocks
        openMocks(this);
    }

    @Test
    void testUploadImage_Success() throws IOException {
        // Arrange: Set up the mock image with an ID
        Image image = new Image();
        image.setId(1L);

        // Mock the behavior of the imageService to return the mock image
        when(imageService.storeImage(file)).thenReturn(image);

        // Act: Call the uploadImage method with the mock file
        ResponseEntity<String> response = imageControllerAPI.uploadImage(file);

        // Assert: Verify the response status and body
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Image uploaded successfully: 1", response.getBody());

        // Verify that the imageService.storeImage method was called exactly once
        verify(imageService, times(1)).storeImage(file);
    }

    @Test
    void testUploadImage_Failure() throws IOException {
        // Arrange: Mock the behavior of the imageService to throw an IOException
        when(imageService.storeImage(file)).thenThrow(new IOException());

        // Act: Call the uploadImage method with the mock file
        ResponseEntity<String> response = imageControllerAPI.uploadImage(file);

        // Assert: Verify the response status and body
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Failed to upload image", response.getBody());

        // Verify that the imageService.storeImage method was called exactly once
        verify(imageService, times(1)).storeImage(file);
    }

    @Test
    void testGetImage_Found() {
        // Arrange: Set up the mock image with an ID, name, and data
        Long imageId = 1L;
        Image image = new Image();
        image.setId(imageId);
        image.setName("test.png");
        image.setData(new byte[0]);

        // Mock the behavior of the imageService to return an Optional containing the
        // mock image
        when(imageService.getImage(imageId)).thenReturn(Optional.of(image));

        // Act: Call the getImage method with the mock image ID
        ResponseEntity<byte[]> response = imageControllerAPI.getImage(imageId);

        // Assert: Verify the response status, body, and headers
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(image.getData(), response.getBody());
        assertEquals("attachment; filename=\"test.png\"",
                response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION));

        // Verify that the imageService.getImage method was called exactly once with the
        // correct ID
        verify(imageService, times(1)).getImage(imageId);
    }

    @Test
    void testGetImage_NotFound() {
        // Arrange: Mock the behavior of the imageService to return an empty Optional
        Long imageId = 1L;
        when(imageService.getImage(imageId)).thenReturn(Optional.empty());

        // Act: Call the getImage method with the mock image ID
        ResponseEntity<byte[]> response = imageControllerAPI.getImage(imageId);

        // Assert: Verify the response status and body
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());

        // Verify that the imageService.getImage method was called exactly once with the
        // correct ID
        verify(imageService, times(1)).getImage(imageId);
    }
}
