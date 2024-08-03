package com.sewjo.main;

import com.sewjo.main.controllers.LoginControllerAPI;
import com.sewjo.main.dto.ChangePasswordDTO;
import com.sewjo.main.service.UserService;
import com.sewjo.main.dto.UserDTO;
import com.sewjo.main.models.LoginUser;
import com.sewjo.main.models.User;

import com.sewjo.main.controllers.ImageControllerAPI;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.validation.BindingResult;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class LoginControllerAPITest {

    @Mock
    private UserService userService;

    @Mock
    private BindingResult bindingResult;



    @Mock
    private HttpSession session;

    @Mock
    private HttpServletResponse response;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private LoginControllerAPI loginControllerAPI;

    @InjectMocks
    private ImageControllerAPI imageControllerAPI;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Mock session behavior
        when(session.getAttribute("id")).thenReturn(1L); // Simulate a logged-in user with ID 1
    }

    @Test
    void testLogin_Success() {
        LoginUser loginUser = new LoginUser();
        User user = new User();
        UserDTO userDTO = new UserDTO();
        when(userService.login(any(LoginUser.class), any(BindingResult.class))).thenReturn(user);
        when(userService.convertToDTO(any(User.class))).thenReturn(userDTO);

        ResponseEntity<?> response = loginControllerAPI.login(loginUser, bindingResult, session, this.response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(userDTO, response.getBody());
    }

    @Test
    void testLogin_Failure() {
        when(bindingResult.hasErrors()).thenReturn(true);

        ResponseEntity<?> response = loginControllerAPI.login(new LoginUser(), bindingResult, session, this.response);
        assertEquals(400, response.getStatusCode().value());
        assertEquals(bindingResult.getAllErrors(), response.getBody());
    }

    @Test
    void testRegister_Success() {
        User newUser = new User();
        User user = new User();
        UserDTO userDTO = new UserDTO();
        when(userService.register(any(User.class), any(BindingResult.class))).thenReturn(user);
        when(userService.convertToDTO(any(User.class))).thenReturn(userDTO);

        ResponseEntity<?> response = loginControllerAPI.register(newUser, bindingResult, session, this.response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(userDTO, response.getBody());
    }

    @Test
    void testRegister_Failure() {
        when(bindingResult.hasErrors()).thenReturn(true);

        ResponseEntity<?> response = loginControllerAPI.register(new User(), bindingResult, session, this.response);
        assertEquals(400, response.getStatusCode().value());
        assertEquals(bindingResult.getAllErrors(), response.getBody());
    }

    @Test
    void testDashboard_Unauthorized() {
        when(session.getAttribute("id")).thenReturn(null);

        ResponseEntity<?> response = loginControllerAPI.dashboard(session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testDashboard_Success() {
        User user = new User();
        UserDTO userDTO = new UserDTO();
        when(session.getAttribute("id")).thenReturn(1L);
        when(userService.findById(anyLong())).thenReturn(user);
        when(userService.convertToDTO(any(User.class))).thenReturn(userDTO);

        ResponseEntity<?> response = loginControllerAPI.dashboard(session);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(userDTO, response.getBody());
    }

    @Test
    void testLogout_Success() {
        when(session.getAttribute("id")).thenReturn(1L);
        HttpServletResponse httpResponse = mock(HttpServletResponse.class);
    
        ResponseEntity<?> response = loginControllerAPI.logout(session, httpResponse);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Logged out successfully", response.getBody());
    }

    @Test
    void testLogout_NoSession() {
        // Call the logout method with a null session
        ResponseEntity<?> responseEntity = loginControllerAPI.logout(null, response);

        // Verify the response
        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertEquals("No session found", responseEntity.getBody());
    }

    @Test
    void testChangePassword_Unauthorized() {
        when(session.getAttribute("id")).thenReturn(null);

        ResponseEntity<?> response = loginControllerAPI.changePassword(new ChangePasswordDTO(), bindingResult, session,
                request);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testChangePassword_Success() {
        ChangePasswordDTO passwordDTO = new ChangePasswordDTO();
        User user = new User();
        UserDTO userDTO = new UserDTO();
        when(session.getAttribute("id")).thenReturn(1L);
        when(userService.changePassword(anyLong(), any(ChangePasswordDTO.class), any(BindingResult.class)))
                .thenReturn(user);
        when(userService.convertToDTO(any(User.class))).thenReturn(userDTO);

        ResponseEntity<?> response = loginControllerAPI.changePassword(passwordDTO, bindingResult, session, request);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(userDTO, response.getBody());
    }

    @Test
    void testGetProfileImage_Unauthorized() {
        when(session.getAttribute("id")).thenReturn(null);

        ResponseEntity<?> response = loginControllerAPI.getProfileImage(session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testGetProfileImage_Success() {
        User user = new User();
        when(session.getAttribute("id")).thenReturn(1L);
        when(userService.findById(anyLong())).thenReturn(user);

        ResponseEntity<?> response = loginControllerAPI.getProfileImage(session);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(user.getImage(), response.getBody());
    }

    @Test
    void testChangeProfileImage_Unauthorized() {
        when(session.getAttribute("id")).thenReturn(null);

        ResponseEntity<?> response = loginControllerAPI.changeProfileImage(null, session);
        assertEquals(401, response.getStatusCode().value());
        assertEquals("Unauthorized", response.getBody());
    }

    @Test
    void testChangeProfileImage_Success() throws IOException {
        // Create a MockMultipartFile for the image
        MultipartFile imageFile = new MockMultipartFile("image", "test.png", "image/png", new byte[0]);

        // Create a mock UserDTO for the existing user
        UserDTO existingUser = new UserDTO();
        UserDTO updatedUser = new UserDTO();

        // Mock the service methods
        when(userService.convertToDTO(any())).thenReturn(existingUser);
        when(userService.changeProfileImage(any(), any(), anyLong())).thenReturn(updatedUser);

        // Ensure the session contains the user ID
        session.setAttribute("id", 1L);

        // Call the controller method
        ResponseEntity<?> response = loginControllerAPI.changeProfileImage(imageFile, session);

        // Print the response for debugging
        System.out.println("Response status: " + response.getStatusCode());
        System.out.println("Response body: " + response.getBody());

        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedUser, response.getBody());
    }

}
