// Login, sign-up and forgot-password form handling.
// This front-end demo currently provides a working Receptionist account only.

const demoUsers = {
    receptionist: {
        email: "reception@gmail.com",
        password: "Reception123",
        page: "receptionist panel.html"
    }
};

function loginUser(event) {
    event.preventDefault();

    const roleElement = document.getElementById("role");
    const emailElement = document.getElementById("email");
    const passwordElement = document.getElementById("password");

    if (!roleElement || !emailElement || !passwordElement) return;

    const role = roleElement.value;
    const email = emailElement.value.trim().toLowerCase();
    const password = passwordElement.value;
    const user = demoUsers[role];

    if (!user) {
        alert("This demo currently supports Receptionist login only.");
        return;
    }

    if (user.email.toLowerCase() === email && user.password === password) {
        // Redirect directly to the real file name in this project folder.
        window.location.assign(user.page);
    } else {
        alert("Invalid account type, email address or password.");
    }
}

// Patient sign-up form validation.
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const dob = document.getElementById("dob").value;
        const message = document.getElementById("message");

        if (password.length < 8) {
            message.textContent = "Password must contain at least 8 characters.";
            message.style.color = "#dc2626";
            return;
        }
        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            message.style.color = "#dc2626";
            return;
        }
        if (!dob || new Date(dob) >= new Date()) {
            message.textContent = "Please enter a valid date of birth.";
            message.style.color = "#dc2626";
            return;
        }
        message.textContent = "";
        const modal = document.getElementById("successModal");
        if (modal) modal.style.display = "flex";
    });
}

function closeSuccess() {
    window.location.assign("log in.html");
}

// Forgot-password form feedback (database/email service is not connected).
const forgotForm = document.getElementById("forgotForm");
if (forgotForm) {
    forgotForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message");
        if (!email) {
            message.textContent = "Please enter your email address.";
            message.style.color = "#dc2626";
            return;
        }
        message.textContent = "Password reset functionality will be connected to the database.";
        message.style.color = "#0f8b8d";
    });
}
