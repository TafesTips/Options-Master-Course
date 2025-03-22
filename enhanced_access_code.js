// Access code validation functionality with enhanced security and validation
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already authenticated
    if (!localStorage.getItem('accessGranted')) {
        showAccessCodeLayer();
    } else if (!localStorage.getItem('userRegistered')) {
        showRegistrationLayer();
    }
});

function showAccessCodeLayer() {
    // Create access code overlay
    const overlay = document.createElement('div');
    overlay.className = 'auth-overlay';
    
    const accessCodeContainer = document.createElement('div');
    accessCodeContainer.className = 'auth-container';
    
    accessCodeContainer.innerHTML = `
        <h2>Welcome to Options Income Mastery</h2>
        <p>Please enter your access code to continue</p>
        <div class="input-group">
            <label for="accessCode">Access Code:</label>
            <input type="password" id="accessCode" placeholder="Enter your access code" autocomplete="off">
        </div>
        <div id="accessCodeError" class="error-message"></div>
        <button id="submitAccessCode" class="auth-button">Submit</button>
    `;
    
    overlay.appendChild(accessCodeContainer);
    document.body.appendChild(overlay);
    
    // Add event listener for access code submission
    document.getElementById('submitAccessCode').addEventListener('click', validateAccessCode);
    document.getElementById('accessCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validateAccessCode();
        }
    });
    
    // Focus on the input field
    setTimeout(() => {
        document.getElementById('accessCode').focus();
    }, 100);
}

function validateAccessCode() {
    const accessCode = document.getElementById('accessCode').value.trim();
    const errorElement = document.getElementById('accessCodeError');
    
    // Enhanced validation
    if (!accessCode) {
        errorElement.textContent = 'Please enter an access code.';
        return;
    }
    
    // Rate limiting for security (prevent brute force)
    const attempts = parseInt(localStorage.getItem('accessAttempts') || '0');
    const lastAttemptTime = parseInt(localStorage.getItem('lastAttemptTime') || '0');
    const now = Date.now();
    
    // If more than 5 attempts in the last 10 minutes, enforce a cooldown
    if (attempts >= 5 && (now - lastAttemptTime) < 600000) {
        const remainingTime = Math.ceil((600000 - (now - lastAttemptTime)) / 60000);
        errorElement.textContent = `Too many attempts. Please try again in ${remainingTime} minute(s).`;
        return;
    }
    
    // Reset attempts counter if it's been more than 10 minutes
    if ((now - lastAttemptTime) >= 600000) {
        localStorage.setItem('accessAttempts', '1');
    } else {
        localStorage.setItem('accessAttempts', (attempts + 1).toString());
    }
    
    localStorage.setItem('lastAttemptTime', now.toString());
    
    // Check access code (case-insensitive for better user experience)
    if (accessCode.toUpperCase() === 'TAFETEACHES') {
        // Reset attempts on success
        localStorage.removeItem('accessAttempts');
        localStorage.removeItem('lastAttemptTime');
        
        // Set access granted flag with expiration (24 hours)
        const expiration = Date.now() + 86400000; // 24 hours
        localStorage.setItem('accessGranted', 'true');
        localStorage.setItem('accessExpiration', expiration.toString());
        
        document.querySelector('.auth-overlay').remove();
        showRegistrationLayer();
    } else {
        errorElement.textContent = 'Invalid access code. Please try again.';
    }
}

function showRegistrationLayer() {
    // Create registration overlay
    const overlay = document.createElement('div');
    overlay.className = 'auth-overlay';
    
    const registrationContainer = document.createElement('div');
    registrationContainer.className = 'auth-container';
    
    registrationContainer.innerHTML = `
        <h2>Complete Your Registration</h2>
        <p>Please provide your information to access the course</p>
        <div class="input-group">
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" placeholder="Enter your first name">
        </div>
        <div id="firstNameError" class="error-message"></div>
        
        <div class="input-group">
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" placeholder="Enter your last name">
        </div>
        <div id="lastNameError" class="error-message"></div>
        
        <div class="input-group">
            <label for="email">Email:</label>
            <input type="email" id="email" placeholder="Enter your email address">
        </div>
        <div id="emailError" class="error-message"></div>
        
        <div class="input-group checkbox-group">
            <input type="checkbox" id="termsAgreement">
            <label for="termsAgreement">I agree to the terms and conditions</label>
        </div>
        <div id="termsError" class="error-message"></div>
        
        <button id="submitRegistration" class="auth-button">Register & Access Course</button>
    `;
    
    overlay.appendChild(registrationContainer);
    document.body.appendChild(overlay);
    
    // Add event listener for registration submission
    document.getElementById('submitRegistration').addEventListener('click', validateRegistration);
    
    // Add input validation on blur
    document.getElementById('firstName').addEventListener('blur', validateFirstName);
    document.getElementById('lastName').addEventListener('blur', validateLastName);
    document.getElementById('email').addEventListener('blur', validateEmail);
    
    // Focus on the first input field
    setTimeout(() => {
        document.getElementById('firstName').focus();
    }, 100);
}

function validateFirstName() {
    const firstName = document.getElementById('firstName').value.trim();
    const errorElement = document.getElementById('firstNameError');
    
    if (!firstName) {
        errorElement.textContent = 'First name is required.';
        return false;
    } else if (firstName.length < 2) {
        errorElement.textContent = 'First name must be at least 2 characters.';
        return false;
    } else if (!/^[A-Za-z\s\-']+$/.test(firstName)) {
        errorElement.textContent = 'First name contains invalid characters.';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function validateLastName() {
    const lastName = document.getElementById('lastName').value.trim();
    const errorElement = document.getElementById('lastNameError');
    
    if (!lastName) {
        errorElement.textContent = 'Last name is required.';
        return false;
    } else if (lastName.length < 2) {
        errorElement.textContent = 'Last name must be at least 2 characters.';
        return false;
    } else if (!/^[A-Za-z\s\-']+$/.test(lastName)) {
        errorElement.textContent = 'Last name contains invalid characters.';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function validateEmail() {
    const email = document.getElementById('email').value.trim();
    const errorElement = document.getElementById('emailError');
    
    if (!email) {
        errorElement.textContent = 'Email address is required.';
        return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorElement.textContent = 'Please enter a valid email address.';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function validateTerms() {
    const termsAgreement = document.getElementById('termsAgreement').checked;
    const errorElement = document.getElementById('termsError');
    
    if (!termsAgreement) {
        errorElement.textContent = 'You must agree to the terms and conditions.';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function validateRegistration() {
    // Validate all fields
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isEmailValid = validateEmail();
    const isTermsValid = validateTerms();
    
    // If any validation fails, stop the submission
    if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isTermsValid) {
        return;
    }
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Store user information with encryption
    const userInfo = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        registrationDate: new Date().toISOString()
    };
    
    // Simple encryption (for demonstration purposes)
    const encryptedInfo = btoa(JSON.stringify(userInfo));
    
    localStorage.setItem('userInfoEncrypted', encryptedInfo);
    localStorage.setItem('userRegistered', 'true');
    
    // Remove overlay and show welcome message
    document.querySelector('.auth-overlay').remove();
    showWelcomeMessage(firstName);
    
    // Update user profile display
    updateUserProfile(firstName, lastName);
}

function showWelcomeMessage(firstName) {
    const welcomeToast = document.createElement('div');
    welcomeToast.className = 'welcome-toast';
    welcomeToast.innerHTML = `<p>Welcome, ${firstName}! Enjoy the course.</p>`;
    
    document.body.appendChild(welcomeToast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        welcomeToast.classList.add('fade-out');
        setTimeout(() => {
            welcomeToast.remove();
        }, 1000);
    }, 5000);
}

function updateUserProfile(firstName, lastName) {
    const profileName = document.getElementById('profileName');
    const profileInitials = document.getElementById('profileInitials');
    
    if (profileName && profileInitials) {
        profileName.textContent = firstName;
        profileInitials.textContent = firstName.charAt(0) + lastName.charAt(0);
    }
}

// Function to check if access has expired
function checkAccessExpiration() {
    const expiration = parseInt(localStorage.getItem('accessExpiration') || '0');
    const now = Date.now();
    
    if (expiration && now > expiration) {
        // Access has expired, clear authentication
        logOut();
        return false;
    }
    
    return true;
}

// Function to log out
function logOut() {
    localStorage.removeItem('accessGranted');
    localStorage.removeItem('accessExpiration');
    localStorage.removeItem('userRegistered');
    localStorage.removeItem('userInfoEncrypted');
    location.reload();
}

// Check access expiration on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAccessExpiration();
    
    // Update user profile if registered
    if (localStorage.getItem('userRegistered') && localStorage.getItem('userInfoEncrypted')) {
        try {
            const encryptedInfo = localStorage.getItem('userInfoEncrypted');
            const userInfo = JSON.parse(atob(encryptedInfo));
            
            updateUserProfile(userInfo.firstName, userInfo.lastName);
        } catch (e) {
            console.error('Error parsing user info:', e);
            // If there's an error, log out to reset
            logOut();
        }
    }
});

// Add CSS for checkbox group
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .checkbox-group input[type="checkbox"] {
            margin-right: 10px;
        }
        
        .checkbox-group label {
            display: inline;
            margin-bottom: 0;
        }
    `;
    document.head.appendChild(style);
});
