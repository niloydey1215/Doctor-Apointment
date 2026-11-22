const signupForm = document.getElementById("signupForm");

        signupForm.addEventListener("submit", function(event) {

            event.preventDefault();

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const dob =
                document.getElementById("dob").value;

            const message =
                document.getElementById("message");

            if (password.length < 8) {

                message.textContent =
                    "Password must contain at least 8 characters.";

                message.style.color = "#dc2626";

                return;
            }

            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                message.style.color = "#dc2626";

                return;
            }

            if (!dob || new Date(dob) >= new Date()) {

                message.textContent =
                    "Please enter a valid date of birth.";

                message.style.color = "#dc2626";

                return;
            }

            message.textContent = "";

            document.getElementById("successModal").style.display = "flex";

        });


        function closeSuccess() {

            window.location.href = "log in.html";

        }
