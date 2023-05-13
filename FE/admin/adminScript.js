//------------------HOME----------------
function fetchBooking(){
    fetch('http://localhost:8080/api/v1/bookings')
    .then(response => response.json())
    .then(schedules => {
        writeSchedule(schedules);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function writeSchedule(schedules) {
    const table = document.querySelector('table');
    const tableHeader = document.createElement('tr');
    tableHeader.innerHTML = `
        <th>Booking Date</th>
        <th>Pick Up Time</th>
        <th>Pick Up Location</th>
        <th>Destination</th>
        <th>Estimated Time of Arrival</th>
        <th>User Name</th>
        <th>Passengers</th>
        <th>Car Plate</th>
        <th>Driver Name</th>
        <th>Payment Method</th>
        <th>Total</th>
        <th>Payment Status</th>
        <th>Process</th>
    `;
    table.appendChild(tableHeader);

    schedules.forEach(schedule => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${schedule.bookingDate}</td>
        <td>${schedule.bookingPickUpTime}</td>
        <td>${schedule.bookingPickUpLocation}</td>
        <td>${schedule.bookingDropOffLocation}</td>
        <td>${schedule.bookingDropOffTime}</td>
        <td>${schedule.user.userName}</td>
        <td>${schedule.bookingNumberOfPassengers}</td>
        <td>${schedule.vehicle.plate}</td>
        <td>${schedule.driver.driverName}</td>
        <td>${schedule.payment.paymentType}</td>
        <td>${schedule.payment.paymentAmount}</td>
        <td>${schedule.payment.paymentStatus}</td>
        <td>${schedule.bookingStatus}</td>
    `;
    table.appendChild(row);
    });
}

function logOut(selectedOption) {
    if (selectedOption === "logOut") {
        window.location.href = "employeeSignin.html";
    }
}

//-----------------DRIVER-----------------
function fetchDriver(driverList){
    fetch('http://localhost:8080/api/v1/drivers')
    .then(response => response.json())
    .then(drivers => {
        writeDriver(driverList, drivers);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function writeDriver(driverList, drivers) {
    drivers.forEach(driver=> {
        const driverElement = document.createElement('div');
        driverElement.innerHTML = `<span class="attribute-name">Name: </span>${driver.driverName}<br>
                                    <span class="attribute-name">Phone: </span>${driver.driverPhoneNumber}<br>
                                    <span class="attribute-name">License: </span>${driver.driverLicenseNumber}<br>
                                    <span class="attribute-name">Experience: </span>${driver.driverYearOfExperience}<br>`;
        driverElement.classList.add('driver');

        const editButtonElement = document.createElement('button');
        editButtonElement.textContent = 'Edit';
        editButtonElement.classList.add('edit-button');
        editButtonElement.addEventListener('click', () => {
            window.location.href = `editDriver.html?id=${driver.id}`;
        });
        driverElement.appendChild(editButtonElement);

        const deleteButtonElement = document.createElement('button');
        deleteButtonElement.textContent = 'Delete';
        deleteButtonElement.classList.add('delete-button');
        deleteButtonElement.addEventListener('click', () => {
            window.location.href = `deleteDriver.html?id=${driver.id}`;
        });
        driverElement.appendChild(deleteButtonElement);

        driverList.appendChild(driverElement);
    });
}


//---------------ADD DRIVER---------------
function addDriver(newDriver) {
    fetch('http://localhost:8080/api/v1/drivers', {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDriver)
    })
    .then(response => {
        if (response.ok) {
            document.querySelector('.success-message').textContent = 'Driver created successfully!';
        } else {
            document.querySelector('.error-message').textContent = 'Error creating new driver. Please try again.';
        }
    }).then(json => {
            console.log(json)
        })
    .catch(error => {
        console.log(error);
        document.querySelector('.error-message').textContent = 'An error occurred. Please try again later.';
    });
}

//---------------EDIT DRIVER---------------
function driverAutoFillForm(driverId){
    fetch('http://localhost:8080/api/v1/drivers')
    .then(response => response.json())
    .then(drivers => {
        const driver = drivers.find(d => d.id === parseInt(driverId));
        document.getElementById('name').value = driver.driverName;
        document.getElementById('phone').value = driver.driverPhoneNumber;
        document.getElementById('license').value = driver.driverLicenseNumber;
        document.getElementById('experience').value = driver.driverYearOfExperience;
        document.getElementById('password').value = driver.driverPassword;
        avatar = driver.driverAvatar;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function editDriver(updatedDriver){
    fetch(`http://localhost:8080/api/v1/drivers/${driverId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDriver)
    })
    .then(response => {
        if (response.ok) {
            document.querySelector('.success-message').textContent = 'Driver updated successfully!';
        } else {
            document.querySelector('.error-message').textContent = 'Error updating driver. Please try again.';
        }
    })
    .catch(error => {
        console.log(error);
        document.querySelector('.error-message').textContent = 'An error occurred. Please try again later.';
    });
}

//---------------DELETE DRIVER---------------
function deleteDriver(driverId, event){
    event.preventDefault();
    fetch(`http://localhost:8080/api/v1/drivers/${driverId}`, {
        method: "DELETE",
    })
    .then(response => {
        if (response.ok) {
            document.querySelector('.success-message').textContent = 'Driver deleted successfully!';
        } else {
            document.querySelector('.error-message').textContent = 'Error deleting driver. Please try again.';
        }
    })
    .catch(error => {
        console.log(error);
        document.querySelector('.error-message').textContent = 'An error occurred. Please try again later.';
    });
}

//-----------------VEHICLE-----------------
function fetchVehicle(vehicleList){
    fetch('http://localhost:8080/api/v1/vehicles')
    .then(response => response.json())
    .then(vehicles => {
        vehicles.forEach(vehicle => {
            const vehicleElement = document.createElement('div');
            vehicleElement.innerHTML = `<span class="attribute-name">Brand: </span>${vehicle.brand}<br>
                                        <span class="attribute-name">Name: </span>${vehicle.name}<br>
                                        <span class="attribute-name">Seats: </span>${vehicle.seatNumber}<br>
                                        <span class="attribute-name">Plate: </span>${vehicle.plate}<br>`;
            vehicleElement.classList.add('vehicle');

            const editButtonElement = document.createElement('button');
            editButtonElement.textContent = 'Edit';
            editButtonElement.classList.add('edit-button');
            editButtonElement.addEventListener('click', () => {
                window.location.href = `editVehicle.html?id=${vehicle.id}`;
            });
            vehicleElement.appendChild(editButtonElement);

            const deleteButtonElement = document.createElement('button');
            deleteButtonElement.textContent = 'Delete';
            deleteButtonElement.classList.add('delete-button');
            deleteButtonElement.addEventListener('click', () => {
                window.location.href = `deleteVehicle.html?id=${vehicle.id}`;
            });
            vehicleElement.appendChild(deleteButtonElement);

            vehicleList.appendChild(vehicleElement);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    })
}



//---------------ADD VEHICLE---------------
function addVehicle(newVehicle){
    fetch('http://localhost:8080/api/v1/vehicles', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVehicle)
    })
    .then(response => {
        if (response.ok) {
            document.querySelector('.success-message').textContent = 'Vehicle created successfully!';
        } else {
            document.querySelector('.error-message').textContent = 'Error creating new vehicle. Please try again.';
        }
    }).then(json => {
            console.log(json)
        })
    .catch(error => {
        console.log(error);
        document.querySelector('.error-message').textContent = 'An error occurred. Please try again later.';
    });
}

//---------------EDIT VEHICLE---------------
function vehicleAutoFillForm(vehicleId){
    fetch('http://localhost:8080/api/v1/vehicles')
    .then(response => response.json())
    .then(vehicles => {
        const vehicle = vehicles.find(v => v.id === parseInt(vehicleId));
        document.getElementById('name').value = vehicle.name;
        document.getElementById('brand').value = vehicle.brand;
        document.getElementById('seat').value = vehicle.seatNumber;
        document.getElementById('colour').value = vehicle.color;
        document.getElementById('plate').value = vehicle.plate;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function editVehicle(updatedVehicle){
    fetch(`http://localhost:8080/api/v1/vehicles/${vehicleId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedVehicle)
    })
    .then(response => {
        if (response.ok) {
            document.querySelector('.success-message').textContent = 'Vehicle updated successfully!';
        } else {
            document.querySelector('.error-message').textContent = 'Error updating Vehicle. Please try again.';
        }
    })
    .catch(error => {
        console.log(error);
        document.querySelector('.error-message').textContent = 'An error occurred. Please try again later.';
    });
}

//---------------DELETE VEHICLE---------------
function deleteVehicle(vehicleId, event){
    event.preventDefault();
    fetch(`http://localhost:8080/api/v1/vehicles/${vehicleId}`, {
        method: "DELETE",
    })
    .then(response => {
        if (response.ok) {
            document.querySelector('.success-message').textContent = 'Vehicle deleted successfully!';
        } else {
            document.querySelector('.error-message').textContent = 'Error deleting vehicle. Please try again.';
        }
    })
    .catch(error => {
        console.log(error);
        document.querySelector('.error-message').textContent = 'An error occurred. Please try again later.';
    });
}

//---------------DRIVER MODE---------------
function fetchDriverMode(driverId){
    fetch('http://localhost:8080/api/v1/drivers')
    .then(response => response.json())
    .then(drivers => {
        const driver = drivers.find(d => d.id === parseInt(driverId));
        writeDriverInfor(driver, driverId);
    })
}

function writeDriverInfor(driver, driverId){
    const rightPanel = document.querySelector('.right-panel');
    rightPanel.innerHTML = `<h4>Driver Profile</h4> <br>
                            <span class="attribute-name">Name: </span> ${driver.driverName}<br>
                            <span class="attribute-name">Phone: </span> ${driver.driverPhoneNumber}<br>
                            <span class="attribute-name">License: </span> ${driver.driverLicenseNumber}<br>
                            <span class="attribute-name">Experience: </span> ${driver.driverYearOfExperience}<br>
                            <button class="edit-button" onclick="window.location.href = 'editDriverProfile.html?driver.id=${driverId}'">Edit Profile</button>`;
}
/*fetch('http://localhost:8080/bookings')
            .then(response => response.json())
            .then(schedules => {
                writeSchedule(schedules);
                writeDriverInfor(schedules[0].driver);
            })
            .catch(error => {
                console.error('Error:', error);
            });

            function writeSchedule(schedules) {
                const table = document.querySelector('table');
                const tableHeader = document.createElement('tr');
                tableHeader.innerHTML = `
                    <th>Booking Date</th>
                    <th>Pick Up Time</th>
                    <th>Pick Up Location</th>
                    <th>Destination</th>
                    <th>Estimated Time of Arrival</th>
                    <th>Payment Method</th>
                    <th></th>
                `;
                table.appendChild(tableHeader);

                schedules.forEach(schedule => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${schedule.bookingDate}</td>
                    <td>${schedule.bookingPickUpTime}</td>
                    <td>${schedule.bookingPickUpLocation}</td>
                    <td>${schedule.bookingDropOffLocation}</td>
                    <td>${schedule.bookingDropOffTime}</td>
                    <td>${schedule.payment.paymentType}</td>
                    <td>
                        <button class="finish-button">Finish</button>
                        <button class="view-more-button">View More</button>
                    </td>
                `;
                table.appendChild(row);
                });
            }*/ 

//--------------EDIT DRIVER PROFILE-------------
function token(driverId){
    const homeLink = document.querySelector('a[href="driver.html"]');
    const homeParams = new URLSearchParams(window.location.search);
    homeParams.set('driver.id', driverId);
    homeLink.href = `driver.html?${homeParams.toString()}`;
}

function autoFillDriverForm(driverId) {
    fetch('http://localhost:8080/api/v1/drivers')
    .then(response => response.json())
    .then(drivers => {
        const driver = drivers.find(d => d.id === parseInt(driverId));
        document.getElementById('name').value = driver.driverName;
        document.getElementById('phone').value = driver.driverPhoneNumber;
        document.getElementById('license').value = driver.driverLicenseNumber;
        document.getElementById('experience').value = driver.driverYearOfExperience;
        document.getElementById('password').value = driver.driverPassword;
        document.getElementById('confirm-password').value = driver.driverPassword;
        avatar = driver.driverAvatar;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function editDriverProfile(driverId, event) {
    event.preventDefault();
    if(document.querySelector('#password').value != document.querySelector('#confirm-password').value){
        document.querySelector('.error-message').textContent = 'Passwords are not matching!';
        return;
    }

    let name = document.querySelector('#name').value;
    let phone = document.querySelector('#phone').value;
    let license = document.querySelector('#license').value;
    let experience = document.querySelector('#experience').value;
    let password = document.querySelector('#password').value;

    const updatedDriver = {
        id: driverId,
        driverName: name,
        driverPhoneNumber: phone,
        driverLicenseNumber: license,
        driverYearOfExperience: experience,
        driverPassword: password,
        driverAvatar: avatar
    };

    fetch(`http://localhost:8080/api/v1/drivers/${driverId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDriver)
    })
    .then(response => {
        if (response.ok) {
            document.querySelector('.success-message').textContent = 'Your profile updated successfully!';
        } else {
            document.querySelector('.error-message').textContent = 'Error updating profile. Please try again.';
        }
    })
    .catch(error => {
        console.log(error);
        document.querySelector('.error-message').textContent = 'An error occurred. Please try again later.';
    });
}



