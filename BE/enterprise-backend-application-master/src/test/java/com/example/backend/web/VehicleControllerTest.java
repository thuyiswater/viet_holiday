package com.example.backend.web;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.VehicleEntity;
import com.example.backend.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class VehicleControllerTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleController vehicleController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void getAllVehicles() {
        // Arrange
        List<VehicleEntity> vehicles = Arrays.asList(
                new VehicleEntity("Vehicle 1", "Brand 1", "Plate 1", "Color 1", "4"),
                new VehicleEntity("Vehicle 2", "Brand 2", "Plate 2", "Color 2", "4")
        );
        when(vehicleRepository.findAll()).thenReturn(vehicles);

        // Act
        List<VehicleEntity> result = vehicleController.getAllVehicles();

        // Assert
        assertEquals(vehicles.size(), result.size());
        assertEquals(vehicles.get(0), result.get(0));
        assertEquals(vehicles.get(1), result.get(1));
        verify(vehicleRepository, times(1)).findAll();
    }

    @Test
    public void createVehicle() {
        // Arrange
        VehicleEntity vehicle = new VehicleEntity("Vehicle 1", "Brand 1", "Plate 1", "Color 1", "4");
        when(vehicleRepository.save(any(VehicleEntity.class))).thenReturn(vehicle);

        // Act
        VehicleEntity result = vehicleController.createVehicle(vehicle);

        // Assert
        assertEquals(vehicle, result);
        verify(vehicleRepository, times(1)).save(vehicle);
    }

    @Test
    public void getVehicleById_WithValidId() {
        // Arrange
        Long vehicleId = 1L;
        VehicleEntity vehicle = new VehicleEntity( "Vehicle 1", "Brand 1", "Plate 1", "Color 1", "4");
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));

        // Act
        ResponseEntity<VehicleEntity> response = vehicleController.getVehicleById(vehicleId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(vehicle, response.getBody());
        verify(vehicleRepository, times(1)).findById(vehicleId);
    }

    @Test
    public void getVehicleById_WithInvalidId() {
        // Arrange
        Long vehicleId = 1L;
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> vehicleController.getVehicleById(vehicleId));
        verify(vehicleRepository, times(1)).findById(vehicleId);
    }

    @Test
    public void updateVehicle_WithValidId() {
        // Arrange
        Long vehicleId = 1L;
        VehicleEntity existingVehicle = new VehicleEntity( "Vehicle 1", "Brand 1", "Plate 1", "Color 1", "4");
        VehicleEntity updatedVehicle = new VehicleEntity("Updated Vehicle", "Updated Brand", "Updated Plate", "Updated Color", "2");
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(existingVehicle));
        when(vehicleRepository.save(any(VehicleEntity.class))).thenReturn(updatedVehicle);

        // Act
        ResponseEntity<VehicleEntity> response = vehicleController.updateVehicle(vehicleId, updatedVehicle);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedVehicle, response.getBody());
        verify(vehicleRepository, times(1)).findById(vehicleId);
        verify(vehicleRepository, times(1)).save(existingVehicle);
    }

    @Test
    public void updateVehicle_WithInvalidId() {
        // Arrange
        Long vehicleId = 1L;
        VehicleEntity updatedVehicle = new VehicleEntity( "Updated Vehicle", "Updated Brand", "Updated Plate", "Updated Color", "2");
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> vehicleController.updateVehicle(vehicleId, updatedVehicle));
        verify(vehicleRepository, times(1)).findById(vehicleId);
        verify(vehicleRepository, times(0)).save(any(VehicleEntity.class));
    }

    @Test
    public void deleteVehicle_WithValidId() {
        // Arrange
        Long vehicleId = 1L;
        VehicleEntity vehicle = new VehicleEntity("Vehicle 1", "Brand 1", "Plate 1", "Color 1", "4");
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));

        // Act
        ResponseEntity<Map<String, Boolean>> response = vehicleController.deleteVehicle(vehicleId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().get("deleted"));
        verify(vehicleRepository, times(1)).findById(vehicleId);
        verify(vehicleRepository, times(1)).delete(vehicle);
    }

    @Test
    public void deleteVehicle_WithInvalidId() {
        // Arrange
        Long vehicleId = 1L;
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> vehicleController.deleteVehicle(vehicleId));
        verify(vehicleRepository, times(1)).findById(vehicleId);
        verify(vehicleRepository, times(0)).delete(any(VehicleEntity.class));
    }
}
