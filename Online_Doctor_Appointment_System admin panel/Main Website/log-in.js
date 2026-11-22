// DEMO LOGIN ACCOUNTS

const demoUsers = {

    admin: {
        email: "admin@gmail.com",
        password: "Admin123",
        page: "admin/admin panel.html"
    },

    doctor: {
        email: "doctor@gmail.com",
        password: "Doctor123",
        page: "doctor panel.html"
    },

    receptionist: {
        email: "reception@gmail.com",
        password: "Reception123",
        page: "receptionist panel.html"
    },

    patient: {
        email: "patient@gmail.com",
        password: "Patient123",
        page: "patient panel.html"
    }

};

// LOGIN FUNCTION

function loginUser(event) {

    event.preventDefault();

    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const user = demoUsers[role];

    if (
        user &&
        user.email === email &&
        user.password === password
    ) {

        alert("Login Successful!");

        window.location.href = user.page;

    } else {

        alert("Invalid Account Type, Login ID or Password!");

    }

}
