function validateForm() {
    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let errorMessage = document.getElementById("errorMessage");

    // Reset error message
    errorMessage.textContent = "";

    // Check empty fields
    if (username === "" || email === "" || phone === "" || password === "" || confirmPassword === "") {
        errorMessage.textContent = "All fields are required!";
        return false;
    }

    // Validate phone number
    let phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
        errorMessage.textContent = "Phone number must be numeric and 10 digits long!";
        return false;
    }

    // Validate password
    let passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[&$#@]).{7,}$/;
    if (!passwordPattern.test(password)) {
        errorMessage.textContent = "Password must be at least 7 characters long and contain at least one uppercase letter, one digit, and one special character (&, $, #, @)!";
        return false;
    }

    // Confirm password match
    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        return false;
    }

    // Validate email
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]{3}\.[a-zA-Z]{2,3}$/;
    if (!emailPattern.test(email)) {
        errorMessage.textContent = "Invalid email format!";
        return false;
    }

    alert("Registration Successful!");
    return true;
}
