//------------------SIGN UP-----------------
function signUp(event){
    event.preventDefault();
    let name = document.querySelector('#name').value;
    let phone = document.querySelector('#phone').value;
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    let confirm_password = document.querySelector('#confirm-password').value;

    validateSignUp(name, phone, email, password, confirm_password);
}

function validateSignUp(name, phone, email, password, confirm_password){
    fetch('http://localhost:8080/api/v1/users')
    .then(response => response.json())
    .then(users => {
        const foundUser = users.find(user => user.userEmail === email);
        if (foundUser) {
            document.querySelector('.error-message').textContent = 'This email is already signed up. Please use a different email.';
            return; 
        }

        if(password != confirm_password){
            document.querySelector('.error-message').textContent = 'Passwords are not matched!';
            return;
        }

        const newUser = {
            userName: name, 
            userPhoneNumber: phone, 
            userEmail: email, 
            userPassword: password
        };

        addUser(newUser);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function addUser(newUser){
    fetch('http://localhost:8080/api/v1/users', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then(response => {
        if (response.ok) {
            document.querySelector('.success-message').textContent = 'Sign Up successfully!';
        } else {
            document.querySelector('.error-message').textContent = 'Error signing up. Please try again.';
        }
    }).then(json => {
        console.log(json)
    })
    .catch(error => {
        console.log(error);
        document.querySelector('.error-message').textContent = 'An error occurred. Please try again later.';
    });
}

//------------------SIGN IN-----------------
function signIn(event) {
    event.preventDefault(); // Prevents the form from submitting normally
    const urlParams = new URLSearchParams(window.location.search);
    const pickupLocation = decodeURIComponent(urlParams.get('pickupLocation'));
    const destination = decodeURIComponent(urlParams.get('destination'));
    const pickupDate = urlParams.get('pickupDate');
    const pickupTime = urlParams.get('pickupTime');
    const seatsType = urlParams.get('seatsType');
    const childrenInput = urlParams.get('childrenInput');
    const adultInput = urlParams.get('adultInput');
    const vehicleId = urlParams.get('vehicleId');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/api/v1/users')
    .then(response => response.json())
    .then(users => {
        const foundUser = users.find(user => user.userEmail === email && user.userPassword === password);
        if (!foundUser) {
            alert("Invalid email or password. Please try again.");
            return; 
        }
        if (pickupLocation && destination && pickupDate && pickupTime && seatsType && childrenInput && adultInput && vehicleId){
            url = `confirmation.html?user.id=${foundUser.id}&pickupLocation=${pickupLocation}&destination=${destination}&pickupDate=${pickupDate}&pickupTime=${pickupTime}&seatsType=${seatsType}&childrenInput=${childrenInput}&adultInput=${adultInput}&vehicleId=${vehicleId}`;
            window.location.href = url;
            return;
        }
        window.location.href = `home.html?user.id=${foundUser.id}`;
        return; 
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
}

//-----------------EDIT PROFILE-----------------
function autoFillUserForm(userId) {
    fetch('http://localhost:8080/api/v1/users')
    .then(response => response.json())
    .then(users => {
        const user = users.find(u => u.id === parseInt(userId));
        document.getElementById('name').value = user.userName;
        document.getElementById('phone').value = user.userPhoneNumber;
        document.getElementById('email').value = user.userEmail;
        document.getElementById('password').value = user.userPassword;
        document.getElementById('confirm-password').value = user.userPassword;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function editUser(userId, event){
    event.preventDefault();
    if(document.querySelector('#password').value != document.querySelector('#confirm-password').value){
        document.querySelector('.error-message').textContent = 'Passwords are not matching!';
        return;
    }

    let name = document.querySelector('#name').value;
    let phone = document.querySelector('#phone').value;
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;

    const updatedUser = {
        id: userId,
        userName: name, 
        userPhoneNumber: phone, 
        userEmail: email, 
        userPassword: password
    };

    fetch(`http://localhost:8080/api/v1/users/${userId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
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

//------------------HOME-------------------
function token(userId){
    const homeLink = document.querySelector('a[href="home.html"]');
    const homeParams = new URLSearchParams(window.location.search);
    homeParams.set('user.id', userId);
    homeLink.href = `home.html?${homeParams.toString()}`;

    const aboutUsLink = document.querySelector('a[href="about_us.html"]');
    const aboutUsParams = new URLSearchParams(window.location.search);
    aboutUsParams.set('user.id', userId);
    aboutUsLink.href = `about_us.html?${aboutUsParams.toString()}`;

    const bookingLink = document.querySelector('a[href="booking.html"]');
    const bookingParams = new URLSearchParams(window.location.search);
    bookingParams.set('user.id', userId);
    bookingLink.href = `booking.html?${bookingParams.toString()}`;

    const vehicleLink = document.querySelector('a[href="vehicle.html"]');
    const vehicleParams = new URLSearchParams(window.location.search);
    vehicleParams.set('user.id', userId);
    vehicleLink.href = `vehicle.html?${vehicleParams.toString()}`;

    getUserName(userId)
        .then(userName => {
            welcomeUser(userName);
        })
        .catch(error => {
        console.error('Error:', error);
        });
}

function getUserName(id) {
    return fetch(`http://localhost:8080/api/v1/users`)
        .then(response => response.json())
        .then(users => {
        const foundUser = users.find(user => user.id === parseInt(id));
        if (foundUser) {
            return foundUser.userName;
        } else {
            throw new Error(`User with id ${id} not found`);
        }
        })
        .catch(error => {
        console.error('Error:', error);
        });
}

function welcomeUser(userName){
    const selectBox = document.createElement('select');
    selectBox.id = 'user-account';
    selectBox.innerHTML = `
        <option value="">Welcome, ${userName}</option>
        <option value="profile.html">My Profile</option>
        <option value="signout.html">Sign Out</option>
    `;
    const signinBtn = document.getElementById('signin-btn');
    signinBtn.parentNode.replaceChild(selectBox, signinBtn);

    selectBox.addEventListener("change", function() {
        const selectedOption = selectBox.value;
        if (selectedOption === "profile.html") {
        window.location.href = "editProfile.html?user.id=" + userId;
        } else if (selectedOption === "signout.html") {
        window.location.href = 'signin.html';
        }
    });
}

function search() {
    const pickupLocation = document.getElementById("pick-up-location");
    const destination = document.getElementById("destination");
    const pickupDate = document.getElementById("pick-up-date");
    const pickupTime = document.getElementById("pick-up-time");
    const seatsType = document.getElementById("seats-type");
    const childrenInput = document.getElementById("children-input");
    const adultInput = document.getElementById("adult-input");

    if(!childrenInput.value){
        childrenInput.value = 0;
    }

    const totalPassengers = parseInt(childrenInput.value) + parseInt(adultInput.value);
    
    if(!searchValidation(pickupLocation, destination, pickupDate, pickupTime, seatsType, childrenInput, adultInput, totalPassengers)){
        return
    }

    if(userId === null){
        const url = `searchPage.html?pickupLocation=${pickupLocation.value}&destination=${destination.value}&pickupDate=${pickupDate.value}&pickupTime=${pickupTime.value}&seatsType=${seatsType.value}&childrenInput=${childrenInput.value}&adultInput=${adultInput.value}`;
        window.location.href = url;
        return;
    }
    const url = `searchPage.html?user.id=${userId}&pickupLocation=${pickupLocation.value}&destination=${destination.value}&pickupDate=${pickupDate.value}&pickupTime=${pickupTime.value}&seatsType=${seatsType.value}&childrenInput=${childrenInput.value}&adultInput=${adultInput.value}`;
    window.location.href = url;
}

function searchValidation(pickupLocation, destination, pickupDate, pickupTime, seatsType, childrenInput, adultInput, totalPassengers) {
    if(!pickupLocation.value){
        alert("You haven't input the pick up location!");
        return false;
    }

    if(!destination.value){
        alert("You haven't input the destination!");
        return false;
    }

    if(pickupLocation.value === destination.value){
        alert("The pick up location and destination cannot be the same!");
        return false;
    }

    if(!pickupDate.value){
        alert("You haven't input the pick up date!");
        return false;
    }

    if(!pickupTime.value){
        alert("You haven't input the pick up time!");
        return false;
    }

    var currentDate = new Date();
    var pickupDateTime = new Date(pickupDate.value + ' ' + pickupTime.value);
    console.log(pickupDateTime);
    if(pickupDateTime <= currentDate || pickupDateTime.getTime() - currentDate.getTime() < 2*60*60*1000){
        alert("The pickup date and time must be at least 2 hours from now.");
        return false;
    }

    if(!childrenInput.value && !adultInput.value){
        alert("You haven't input the number of children and adult passengers!");
        return false;
    }

    if(seatsType.value < totalPassengers + 1) {
        alert("The total passengers are more than the seat type of the vehicle. Please select the vehicle with a larger seat type number.");
        return false;
    } 

    return true;
}

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("container").style.top = "0";
    } else {
        document.getElementById("container").style.top = "-50px";
    }
}

//------------------SEARCH PAGE-------------------
function searchVehicle() {
    fetch('http://localhost:8080/api/v1/vehicles')
    .then(response => response.json())
    .then(vehicles => {
        return fetch('http://localhost:8080/api/v1/bookings')
            .then(response => response.json())
            .then(bookings => {
                const availableVehicles = vehicles.filter(vehicle => {
                    return parseInt(vehicle.seatNumber) >= seatsType && 
                        bookings.filter(schedule => schedule.vehicleId === vehicle.id && schedule.date === pickupDate).length === 0;
                    });
                console.log(availableVehicles);
                return availableVehicles;
            });
    })
    .then(availableVehicles => {
        displayAvailableVehicle(availableVehicles);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayAvailableVehicle(availableVehicles){
    availableVehicles.sort((a, b) => a.seatNumber - b.seatNumber);
    availableVehicles.forEach(vehicle => {
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

        const buttonElement = document.createElement('button');
        buttonElement.textContent = 'Booking';
        buttonElement.classList.add('booking-button');
        buttonElement.addEventListener('click', () => {
            if(userId === null){
                const error = confirm("You need to sign in before making a booking. Do you want to sign in?");
                if(error){
                    sign_in_url =  `signin.html?pickupLocation=${pickupLocation}&destination=${destination}&pickupDate=${pickupDate}&pickupTime=${pickupTime}&seatsType=${seatsType}&childrenInput=${childrenInput}&adultInput=${adultInput}&vehicleId=${vehicle.id}`;
                    window.location.href = sign_in_url ;
                    return;
                } else {
                    return;
                }
            }
            url = `confirmation.html?user.id=${userId}&pickupLocation=${pickupLocation}&destination=${destination}&pickupDate=${pickupDate}&pickupTime=${pickupTime}&seatsType=${seatsType}&childrenInput=${childrenInput}&adultInput=${adultInput}&vehicleId=${vehicle.id}`;

            window.location.href = url;
        });
        vehicleElement.appendChild(buttonElement);
        vehicleList.appendChild(vehicleElement);
    });
}

//------------------CONFIRMATION PAGE-------------------
function autoFillUser(userId){
    fetch('http://localhost:8080/api/v1/users')
    .then(response => response.json())
    .then(users => {
        const user = users.find(u => u.id === parseInt(userId));
        document.getElementById('name').value = user.userName;
        document.getElementById('email').value = user.userEmail;
        document.getElementById('phone').value = user.userPhoneNumber;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function autoFillVehicle(pickupLocation, destination, vehicleId){
    fetch('http://localhost:8080/api/v1/vehicles')
    .then(response => response.json())
    .then(vehicles => {
        const vehicle = vehicles.find(v => v.id === parseInt(vehicleId));
        document.getElementById('brand').value = vehicle.brand;
        document.getElementById('car-name').value = vehicle.name;
        document.getElementById('seatNumber').value = vehicle.seatNumber;
        document.getElementById('colour').value = vehicle.color;
        document.getElementById('plate').value = vehicle.plate;

        const vehicleFee = calculateVehicleFee(vehicle.seatNumber);

        costSummary(pickupLocation, destination, vehicleFee);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function autoFillDriver(pickupDate) {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:8080/api/v1/drivers')
        .then(response => response.json())
        .then(drivers => {
            fetch('http://localhost:8080/api/v1/bookings')
            .then(response => response.json())
            .then(bookings => {
                const availableDriver = drivers.find(driver => 
                bookings.filter(schedule => schedule.driverId === driver.id && schedule.date === pickupDate).length === 0
                );
                document.getElementById('driver-name').value = availableDriver.driverName;
                document.getElementById('license').value = availableDriver.driverLicenseNumber;
                document.getElementById('driver-phone').value = availableDriver.driverPhoneNumber;
                resolve(availableDriver.id);
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            reject(error);
        });
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function calculateCost(distance, vehicleFee) {
    if (distance <= 50) {
        totalCost = distance * 5 * vehicleFee;
    } else if (distance <= 100) {
        totalCost = ((50 * 5) + ((distance - 50) * 7)) * vehicleFee;
    } else {
        totalCost = ((50 * 5) + (50 * 7) + ((distance - 100) * 10)) * vehicleFee;
    }
    return Math.round(totalCost,0) * 1000;
}

function calculateVehicleFee(vehicleSeatNumber) {
    const vehicleFees =[
        {seatNumber: "4", fee: 1.0},
        {seatNumber: "7", fee: 1.2},
        {seatNumber: "16", fee: 1.5},
        {seatNumber: "29", fee: 1.75},
        {seatNumber: "35", fee: 2.0},
        {seatNumber: "45", fee: 2.25}
    ];

    const vehicleFee = vehicleFees.find(vf => vf.seatNumber === vehicleSeatNumber);
    return vehicleFee ? vehicleFee.fee : 1.0; // default fee of 1.0
}

function estimateTravelingTime(pickupLocation, destination){
    const locations = [
        { name: "Ho Chi Minh", lat: 10.823, lon: 106.6297 },
        { name: "Vung Tau", lat: 10.346, lon: 107.0843 },
        { name: "Dong Nai", lat: 11.1097639, lon: 107.1957203 },
        { name: "Long An", lat: 10.695572, lon: 106.2431205 },
        { name: "Can Tho", lat: 10.0371, lon: 105.7883}
    ];

    for (let i = 0; i < locations.length; i++) {
        for (let j = i + 1; j < locations.length; j++) {
            if (locations[i].name === pickupLocation && locations[j].name === destination) {
                return calculateDistance(locations[i].lat, locations[i].lon, locations[j].lat, locations[j].lon);
            }
        }
    }
}

function costSummary(pickupLocation, destination, vehicleFee){
    const locations = [
        { name: "Ho Chi Minh", lat: 10.823, lon: 106.6297 },
        { name: "Vung Tau", lat: 10.346, lon: 107.0843 },
        { name: "Dong Nai", lat: 11.1097639, lon: 107.1957203 },
        { name: "Long An", lat: 10.695572, lon: 106.2431205 },
        { name: "Can Tho", lat: 10.0371, lon: 105.7883}
    ];

    for (let i = 0; i < locations.length; i++) {
        for (let j = i + 1; j < locations.length; j++) {
            if (locations[i].name === pickupLocation && locations[j].name === destination) {
                if(pickupLocation === "Ho Chi Minh"){
                    const distance = calculateDistance(locations[i].lat, locations[i].lon, locations[j].lat, locations[j].lon);

                    displayCost(distance, vehicleFee);
                } else {
                    const distance = (calculateDistance(locations[i].lat, locations[i].lon, locations[j].lat, locations[j].lon) * 1.25);
                
                    displayCost(distance, vehicleFee);
                }
            }
        }
    }
}

function displayCost(distance, vehicleFee){
    const taxRate = 0.1; 

    const cost = calculateCost(distance, vehicleFee);
    const tax = Math.round((cost/1000) * taxRate * 1000, 0);
    const total = cost + tax;
    document.getElementById('subtotal').innerHTML = `${cost}`;
    document.getElementById('tax').innerHTML = `${tax}`;
    document.getElementById('total').innerHTML = `${total}`;
}

function addPayment(paymentMethod, amount, pickupDate){
    const newPayment = {
        paymentType: paymentMethod, 
        paymentAmount: amount, 
        paymentStatus: 'unpaid', 
        paymentDate: pickupDate, 
    };

    return fetch('http://localhost:8080/api/v1/payments', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPayment)
    })
    .then(response => {
        if (response.ok) {
          return response.json(); // Return the full response object
        } else {
          throw new Error('Error adding payment. Please try again.');
        }
      })
    .catch(error => {
        console.log(error);
        document.querySelector('.error-message').textContent = 'An error occurred. Please try again later.';
    });
}

//------------------PAYMENT PAGE-------------------
function redirectAfter10Seconds() {
    let count = 10;
    const countdown = setInterval(() => {
        count--;
        document.getElementById("countdown").innerHTML = count;
        if (count === 0) {
            clearInterval(countdown);
            /*window.location.href = `complete.html?user.id=${userId}`;*/
        }
    }, 1000);
}

//------------------COMPLETE PAGE------------------
function addBooking(userId) {
    const pickupLocation = urlParams.get('pickupLocation');
    const destination = urlParams.get('destination');
    const pickupDate = urlParams.get('pickupDate');
    const pickupTime = urlParams.get('pickupTime');
    const travelingTime = urlParams.get('travelingTime');
    const childrenInput = urlParams.get('childrenInput');
    const adultInput = urlParams.get('adultInput');
    const vehicleId = urlParams.get('vehicleId');
    const driverId = urlParams.get('driverId');
    const paymentId = urlParams.get('paymentId');

    const passengers = parseInt(childrenInput) + parseInt(adultInput);

    const user = {
        id: 1, 
        userName: 'test', 
        userEmail: 'test', 
        userPassword: 'test1', 
        userPhoneNumber: '84', 
        bookings: []
    }

    const newBooking = {
        bookingDate: pickupDate,
        user: user,
        bookingPickUpLocation: pickupLocation,
        bookingDropOffLocation: destination,
        bookingPickUpTime: pickupTime,
        bookingDropOffTime: '',
        bookingNumberOfPassengers: passengers,
        vehicle: null,
        driver: null,
        payment: null
    };

    console.log(newBooking);

    fetch('http://localhost:8080/api/v1/bookings', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBooking)
      })
      .then(response => {
        if (response.ok) {
          return response.json(); // Return the full response object
        } else {
          throw new Error('Error adding payment. Please try again.');
        }
      })
      .catch(error => {
        console.log(error);
      });
}

/*
function createNewBooking(userId){
    // Get booking details from URL parameters
    const pickupLocation = urlParams.get('pickupLocation');
    const destination = urlParams.get('destination');
    const pickupDate = urlParams.get('pickupDate');
    const pickupTime = urlParams.get('pickupTime');
    const travelingTime = urlParams.get('travelingTime');
    const childrenInput = urlParams.get('childrenInput');
    const adultInput = urlParams.get('adultInput');
    const vehicleId = urlParams.get('vehicleId');
    const driverId = urlParams.get('driverId');
    const paymentId = urlParams.get('paymentId');
    
    // Calculate arrival time and number of passengers
    const arrivalTime = calculateArrivalTime(pickupTime, travelingTime);
    const passengers = parseInt(childrenInput) + parseInt(adultInput);
  
    // Use Promise.all to fetch user, vehicle, driver, and payment details asynchronously
    Promise.all([
      getUserById(userId),
      getVehicleById(vehicleId),
      getDriverById(driverId),
      getPaymentById(paymentId)
    ]).then(([user, vehicle, driver, payment]) => {
      // Create new booking object with all the booking details and related objects
      console.log(user);
      console.log(driver);
      const newBooking = {
        bookingDate: pickupDate,
        user: user,
        bookingPickUpLocation: pickupLocation,
        bookingDropOffLocation: destination,
        bookingPickUpTime: pickupTime,
        bookingDropOffTime: arrivalTime,
        bookingNumberOfPassengers: passengers,
        vehicle: vehicle,
        driver: driver,
        payment: payment
      };
      console.log(newBooking);
      // Send POST request to API with the new booking object as the request body
      fetch('http://localhost:8080/api/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bookingDate: pickupDate,
            user: {id: 1, userName: 'test', userEmail: 'test', userPassword: 'test1', userPhoneNumber: '84', bookings: []},
            bookingPickUpLocation: pickupLocation,
            bookingDropOffLocation: destination,
            bookingPickUpTime: pickupTime,
            bookingDropOffTime: arrivalTime,
            bookingNumberOfPassengers: passengers,
            vehicle: null,
            driver: null,
            payment: null
          })
      })
      .then(response => {
        if (response.ok) {
          return response.json(); // Return the full response object
        } else {
          throw new Error('Error adding payment. Please try again.');
        }
      })
      .catch(error => {
        console.log(error);
        document.querySelector('.error-message').textContent = 'An error occurred. Please try again later.';
      });
    });
}

function getUserById(userId){
    return fetch('http://localhost:8080/api/v1/users')
    .then(response => response.json())
    .then(users => {
        const user = users.find(u => u.id === parseInt(userId));
        return user;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getVehicleById(vehicleId){
    return fetch('http://localhost:8080/api/v1/vehicles')
    .then(response => response.json())
    .then(vehicles => {
        const vehicle = vehicles.find(v => v.id === parseInt(vehicleId));
        return vehicle;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getDriverById(driverId){
    return fetch('http://localhost:8080/api/v1/drivers')
    .then(response => response.json())
    .then(drivers => {
        const driver = drivers.find(d => d.id === parseInt(driverId));
        return driver;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getPaymentById(paymentId){
    return fetch('http://localhost:8080/api/v1/payments')
    .then(response => response.json())
    .then(payments => {
        const payment = payments.find(p => p.id === parseInt(paymentId));
        return payment;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}




function fetchBooking(){

}
*/

