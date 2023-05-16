//------------------SIGN UP-----------------
function signUp(event){
    event.preventDefault();
    let name = document.querySelector('#name').value;
    let phone = document.querySelector('#phone').value;
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    let confirm_password = document.querySelector('#confirm-password').value;

    document.querySelector('.error-message').textContent = '';
    document.querySelector('.success-message').textContent = '';

    validateSignUp(name, phone, email, password, confirm_password);
}

function validateSignUp(name, phone, email, password, confirm_password){
    fetch('http://localhost:8080/api/v1/users')
    .then(response => response.json())
    .then(users => {
        const foundUser = users.find(user => user.userEmail === email);
        const phoneRegex = /^84\d{9}$/; 
        const emailRegex = /\S+@\S+\.\S+/;
        
        if (!phoneRegex.test(phone)) {
            document.querySelector('.error-message').textContent = 'Invalid phone number. Please enter a valid phone number!';
            return; 
        }

        if (!emailRegex.test(email)) {
            document.querySelector('.error-message').textContent = 'Invalid email format. Please enter a valid email address.';
            return; 
        }

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

    if(childrenInput.value && !adultInput.value || parseInt(adultInput.value) === 0){
        alert("Children need guardians to accompany");
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
function searchVehicle(userId, seatsType) {
    console.log("searchVehicle");
    console.log(userId);
    Promise.all([
        fetch('http://localhost:8080/api/v1/vehicles').then(response => response.json()),
        fetch('http://localhost:8080/api/v1/bookings').then(response => response.json())
    ])
    .then(([vehicles, bookings]) => {
        const availableVehicles = vehicles.filter(vehicle => {
            const matchingBookings = bookings.filter(booking => {
                return booking.vehicle.id === vehicle.id && booking.bookingDate === pickupDate;
            });
            return parseInt(vehicle.seatNumber) === parseInt(seatsType) && matchingBookings.length === 0;
        });
        return availableVehicles;
    })
    .then(availableVehicles => {
        displayAvailableVehicle(userId, availableVehicles);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayAvailableVehicle(userId, availableVehicles){
    console.log("displayAvailableVehicle");
    console.log(userId);
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
                alert("You have to sign in to make a booking!");
                url =  `signin.html?pickupLocation=${pickupLocation}&destination=${destination}&pickupDate=${pickupDate}&pickupTime=${pickupTime}&seatsType=${seatsType}&childrenInput=${childrenInput}&adultInput=${adultInput}&vehicleId=${vehicle.id}`;
                window.location.href = url;
                return;
            } else {
                const url = `confirmation.html?user.id=${userId}&pickupLocation=${pickupLocation}&destination=${destination}&pickupDate=${pickupDate}&pickupTime=${pickupTime}&seatsType=${seatsType}&childrenInput=${childrenInput}&adultInput=${adultInput}&vehicleId=${vehicle.id}`;
                window.location.href = url;
            }
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
      Promise.all([
        fetch('http://localhost:8080/api/v1/drivers').then(response => response.json()),
        fetch('http://localhost:8080/api/v1/bookings').then(response => response.json())
      ])
      .then(([drivers, bookings]) => {
        const availableDriver = drivers.find(driver => {
          const matchingBookings = bookings.filter(booking => {
            return booking.driver.id === driver.id && booking.bookingDate === pickupDate;
          });
          return matchingBookings.length === 0;
        });
  
        document.getElementById('driver-name').value = availableDriver.driverName;
        document.getElementById('license').value = availableDriver.driverLicenseNumber;
        document.getElementById('driver-phone').value = availableDriver.driverPhoneNumber;
        resolve(availableDriver.id);
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

function addCashPayment(paymentMethod, amount, pickupDate){
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
}

function confirm(userId, pickupLocation, destination, vehicleId, pickupDate, childrenInput, adultInput) {
    autoFillUser(userId);
    autoFillVehicle(pickupLocation, destination, vehicleId);
    autoFillDriver(pickupDate)
    .then(driverId => {
        let form = document.querySelector('form');
        form.addEventListener('submit', (event) => { 
            event.preventDefault();
            const travelingTime = estimateTravelingTime(pickupLocation, destination);
            const paymentMethod = document.querySelector('.payment').value;
            if(!paymentMethod){
                alert("Please select a payment method!");
                return;
            }

            if (paymentMethod === 'banking') {
                const amount = document.getElementById('total').innerHTML;
                const date = new Date();
                const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                                
                url = `payment.html?user.id=${userId}&pickupLocation=${pickupLocation}&destination=${destination}&pickupDate=${pickupDate}&pickupTime=${pickupTime}&travelingTime=${travelingTime}&childrenInput=${childrenInput}&adultInput=${adultInput}&vehicleId=${vehicleId}&driverId=${driverId}&paymentType=${paymentMethod}&paymentAmount=${amount}&paymentDate=${formattedDate}`;
                window.location.href = url;
                return;
            } else {
                const amount = document.getElementById('total').innerHTML;
                addCashPayment(paymentMethod, amount, pickupDate)
                .then(payment => {
                    const paymentId = payment.id;
                                    
                    url = `complete.html?user.id=${userId}&pickupLocation=${pickupLocation}&destination=${destination}&pickupDate=${pickupDate}&pickupTime=${pickupTime}&travelingTime=${travelingTime}&childrenInput=${childrenInput}&adultInput=${adultInput}&vehicleId=${vehicleId}&driverId=${driverId}&paymentId=${paymentId}`;
                    window.location.href = url;
                    return;
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//------------------PAYMENT PAGE-------------------
function redirectAfter10Seconds() {
    const pickupLocation = urlParams.get('pickupLocation');
    const destination = urlParams.get('destination');
    const pickupDate = urlParams.get('pickupDate');
    const pickupTime = urlParams.get('pickupTime');
    const travelingTime = urlParams.get('travelingTime');
    const childrenInput = urlParams.get('childrenInput');
    const adultInput = urlParams.get('adultInput');
    const vehicleId = urlParams.get('vehicleId');
    const driverId = urlParams.get('driverId');
    const paymentType = urlParams.get('paymentType');
    const paymentAmount = urlParams.get('paymentAmount');
    const paymentDate = urlParams.get('paymentDate');
  
    let count = 10;
    const countdown = setInterval(() => {
      count--;
      document.getElementById("countdown").innerHTML = count;
      if (count === 0) {
        clearInterval(countdown);
        addBankingPayment(paymentType, paymentAmount, paymentDate)
          .then(payment => {
            const paymentId = payment.id;
            url = `complete.html?user.id=${userId}&pickupLocation=${pickupLocation}&destination=${destination}&pickupDate=${pickupDate}&pickupTime=${pickupTime}&travelingTime=${travelingTime}&childrenInput=${childrenInput}&adultInput=${adultInput}&vehicleId=${vehicleId}&driverId=${driverId}&paymentId=${paymentId}`;
            window.location.href = url;
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    }, 1000);
  }
  

function addBankingPayment(paymentType, amount, paymentDate){
    const newPayment = {
        paymentType: paymentType, 
        paymentAmount: amount, 
        paymentStatus: 'paid', 
        paymentDate: paymentDate, 
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
}

//------------------COMPLETE PAGE------------------

function calculateArrivalTime(pickupTime, travelingTime) {
    const [pickupHours, pickupMinutes] = pickupTime.split(':').map(Number);
    const pickupDateTime = new Date();
    pickupDateTime.setHours(pickupHours, pickupMinutes, 0);
  
    const travelingMinutes = parseInt(travelingTime, 10);
    const arrivalDateTime = new Date(pickupDateTime.getTime() + travelingMinutes * 60000);
    const arrivalHours = arrivalDateTime.getHours();
    const arrivalMinutes = arrivalDateTime.getMinutes();
    const arrivalTime = `${arrivalHours.toString().padStart(2, '0')}:${arrivalMinutes.toString().padStart(2, '0')}`;
  
    return arrivalTime;
}

async function createNewBooking(userId){
    const pickupLocation = urlParams.get('pickupLocation');
    const destination = urlParams.get('destination');
    const pickupDate = urlParams.get('pickupDate');
    const pickupTime = urlParams.get('pickupTime');
    const travelingTime = parseFloat(urlParams.get('travelingTime'));
    const childrenInput = urlParams.get('childrenInput');
    const adultInput = urlParams.get('adultInput');
    const vehicleId = urlParams.get('vehicleId');
    const driverId = urlParams.get('driverId');
    const paymentId = urlParams.get('paymentId');
    
    const arrivalTime = calculateArrivalTime(pickupTime, travelingTime);
    const passengers = parseInt(childrenInput) + parseInt(adultInput);
  
    Promise.all([
      getUserById(userId),
      getVehicleById(vehicleId),
      getDriverById(driverId),
      getPaymentById(paymentId)
    ]).then(([user, vehicle, driver, payment]) => {
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
        payment: payment,
        status: 'processing'
      };
      console.log(newBooking);

      fetch('http://localhost:8080/api/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBooking)
      })
      .then(response => response.json())
      .then(data => {
        const bookingId = data.id; 
        const bookingIdElement = document.getElementById('booking-id');
        bookingIdElement.textContent = `Booking Id: ${bookingId}`;
      })
      .catch(error => {
        console.log(error);
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

//----------------BOOKING-----------------
function fetchBooking(userId) {
    fetch('http://localhost:8080/api/v1/bookings')
      .then(response => response.json())
      .then(schedules => {
        writeSchedule(sortSchedules(filterSchedules(schedules.filter(schedule => schedule.user.id === parseInt(userId)))));
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function filterSchedules(schedules) {
    const searchDate = document.getElementById('search-date').value;
    const searchID = document.getElementById('search').value;
    const paymentMethod = document.getElementById('payment-method').value;

    return schedules.filter(schedule => {
        if (searchDate && schedule.bookingDate !== searchDate) {
            return false;
        }

        if (searchID && !containsSearchID(schedule, searchID)) {
            return false;
        }

        if (paymentMethod && schedule.payment.paymentType !== paymentMethod) {
            return false;
        }
        return true;
    });
}

function containsSearchID(schedule, searchID) {
    const id = parseInt(schedule.id);
    return id === parseInt(searchID);
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
      <th>Booking ID</th>
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
          <td>${schedule.id}</td>
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
        `;
        table.appendChild(row);
      });
    }
}
  
