const forgotForm = document.getElementById("forgotForm");

        forgotForm.addEventListener("submit", function(event) {

            event.preventDefault();

            const email = document.getElementById("email").value.trim();

            const message = document.getElementById("message");

            if (!email) {

                message.textContent = "Please enter your email address.";

                message.style.color = "#dc2626";

                return;
            }

            message.textContent =
                "Password reset functionality will be connected to the database.";

            message.style.color = "#176db0";

        });
