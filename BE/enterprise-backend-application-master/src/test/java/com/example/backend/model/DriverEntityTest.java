package com.example.backend.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DriverEntityTest {

    @Test
    void getId() {
        // Arrange
        Long expectedId = 1L;
        DriverEntity driver = new DriverEntity();
        driver.setId(expectedId);

        // Act
        Long actualId = driver.getId();

        // Assert
        assertEquals(expectedId, actualId);
    }

    @Test
    void getDriverName() {
        // Arrange
        String expectedName = "John Doe";
        DriverEntity driver = new DriverEntity();
        driver.setDriverName(expectedName);

        // Act
        String actualName = driver.getDriverName();

        // Assert
        assertEquals(expectedName, actualName);
    }

    @Test
    void getDriverPhoneNumber() {
        // Arrange
        String expectedPhoneNumber = "1234567890";
        DriverEntity driver = new DriverEntity();
        driver.setDriverPhoneNumber(expectedPhoneNumber);

        // Act
        String actualPhoneNumber = driver.getDriverPhoneNumber();

        // Assert
        assertEquals(expectedPhoneNumber, actualPhoneNumber);
    }

    @Test
    void getDriverLicenseNumber() {
        // Arrange
        String expectedLicenseNumber = "ABC123";
        DriverEntity driver = new DriverEntity();
        driver.setDriverLicenseNumber(expectedLicenseNumber);

        // Act
        String actualLicenseNumber = driver.getDriverLicenseNumber();

        // Assert
        assertEquals(expectedLicenseNumber, actualLicenseNumber);
    }

    @Test
    void getDriverYearOfExperience() {
        // Arrange
        String expectedExperience = "5";
        DriverEntity driver = new DriverEntity();
        driver.setDriverYearOfExperience(expectedExperience);

        // Act
        String actualExperience = driver.getDriverYearOfExperience();

        // Assert
        assertEquals(expectedExperience, actualExperience);
    }

    @Test
    void getDriverAvatar() {
        // Arrange
        String expectedAvatar = "avatar.jpg";
        DriverEntity driver = new DriverEntity();
        driver.setDriverAvatar(expectedAvatar);

        // Act
        String actualAvatar = driver.getDriverAvatar();

        // Assert
        assertEquals(expectedAvatar, actualAvatar);
    }

    @Test
    void setId() {
        // Arrange
        Long expectedId = 1L;
        DriverEntity driver = new DriverEntity();

        // Act
        driver.setId(expectedId);

        // Assert
        assertEquals(expectedId, driver.getId());
    }

    @Test
    void setDriverName() {
        // Arrange
        String expectedName = "John Doe";
        DriverEntity driver = new DriverEntity();

        // Act
        driver.setDriverName(expectedName);

        // Assert
        assertEquals(expectedName, driver.getDriverName());
    }

    @Test
    void setDriverPhoneNumber() {
        // Arrange
        String expectedPhoneNumber = "1234567890";
        DriverEntity driver = new DriverEntity();

        // Act
        driver.setDriverPhoneNumber(expectedPhoneNumber);

        // Assert
        assertEquals(expectedPhoneNumber, driver.getDriverPhoneNumber());
    }

    @Test
    void setDriverLicenseNumber() {
        // Arrange
        String expectedLicenseNumber = "ABC123";
        DriverEntity driver = new DriverEntity();

        // Act
        driver.setDriverLicenseNumber(expectedLicenseNumber);

        // Assert
        assertEquals(expectedLicenseNumber, driver.getDriverLicenseNumber());
    }

    @Test
    void setDriverYearOfExperience() {
        // Arrange
        String expectedExperience = "5";
        DriverEntity driver = new DriverEntity();

        // Act
        driver.setDriverYearOfExperience(expectedExperience);

        // Assert
        assertEquals(expectedExperience, driver.getDriverYearOfExperience());
    }

    @Test
    void setDriverAvatar() {
        // Arrange
        String expectedAvatar = "avatar.jpg";
        DriverEntity driver = new DriverEntity();

        // Act
        driver.setDriverAvatar(expectedAvatar);

        // Assert
        assertEquals(expectedAvatar, driver.getDriverAvatar());
    }

    @Test
    void getDriverPassword() {
        // Arrange
        String expectedPassword = "password";
        DriverEntity driver = new DriverEntity();
        driver.setDriverPassword(expectedPassword);

        // Act
        String actualPassword = driver.getDriverPassword();

        // Assert
        assertEquals(expectedPassword, actualPassword);
    }

    @Test
    void setDriverPassword() {
        // Arrange
        String expectedPassword = "password";
        DriverEntity driver = new DriverEntity();

        // Act
        driver.setDriverPassword(expectedPassword);

        // Assert
        assertEquals(expectedPassword, driver.getDriverPassword());
    }
}
