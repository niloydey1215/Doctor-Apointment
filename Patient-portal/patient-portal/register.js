/* register.js - Registration form (Lecture 01 worked example + Lab 04 Task 1)
   Concepts: DOM (getElementById, getElementsByName), element.style,
   arrays (push, join), objects (Object.entries), DHTML (checkbox enables button) */

/* show an error in red next to its field, using element.style */
function setError(id, text) {
  let span = document.getElementById(id);
  span.textContent = text;
  span.style.color = "red";
}

function clearErrors() {
  let spans = document.querySelectorAll(".err");
  spans.forEach(function (s) {
    s.textContent = "";
  });
  document.getElementById("formMsg").textContent = "";
  document.getElementById("summary").innerHTML = "";
}

/* DHTML: the Register button stays disabled until the terms box is ticked */
function setupTerms() {
  const agree = document.getElementById("Condition");
  const btn = document.getElementById("signupBtn");
  agree.addEventListener("change", function () {
    btn.disabled = !agree.checked;
  });
}

/* onreset: the reset button clears the boxes, so lock the button again */
function resetForm() {
  clearErrors();
  document.getElementById("signupBtn").disabled = true;
}

function validateForm() {
  clearErrors();
  let ok = true;

  let name = field("PatientName");
  let age = Number(field("PatientAge"));
  let email = field("PatientEmail").toLowerCase();
  let phone = field("PatientPhone");
  let dob = field("PatientDOB");
  let address = field("PatientAddress");
  let username = field("Username");
  let password = document.getElementById("Password").value;
  let confirmPass = document.getElementById("ConfirmPassword").value;

  if (name.length < 3) {
    setError("nameErr", "Name: at least 3 letters");
    ok = false;
  }
  if (isNaN(age) || age < 1 || age > 120) {
    setError("ageErr", "Age: a number from 1 to 120");
    ok = false;
  }
  if (!email.includes("@") || !email.includes(".")) {
    setError("emailErr", "Email must contain @ and a dot");
    ok = false;
  }
  if (phone.length !== 11 || !phone.startsWith("01") || isNaN(Number(phone))) {
    setError("phoneErr", "Phone: 11 digits starting with 01");
    ok = false;
  }

  /* radio buttons that share one name: loop and look for the checked one */
  let genders = document.getElementsByName("Gender");
  let gender = "";
  for (let i = 0; i < genders.length; i++) {
    if (genders[i].checked) {
      gender = genders[i].value;
    }
  }
  if (gender === "") {
    setError("genderErr", "Select a gender");
    ok = false;
  }

  if (dob === "") {
    setError("dobErr", "Choose your date of birth");
    ok = false;
  }
  if (address.length < 5) {
    setError("addressErr", "Address: at least 5 characters");
    ok = false;
  }

  /* checkboxes: store the ticked departments in an array */
  let boxes = document.getElementsByName("DeptDoctor");
  let departments = [];
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      departments.push(boxes[i].value);
    }
  }
  console.log(departments);
  if (departments.length === 0) {
    setError("deptErr", "Choose at least one department");
    ok = false;
  }

  if (username.length < 4) {
    setError("userErr", "Username: at least 4 characters");
    ok = false;
  }
  if (password.length < 8) {
    setError("passErr", "Password: at least 8 characters");
    ok = false;
  }
  if (password !== confirmPass) {
    setError("confirmErr", "Password and confirm password do not match");
    ok = false;
  }
  if (!document.getElementById("Condition").checked) {
    setError("termsErr", "You must accept the terms");
    ok = false;
  }

  if (!ok) {
    return false;
  }

  /* all values are valid: show them (there is no server yet, so nothing is sent) */
  const newPatient = {
    Name: name,
    Age: age,
    Email: email,
    Phone: phone,
    Gender: gender,
    "Date of birth": dob,
    Address: address,
    Departments: departments.join(", "),
    Username: username
  };

  const list = document.getElementById("summary");
  for (const pair of Object.entries(newPatient)) {
    const li = document.createElement("li");
    li.textContent = pair[0] + ": " + pair[1];
    list.appendChild(li);
  }

  const msg = document.getElementById("formMsg");
  msg.textContent = "Registration successful (demo only, nothing was saved). ";
  msg.style.color = "green";
  const link = document.createElement("a");
  link.href = "index.html";
  link.textContent = "Go to Login";
  msg.appendChild(link);
  return false;
}
