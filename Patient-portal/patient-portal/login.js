/* login.js - Login form validation (Lab 04: onsubmit="return validateForm()")
   true  -> the form is sent to its action page (patient-home.html)
   false -> sending is cancelled and the error stays on the page
 */

function validateForm() {
  let email = field("email").toLowerCase();
  let password = document.getElementById("password").value;
  let msg = document.getElementById("msg");
  msg.classList.add("error");

  if (email === "" || !email.includes("@")) {
    msg.textContent = "Enter a valid email address.";
    return false;
  }
  if (password.length < 8) {
    msg.textContent = "Password must be at least 8 characters.";
    return false;
  }

  /* find() gives the first matching object, or undefined */
  let user = users.find(function (u) {
    return u.email === email && u.password === password;
  });
  if (user === undefined) {
    msg.textContent = "Incorrect email or password.";
    return false;
  }
  return true;
}
