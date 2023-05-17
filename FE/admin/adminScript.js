//------------------HOME----------------
function fetchBooking() {
    fetch('http://localhost:8080/api/v1/bookings')
    .then(response => response.json())
    .then(schedules => {
        const searchButton = document.querySelector('button');
        if (searchButton.dataset.clicked === 'true') {
            writeSchedule(sortSchedules(filterSchedules(schedules)));
        } else {
            writeSchedule(sortSchedules(schedules));
        }
    })
    .catch(error => {
    console.error('Error:', error);
    });
}
  
function filterSchedules(schedules) {
    const searchDate = document.getElementById('search-date').value;
    const searchText = document.getElementById('search').value.toLowerCase();
    const paymentMethod = document.getElementById('payment-method').value;
    const paymentStatus = document.getElementById('payment-status').value;
    const process = document.getElementById('process').value;
  
    return schedules.filter(schedule => {
        if (searchDate && schedule.bookingDate !== searchDate) {
            return false;
        }

        if (searchText && !containsSearchText(schedule, searchText)) {
            return false;
        }

        if (paymentMethod && schedule.payment.paymentType !== paymentMethod) {
            return false;
        }

        if (paymentStatus && schedule.payment.paymentStatus !== paymentStatus) {
            return false;
        }

        if (process && schedule.status !== process) {
            return false;
        }
        return true;
    });
}
  
  function containsSearchText(schedule, searchText) {
    const user = schedule.user.userName.toLowerCase();
    const vehicle = schedule.vehicle.plate.toLowerCase();
    const driver = schedule.driver.driverName.toLowerCase();
    return user.includes(searchText) || vehicle.includes(searchText) || driver.includes(searchText);
  }

function sortSchedules(schedules) {
    return schedules.sort((a, b) => {
      const dateComparison = new Date(a.bookingDate) - new Date(b.bookingDate);
      if (dateComparison !== 0) {
        return dateComparison;
      }

      return a.bookingPickUpTime.localeCompare(b.bookingPickUpTime);
    });
  }
  
function writeSchedule(schedules) {
    const table = document.querySelector('.schedule-table');
  
    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }
  
    const tableHeader = document.createElement('tr');
    tableHeader.innerHTML = `
      <th>Booking Date</th>
      <th>Pick Up Time</th>
      <th>Pick Up Location</th>
      <th>Destination</th>
      <th>Arrival Time</th>
      <th>User Name</th>
      <th>Passengers</th>
      <th>Car Plate</th>
      <th>Driver Name</th>
      <th>Payment Method</th>
      <th>Total</th>
      <th>Payment Status</th>
      <th>Process</th>
      <th></th>
    `;
    table.appendChild(tableHeader);
  
    if (schedules.length === 0) {
      const noBookingsRow = document.createElement('tr');
      const noBookingsCell = document.createElement('td');
      noBookingsCell.setAttribute('colspan', '13');
      noBookingsCell.textContent = 'No bookings found.';
      noBookingsCell.classList.add('no-bookings-message');
      noBookingsRow.appendChild(noBookingsCell);
      table.appendChild(noBookingsRow);
    } else {
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
          <td>${schedule.status}</td>
          <td>
                <button style="border-radius: 5px; padding: 10px; background-color: rgba(255, 205, 107, 0.5)" class="edit-button" data-schedule-id="${schedule.id}">
                Edit
                </button>
            </td>
        `;
        table.appendChild(row);

        const editButton = row.querySelector('.edit-button');
        editButton.addEventListener('click', () => {
            const scheduleId = parseInt(editButton.getAttribute('data-schedule-id'));
            const url = `editBooking.html?id=${scheduleId}`;
            window.location.href = url;
        });
      });
    }
}
  
function logOut(selectedOption) {
    if (selectedOption === "logOut") {
        window.location.href = "employeeSignin.html";
    }
}

//----------------EDIT BOOKING-------------
function bookingAutoFillForm(bookingId){
    fetch('http://localhost:8080/api/v1/bookings')
    .then(response => response.json())
    .then(bookings => {
        const booking = bookings.find(b => b.id === parseInt(bookingId));
        document.getElementById('booking-date').value = booking.bookingDate;
        document.getElementById('pick-up-time').value = booking.bookingPickUpTime;
        document.getElementById('pick-up-location').value = booking.bookingPickUpLocation;
        document.getElementById('destination').value = booking.bookingDropOffLocation;
        document.getElementById('passenger').value = booking.bookingNumberOfPassengers;
        document.getElementById('seats').value = booking.vehicle.seatNumber;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function validateBookingInputs(pickupDate, pickupTime, passenger,seats) {
    var currentDate = new Date();
    var pickupDateTime = new Date(pickupDate + ' ' + pickupTime);

    if (!pickupDate || !pickupTime) {
        return "Please fill in all the fields.";
    }

    if (pickupDateTime <= currentDate || pickupDateTime.getTime() - currentDate.getTime() < 2 * 60 * 60 * 1000) {
        return "The pickup date and time must be at least 2 hours from now.";
    }

    if (isNaN(passenger) || parseInt(passenger) < 1 || parseInt(passenger) > seats) {
        return "Passenger must be a positive integer and smaller than the chosen vehicle's seat type!";
    }

    return null;
}

function editBooking(updatedBooking, bookingId) {
    fetch(`http://localhost:8080/api/v1/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBooking)
    })
    .then(response => {
        if (response.ok) {
            document.querySelector('.success-message').textContent = 'Booking updated successfully!';
        } else {
            document.querySelector('.error-message').textContent = 'Error updating booking. Please try again.';
        }
    }).then(json => {
            console.log(json)
        })
    .catch(error => {
        console.log(error);
        document.querySelector('.error-message').textContent = 'An error occurred. Please try again later.';
    });
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
        driverElement.setAttribute('data-phone', driver.driverPhoneNumber);
        driverElement.setAttribute('data-name', driver.driverName);
        driverElement.setAttribute('data-license', driver.driverLicenseNumber);
        driverElement.setAttribute('data-experience', driver.driverYearOfExperience);

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
function validateDriverInputs(phone, license, yearOfExperience) {
    const licenseRegex = /^\d{9}$/;
    const phoneRegex = /^84\d{9}$/; 
    
    if (!licenseRegex.test(license)) {
        return "Invalid driver's license format. Please enter a valid license in the format CDDDD!";
    }

    if (!phoneRegex.test(phone)) {
      return "Invalid phone number. Please enter a valid phone number!";
    }
  
    if (!Number.isInteger(yearOfExperience) && yearOfExperience < 1) {
      return "Invalid year of experience!";
    }
  
    return null; 
}

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

function handleAddDriverByCSV(event) {
    event.preventDefault();
  
    const fileInput = document.getElementById('csv-file');
    const file = fileInput.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = handleDriverCSVFileRead;
      reader.onerror = handleDriverCSVFileError;
    } else {
      console.log('No file selected.');
    }
}
  
function handleDriverCSVFileRead(event) {
    const csvData = event.target.result;
    addDriversFromCSV(csvData);
}
  
function handleDriverCSVFileError(event) {
    console.error('Error reading CSV file:', event.target.error);
}
  
function addDriversFromCSV(csvData) {
    const driverArray = [];
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map((value) => value.trim());

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = line.split(',').map((value) => value.trim().replace(/(^"|"$)/g, ''));
      const driver = {};
      for (let j = 0; j < headers.length; j++) {
        driver[headers[j]] = values[j];
      }
      driverArray.push(driver);
    }

    driverArray.forEach((driver) => {
        console.log(driver);
        addDriver(driver);
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
                                        <span class="attribute-name">Colour: </span>${vehicle.color}<br>
                                        <span class="attribute-name">Plate: </span>${vehicle.plate}<br>`;
            vehicleElement.classList.add('vehicle');
            vehicleElement.setAttribute('data-brand', vehicle.brand);
            vehicleElement.setAttribute('data-name', vehicle.name);
            vehicleElement.setAttribute('data-seat', vehicle.seatNumber);

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
function validateVehicleInputs(seats, plate) {
    const validSeats = [4, 7, 16, 29, 36, 45];
    const plateRegex = /^\d{2}[A-Z]\s\d{5}$/;
    
    if (!validSeats === seats) {
      return "Invalid number of seats. Please enter a valid number of seats: 4, 7, 16, 29, 35, or 45.";
    }
  
    if (!plateRegex === plate) {
      return "Invalid license plate format. Please enter a valid plate in the format DDC DDDDD!";
    }
  
    return null;
}

function addVehicle(newVehicle) {
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
        return response.json(); 
      } else {
        throw new Error('Error creating new vehicle. Please try again.');
      }
    })
    .then(json => {
      console.log(json); 
    })
    .catch(error => {
      console.log(error);
    });
  }

function handleAddVehicleByCSV(event) {
    event.preventDefault();
  
    const fileInput = document.getElementById('csv-file');
    const file = fileInput.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = handleVehicleCSVFileRead;
      reader.onerror = handleVehicleCSVFileError;
    } else {
      console.log('No file selected.');
    }
}
  
function handleVehicleCSVFileRead(event) {
    const csvData = event.target.result;
    addVehiclesFromCSV(csvData);
    document.querySelector('.success-message').textContent = 'Vehicle created successfully!';
}
  
function handleVehicleCSVFileError(event) {
    console.error('Error reading CSV file:', event.target.error);
}
  
function addVehiclesFromCSV(csvData) {
    const vehicleArray = [];
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map((value) => value.trim());

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = line.split(',').map((value) => value.trim());
      const vehicle = {};
      for (let j = 0; j < headers.length; j++) {
        vehicle[headers[j]] = values[j];
      }
      vehicleArray.push(vehicle);
    }

    vehicleArray.forEach((vehicle) => {
        console.log(vehicle);
        addVehicle(vehicle);
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
        writeDriverSchedule(driverId);
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

function writeDriverSchedule(driverId) {
    fetch('http://localhost:8080/api/v1/bookings')
    .then(response => response.json())
    .then(schedules => {
        const driverSchedule = schedules.filter(schedule => parseInt(schedule.driver.id) === parseInt(driverId) && schedule.status === 'processing');
        scheduleDisplay(driverSchedule);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function scheduleDisplay(schedules) {
    const table = document.querySelector('table');

    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    const tableHeader = document.createElement('tr');
    tableHeader.innerHTML = `
        <th>Booking Date</th>
        <th>Pick Up Time</th>
        <th>Pick Up Location</th>
        <th>Destination</th>
        <th>Estimated Time of Arrival</th>
        <th>User Name</th>
        <th>User's Phone</th>
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
            <td>${schedule.user.id}</td>
            <td>${schedule.user.userPhoneNumber}</td>
            <td>${schedule.payment.paymentType}</td>
            <td>
                <button class="finish-button" data-schedule-id="${schedule.id}">Finish</button>
            </td>
        `;
        table.appendChild(row);

        const finishButton = row.querySelector('.finish-button');
        finishButton.addEventListener('click', () => {
            const scheduleId = parseInt(finishButton.getAttribute('data-schedule-id'));
            handleFinishBooking(scheduleId);
        });
    });
}

function handleFinishBooking(scheduleId) {
    fetch(`http://localhost:8080/api/v1/bookings/status/${scheduleId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'finish' })
    })
    .then(response => response.json())
    .then(updatedSchedule => {
        writeDriverSchedule(driverId);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

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

    document.querySelector('.error-message').textContent = '';
    document.querySelector('.success-message').textContent = '';

    let name = document.querySelector('#name').value;
    let phone = document.querySelector('#phone').value;
    let license = document.querySelector('#license').value;
    let experience = document.querySelector('#experience').value;
    let password = document.querySelector('#password').value;

    const error = validateDriverInputs(phone, license, parseInt(experience));
    if(error){
        document.querySelector('.error-message').textContent = error;
        return;
    }

    if(document.querySelector('#password').value != document.querySelector('#confirm-password').value){
        document.querySelector('.error-message').textContent = 'Passwords are not matching!';
        return;
    }

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



