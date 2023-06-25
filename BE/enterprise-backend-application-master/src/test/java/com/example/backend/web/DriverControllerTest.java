package com.example.backend.web;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.DriverEntity;
import com.example.backend.repository.DriverRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DriverControllerTest {

    @Mock
    private DriverRepository driverRepository;

    @InjectMocks
    private DriverController driverController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAllDrivers() {
        // Arrange
        List<DriverEntity> drivers = new ArrayList<>();
        drivers.add(new DriverEntity());
        when(driverRepository.findAll()).thenReturn(drivers);

        // Act
        List<DriverEntity> result = driverController.getAllDrivers();

        // Assert
        assertEquals(drivers, result);
        verify(driverRepository, times(1)).findAll();
    }

    @Test
    public void testCreateDriver() {
        // Arrange
        DriverEntity driver = new DriverEntity();
        when(driverRepository.save(driver)).thenReturn(driver);

        // Act
        DriverEntity result = driverController.createDriver(driver);

        // Assert
        assertEquals(driver, result);
        verify(driverRepository, times(1)).save(driver);
    }

    @Test
    public void testGetDriverById_ValidId() {
        // Arrange
        long id = 1L;
        DriverEntity driver = new DriverEntity();
        when(driverRepository.findById(id)).thenReturn(Optional.of(driver));

        // Act
        ResponseEntity<DriverEntity> result = driverController.getDriverById(id);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(driver, result.getBody());
        verify(driverRepository, times(1)).findById(id);
    }

    @Test
    public void testGetDriverById_InvalidId() {
        // Arrange
        long id = 1L;
        when(driverRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> driverController.getDriverById(id));
        assertEquals("Driver not exist with id :1", exception.getMessage());
        verify(driverRepository, times(1)).findById(id);
    }

    @Test
    public void testUpdateDriver() {
        // Arrange
        long id = 1L;
        DriverEntity existingDriver = new DriverEntity();
        existingDriver.setId(id);
        existingDriver.setDriverName("John Doe");

        DriverEntity updatedDriver = new DriverEntity();
        updatedDriver.setId(id);
        updatedDriver.setDriverName("Jane Smith");

        when(driverRepository.findById(id)).thenReturn(Optional.of(existingDriver));
        when(driverRepository.save(existingDriver)).thenReturn(updatedDriver);

        // Act
        ResponseEntity<DriverEntity> result = driverController.updateDriver(id, updatedDriver);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(updatedDriver, result.getBody());
        assertEquals("Jane Smith", result.getBody().getDriverName());
        verify(driverRepository, times(1)).findById(id);
        verify(driverRepository, times(1)).save(existingDriver);
    }

    @Test
    public void testUpdateDriver_InvalidId() {
        // Arrange
        long id = 1L;
        DriverEntity updatedDriver = new DriverEntity();

        when(driverRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> driverController.updateDriver(id, updatedDriver));
        assertEquals("Driver not exist with id :1", exception.getMessage());
        verify(driverRepository, times(1)).findById(id);
    }

    @Test
    public void testDeleteDriver() {
        // Arrange
        long id = 1L;
        DriverEntity driver = new DriverEntity();
        when(driverRepository.findById(id)).thenReturn(Optional.of(driver));

        Map<String, Boolean> expectedResponse = new HashMap<>();
        expectedResponse.put("deleted", Boolean.TRUE);

        // Act
        ResponseEntity<Map<String, Boolean>> result = driverController.deleteDriver(id);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(expectedResponse, result.getBody());
        verify(driverRepository, times(1)).findById(id);
        verify(driverRepository, times(1)).delete(driver);
    }

    @Test
    public void testDeleteDriver_InvalidId() {
        // Arrange
        long id = 1L;
        when(driverRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> driverController.deleteDriver(id));
        assertEquals("Driver not exist with id :1", exception.getMessage());
        verify(driverRepository, times(1)).findById(id);
    }
}