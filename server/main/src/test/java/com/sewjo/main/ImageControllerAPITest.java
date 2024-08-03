package com.sewjo.main;

import com.sewjo.main.controllers.ImageControllerAPI;
import com.sewjo.main.models.Image;
import com.sewjo.main.service.ImageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class ImageControllerAPITest {

    @Mock
    private ImageService imageService;

    @InjectMocks
    private ImageControllerAPI imageControllerAPI;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
void testUploadImage_Success() throws IOException {
    MultipartFile file = new MockMultipartFile("file", new byte[0]);
    Image image = new Image();
    image.setId(1L);
    when(imageService.storeImage(any(MultipartFile.class))).thenReturn(image);

    ResponseEntity<String> response = imageControllerAPI.uploadImage(file);
    assertEquals(HttpStatus.OK.value(), response.getStatusCode().value()); // Use value() method for comparison
    assertEquals("Image uploaded successfully: 1", response.getBody());
}

@Test
void testUploadImage_Failure() throws IOException {
    MultipartFile file = new MockMultipartFile("file", new byte[0]);
    when(imageService.storeImage(any(MultipartFile.class))).thenThrow(new IOException());

    ResponseEntity<String> response = imageControllerAPI.uploadImage(file);
    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCode().value()); // Use value() method for comparison
    assertEquals("Failed to upload image", response.getBody());
}

@Test
void testGetImage_Success() {
    Image image = new Image();
    image.setName("test.png");
    image.setData(new byte[0]);
    when(imageService.getImage(anyLong())).thenReturn(Optional.of(image));

    ResponseEntity<byte[]> response = imageControllerAPI.getImage(1L);
    assertEquals(HttpStatus.OK.value(), response.getStatusCode().value()); // Use value() method for comparison
    assertEquals("attachment; filename=\"test.png\"", response.getHeaders().getFirst("Content-Disposition"));
    assertArrayEquals(image.getData(), response.getBody()); // Use assertArrayEquals for byte array comparison
}

@Test
void testGetImage_NotFound() {
    when(imageService.getImage(anyLong())).thenReturn(Optional.empty());

    ResponseEntity<byte[]> response = imageControllerAPI.getImage(1L);
    assertEquals(HttpStatus.NOT_FOUND.value(), response.getStatusCode().value()); // Use value() method for comparison
    assertNull(response.getBody()); // Use assertNull to explicitly check for null
}

}
