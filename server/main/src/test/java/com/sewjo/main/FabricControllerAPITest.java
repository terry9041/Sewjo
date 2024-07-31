// package com.sewjo.main;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.springframework.http.ResponseEntity;
// import org.springframework.validation.BindingResult;
// import org.springframework.web.bind.annotation.PathVariable;

// import com.sewjo.main.controllers.FabricControllerAPI;
// import com.sewjo.main.models.Fabric;
// import com.sewjo.main.service.FabricService;
// import com.sewjo.main.service.UserService;
// import com.sewjo.main.models.User;

// import jakarta.servlet.http.HttpSession;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.ArgumentMatchers.anyLong;
// import static org.mockito.Mockito.*;
// import static org.mockito.MockitoAnnotations.openMocks;

// import java.util.ArrayList;
// import java.util.List;

// import static org.junit.jupiter.api.Assertions.*;

// class FabricControllerAPITest {

//     @InjectMocks
//     private FabricControllerAPI controller;

//     @Mock
//     private FabricService fabricService;

//     @Mock
//     private UserService userServ;

//     @Mock
//     private HttpSession session;

//     @Mock
//     private BindingResult bindingResult;

//     @BeforeEach
//     void setUp() {
//         openMocks(this);
//     }

//     @Test
//     void testGetAllFabrics_Authorized() {
//         // Arrange
//         Long userId = 1L;
//         List<Fabric> fabrics = new ArrayList<>();
//         when(session.getAttribute("id")).thenReturn(userId);
//         when(fabricService.findAll(userId)).thenReturn(fabrics);

//         // Act
//         ResponseEntity<?> response = controller.getAllFabrics(session);

//         // Assert
//         assertEquals(200, response.getStatusCode().value());
//         assertEquals(fabrics, response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(fabricService, times(1)).findAll(userId);
//     }

//     @Test
//     void testGetAllFabrics_Unauthorized() {
//         // Arrange
//         when(session.getAttribute("id")).thenReturn(null);

//         // Act
//         ResponseEntity<?> response = controller.getAllFabrics(session);

//         // Assert
//         assertEquals(401, response.getStatusCode().value());
//         assertEquals("Unauthorized", response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(fabricService, never()).findAll(anyLong());
//     }

//     @Test
//     void testGetFabricById_AuthorizedAndFound() {
//         // Arrange
//         Long userId = 1L;
//         Long fabricId = 1L;
//         Fabric fabric = new Fabric();
//         when(session.getAttribute("id")).thenReturn(userId);
//         when(fabricService.findById(fabricId, userId)).thenReturn(fabric);

//         // Act
//         ResponseEntity<?> response = controller.getFabricById(fabricId, session);

//         // Assert
//         assertEquals(200, response.getStatusCode().value());
//         assertEquals(fabric, response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(fabricService, times(1)).findById(fabricId, userId);
//     }

//     @Test
//     void testGetFabricById_AuthorizedAndNotFound() {
//         // Arrange
//         Long userId = 1L;
//         Long fabricId = 1L;
//         when(session.getAttribute("id")).thenReturn(userId);
//         when(fabricService.findById(fabricId, userId)).thenReturn(null);

//         // Act
//         ResponseEntity<?> response = controller.getFabricById(fabricId, session);

//         // Assert
//         assertEquals(404, response.getStatusCode().value());
//         assertEquals("Fabric not found", response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(fabricService, times(1)).findById(fabricId, userId);
//     }

//     @Test
//     void testGetFabricById_Unauthorized() {
//         // Arrange
//         when(session.getAttribute("id")).thenReturn(null);

//         // Act
//         ResponseEntity<?> response = controller.getFabricById(1L, session);

//         // Assert
//         assertEquals(401, response.getStatusCode().value());
//         assertEquals("Unauthorized", response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(fabricService, never()).findById(anyLong(), anyLong());
//     }

//     @Test
//     void testCreateFabric_AuthorizedAndValid() {
//         // Arrange
//         Long userId = 1L;
//         Fabric fabric = new Fabric();
//         when(session.getAttribute("id")).thenReturn(userId);
//         when(userServ.findById(userId)).thenReturn(new User());
//         when(fabricService.save(fabric, bindingResult)).thenReturn(fabric);

//         // Act
//         ResponseEntity<?> response = controller.createFabric(fabric, bindingResult, session);

//         // Assert
//         assertEquals(200, response.getStatusCode().value());
//         assertEquals(fabric, response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(userServ, times(1)).findById(userId);
//         verify(fabricService, times(1)).save(fabric, bindingResult);
//     }

//     @Test
//     void testCreateFabric_AuthorizedAndInvalid() {
//         // Arrange
//         Long userId = 1L;
//         Fabric fabric = new Fabric();
//         when(session.getAttribute("id")).thenReturn(userId);
//         when(bindingResult.hasErrors()).thenReturn(true);

//         // Act
//         ResponseEntity<?> response = controller.createFabric(fabric, bindingResult, session);

//         // Assert
//         assertEquals(400, response.getStatusCode().value());
//         assertEquals(bindingResult.getAllErrors(), response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(bindingResult, times(1)).hasErrors();
//         verify(fabricService, never()).save(any(Fabric.class), any(BindingResult.class));
//     }

//     @Test
//     void testCreateFabric_Unauthorized() {
//         // Arrange
//         Fabric fabric = new Fabric();
//         when(session.getAttribute("id")).thenReturn(null);

//         // Act
//         ResponseEntity<?> response = controller.createFabric(fabric, bindingResult, session);

//         // Assert
//         assertEquals(401, response.getStatusCode().value());
//         assertEquals("Unauthorized", response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(fabricService, never()).save(any(Fabric.class), any(BindingResult.class));
//     }

//     @Test
//     void testUpdateFabric_AuthorizedAndFoundAndValid() {
//         // Arrange
//         Long userId = 1L;
//         Long fabricId = 1L;
//         Fabric fabric = new Fabric();
//         Fabric existingFabric = new Fabric();
//         existingFabric.setUser(new User());
//         when(session.getAttribute("id")).thenReturn(userId);
//         when(fabricService.findById(fabricId, userId)).thenReturn(existingFabric);
//         when(fabricService.update(fabric, bindingResult)).thenReturn(fabric);

//         // Act
//         ResponseEntity<?> response = controller.updateFabric(fabricId, fabric, bindingResult, session);

//         // Assert
//         assertEquals(200, response.getStatusCode().value());
//         assertEquals(fabric, response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(fabricService, times(1)).findById(fabricId, userId);
//         verify(fabricService, times(1)).update(fabric, bindingResult);
//     }

//     @Test
//     void testUpdateFabric_AuthorizedAndFoundAndInvalid() {
//         // Arrange
//         Long userId = 1L;
//         Long fabricId = 1L;
//         Fabric fabric = new Fabric();
//         Fabric existingFabric = new Fabric();
//         existingFabric.setUser(new User());
//         when(session.getAttribute("id")).thenReturn(userId);
//         when(fabricService.findById(fabricId, userId)).thenReturn(existingFabric);
//         when(bindingResult.hasErrors()).thenReturn(true);

//         // Act
//         ResponseEntity<?> response = controller.updateFabric(fabricId, fabric, bindingResult, session);

//         // Assert
//         assertEquals(400, response.getStatusCode().value());
//         assertEquals(bindingResult.getAllErrors(), response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(fabricService, times(1)).findById(fabricId, userId);
//         verify(bindingResult, times(1)).hasErrors();
//         verify(fabricService, never()).update(any(Fabric.class), any(BindingResult.class));
//     }

//     @Test
//     void testUpdateFabric_AuthorizedAndNotFound() {
//         // Arrange
//         Long userId = 1L;
//         Long fabricId = 1L;
//         Fabric fabric = new Fabric();
//         when(session.getAttribute("id")).thenReturn(userId);
//         when(fabricService.findById(fabricId, userId)).thenReturn(null);

//         // Act
//         ResponseEntity<?> response = controller.updateFabric(fabricId, fabric, bindingResult, session);

//         // Assert
//         assertEquals(404, response.getStatusCode().value());
//         assertEquals("Fabric not found", response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(fabricService, times(1)).findById(fabricId, userId);
//     }

//     @Test
//     void testUpdateFabric_Unauthorized() {
//         // Arrange
//         Fabric fabric = new Fabric();
//         when(session.getAttribute("id")).thenReturn(null);

//         // Act
//         ResponseEntity<?> response = controller.updateFabric(1L, fabric, bindingResult, session);

//         // Assert
//         assertEquals(401, response.getStatusCode().value());
//         assertEquals("Unauthorized", response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(fabricService, never()).findById(anyLong(), anyLong());
//         verify(fabricService, never()).update(any(Fabric.class), any(BindingResult.class));
//     }

//     @Test
//     void testDeleteFabric_AuthorizedAndFound() {
//         // Arrange
//         Long userId = 1L;
//         Long fabricId = 1L;
//         when(session.getAttribute("id")).thenReturn(userId);
//         when(fabricService.deleteById(fabricId, userId)).thenReturn(true);

//         // Act
//         ResponseEntity<?> response = controller.deleteFabric(fabricId, session);

//         // Assert
//         assertEquals(200, response.getStatusCode().value());
//         assertEquals("Fabric deleted successfully", response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(fabricService, times(1)).deleteById(fabricId, userId);
//     }

//     @Test
//     void testDeleteFabric_AuthorizedAndNotFound() {
//         // Arrange
//         Long userId = 1L;
//         Long fabricId = 1L;
//         when(session.getAttribute("id")).thenReturn(userId);
//         when(fabricService.deleteById(fabricId, userId)).thenReturn(false);

//         // Act
//         ResponseEntity<?> response = controller.deleteFabric(fabricId, session);

//         // Assert
//         assertEquals(404, response.getStatusCode().value());
//         assertEquals("Fabric not found or you do not have permission to delete it", response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(fabricService, times(1)).deleteById(fabricId, userId);
//     }

//     @Test
//     void testDeleteFabric_Unauthorized() {
//         // Arrange
//         when(session.getAttribute("id")).thenReturn(null);

//         // Act
//         ResponseEntity<?> response = controller.deleteFabric(1L, session);

//         // Assert
//         assertEquals(401, response.getStatusCode().value());
//         assertEquals("Unauthorized", response.getBody());
//         verify(session, times(1)).getAttribute("id");
//         verify(fabricService, never()).deleteById(anyLong(), anyLong());
//     }

// }