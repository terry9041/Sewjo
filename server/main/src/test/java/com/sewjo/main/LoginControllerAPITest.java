package com.sewjo.main;

import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;

import com.sewjo.main.controllers.LoginControllerAPI;
import com.sewjo.main.dto.UserDTO;
import com.sewjo.main.models.LoginUser;
import com.sewjo.main.models.User;
import com.sewjo.main.service.UserService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

class LoginControllerAPITest {

    @InjectMocks
    private LoginControllerAPI loginControllerAPI;

    @Mock
    private UserService userServ;

    @Mock
    private HttpSession session;

    @Mock
    private HttpServletResponse response;

    @Mock
    private BindingResult bindingResult;

    @Mock
    private Logger logger;

    @BeforeEach
    void setUp() {
        // Initialize the mocks
        openMocks(this);
    }

    @Test
    void testLogin_Success() {
        // Arrange: Set up the mock login user with email and password
        LoginUser loginUser = new LoginUser();
        loginUser.setEmail("test@example.com");
        loginUser.setPassword("password");

        // Set up the mock user with an ID
        User user = new User();
        user.setId(1L);

        // Set up the mock user DTO with an ID
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);

        // Mock the behavior of the userServ to return the mock user and user DTO
        when(userServ.login(any(LoginUser.class), any(BindingResult.class))).thenReturn(user);
        when(userServ.convertToDTO(any(User.class))).thenReturn(userDTO);

        // Act: Call the login method with the mock login user
        ResponseEntity<?> response = loginControllerAPI.login(loginUser, bindingResult, session, this.response);

        // Assert: Verify the response status and body
        assertEquals(200, response.getStatusCode().value());
        assertEquals(userDTO, response.getBody());

        // Verify that the session attribute was set correctly
        verify(session).setAttribute("id", 1L);

        // Verify that the userServ.login method was called exactly once
        verify(userServ, times(1)).login(any(LoginUser.class), any(BindingResult.class));

        // Verify that the userServ.convertToDTO method was called exactly once
        verify(userServ, times(1)).convertToDTO(any(User.class));
    }

    @Test
    void testLogin_Failure() {
        // Arrange: Set up the mock login user with email and password
        LoginUser loginUser = new LoginUser();
        loginUser.setEmail("test@example.com");
        loginUser.setPassword("password");

        // Mock the behavior of the userServ to throw a RuntimeException
        when(userServ.login(any(LoginUser.class), any(BindingResult.class)))
                .thenThrow(new RuntimeException("Login failed"));

        // Act: Call the login method with the mock login user
        ResponseEntity<?> response = loginControllerAPI.login(loginUser, bindingResult, session, this.response);

        // Assert: Verify the response status and body
        assertEquals(500, response.getStatusCodeValue());
        assertEquals("An unexpected error occurred. Please try again later.", response.getBody());

        // Verify that the userServ.login method was called exactly once
        verify(userServ, times(1)).login(any(LoginUser.class), any(BindingResult.class));
    }

    @Test
    void testRegister_Success() {
        // Arrange: Set up the mock new user with email and password
        User newUser = new User();
        newUser.setEmail("test@example.com");
        newUser.setPassword("password");

        // Set up the mock user with an ID
        User user = new User();
        user.setId(1L);

        // Set up the mock user DTO with an ID
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);

        // Mock the behavior of the userServ to return the mock user and user DTO
        when(userServ.register(any(User.class), any(BindingResult.class))).thenReturn(user);
        when(userServ.convertToDTO(any(User.class))).thenReturn(userDTO);

        // Act: Call the register method with the mock new user
        ResponseEntity<?> response = loginControllerAPI.register(newUser, bindingResult, session, this.response);

        // Assert: Verify the response status and body
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(userDTO, response.getBody());

        // Verify that the session attribute was set correctly
        verify(session).setAttribute("id", 1L);

        // Verify that the userServ.register method was called exactly once
        verify(userServ, times(1)).register(any(User.class), any(BindingResult.class));

        // Verify that the userServ.convertToDTO method was called exactly once
        verify(userServ, times(1)).convertToDTO(any(User.class));
    }

    @Test
    void testRegister_Failure() {
        // Arrange: Set up the mock new user with email and password
        User newUser = new User();
        newUser.setEmail("test@example.com");
        newUser.setPassword("password");

        // Mock the behavior of the userServ to throw a RuntimeException
        when(userServ.register(any(User.class), any(BindingResult.class)))
                .thenThrow(new RuntimeException("Register failed"));

        // Act: Call the register method with the mock new user
        ResponseEntity<?> response = loginControllerAPI.register(newUser, bindingResult, session, this.response);

        // Assert: Verify the response status and body
        assertEquals(500, response.getStatusCodeValue());
        assertEquals("An unexpected error occurred. Please try again later.", response.getBody());

        // Verify that the userServ.register method was called exactly once
        verify(userServ, times(1)).register(any(User.class), any(BindingResult.class));
    }

    @Test
    void testDashboard_Authorized() {
        // Arrange: Set up the mock user ID and user
        Long userId = 1L;
        User user = new User();
        user.setId(userId);

        // Set up the mock user DTO
        UserDTO userDTO = new UserDTO();
        userDTO.setId(userId);

        // Mock the behavior of the session and userServ to return the mock user and
        // user DTO
        when(session.getAttribute("id")).thenReturn(userId);
        when(userServ.findById(userId)).thenReturn(user);
        when(userServ.convertToDTO(user)).thenReturn(userDTO);

        // Act: Call the dashboard method with the mock session
        ResponseEntity<?> response = loginControllerAPI.dashboard(session);

        // Assert: Verify the response status and body
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(userDTO, response.getBody());

        // Verify that the session.getAttribute method was called exactly once
        verify(session, times(1)).getAttribute("id");

        // Verify that the userServ.findById method was called exactly once
        verify(userServ, times(1)).findById(userId);

        // Verify that the userServ.convertToDTO method was called exactly once
        verify(userServ, times(1)).convertToDTO(user);
    }

    @Test
    void testDashboard_Unauthorized() {
        // Arrange: Mock the behavior of the session to return null for the "id"
        // attribute
        when(session.getAttribute("id")).thenReturn(null);

        // Act: Call the dashboard method with the mock session
        ResponseEntity<?> response = loginControllerAPI.dashboard(session);

        // Assert: Verify the response status and body
        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Unauthorized", response.getBody());

        // Verify that the session.getAttribute method was called exactly once
        verify(session, times(1)).getAttribute("id");
    }

    @Test
    void testLogout() {
        // Arrange: Mock the behavior of the session to return a mock user ID for the
        // "id" attribute
        when(session.getAttribute("id")).thenReturn(1L);

        // Act: Call the logout method with the mock session and response
        ResponseEntity<?> response = loginControllerAPI.logout(session, response);

        // Assert: Verify the response status and body
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Logged out successfully", response.getBody());

        // Verify that the session.invalidate method was called exactly once
        verify(session, times(1)).invalidate();

        // Verify that the session.getAttribute method was called exactly once
        verify(session, times(1)).getAttribute("id");
    }
}
