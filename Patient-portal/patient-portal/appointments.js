/* appointments.js - My Appointments: list, filter, book (push), cancel (modal) */

let currentFilter = "all";
let nextId = appointments.length + 1;
let cancelId = 0;

/* text typed by the user goes in with textContent (safe), not innerHTML */
function addCell(row, text) {
  const td = document.createElement("td");
  td.textContent = text;
  row.appendChild(td);
}

function makeCancelButton(id) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "small danger";
  btn.textContent = "Cancel";
  btn.addEventListener("click", function () {
    askCancel(id);
  });
  return btn;
}

/* redraw the table from the array with a for loop */
function render() {
  const body = document.getElementById("appointmentRows");
  let list = appointments.filter(function (a) {
    return currentFilter === "all" || a.status === currentFilter;
  });
  list.sort(byDate);

  body.innerHTML = "";
  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    const row = document.createElement("tr");
    addCell(row, formatDate(a.date) + ", " + formatTime(a.time));
    addCell(row, a.doctor);
    addCell(row, a.reason);

    const statusCell = document.createElement("td");
    const span = document.createElement("span");
    span.className = "status " + a.status;
    span.textContent = a.status;
    statusCell.appendChild(span);
    row.appendChild(statusCell);

    const actionCell = document.createElement("td");
    if (isUpcoming(a)) {
      actionCell.appendChild(makeCancelButton(a.id));
    } else {
      actionCell.textContent = "-";
    }
    row.appendChild(actionCell);
    body.appendChild(row);
  }
  if (list.length === 0) {
    body.innerHTML = "<tr><td colspan='5'>No appointments found.</td></tr>";
  }
  document.getElementById("count").textContent =
    "Showing " + list.length + " of " + appointments.length + " appointments";
}

/* filter buttons: addEventListener + classList (Lab 04) */
function setupFilters() {
  const buttons = document.querySelectorAll(".filter");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentFilter = btn.value;
      buttons.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      render();
    });
  });
}

/* ---------- cancel with a modal pop-up (CSS Exercise 3) ---------- */
function askCancel(id) {
  let a = appointments.find(function (item) {
    return item.id === id;
  });
  cancelId = id;
  document.getElementById("cancelText").textContent =
    "Cancel your appointment with " + a.doctor + " on " + formatDate(a.date) +
    " at " + formatTime(a.time) + "?";
  document.getElementById("overlay").classList.add("show");
}

function closeModal() {
  document.getElementById("overlay").classList.remove("show");
}

function confirmCancel() {
  let a = appointments.find(function (item) {
    return item.id === cancelId;
  });
  a.status = "cancelled";
  closeModal();
  render();
}

/* ---------- book an appointment ---------- */
function fail(msg, text) {
  msg.textContent = text;
  msg.style.color = "red";
  return false;
}

function fillDoctors() {
  const select = document.getElementById("bookDoctor");
  for (let i = 0; i < doctors.length; i++) {
    const option = document.createElement("option");
    option.value = doctors[i].name;
    option.textContent = doctors[i].name + " (" + doctors[i].specialty + ")";
    select.appendChild(option);
  }
}

/* onsubmit="return validateBooking()": the browser checks required/min first */
function validateBooking() {
  let doctor = document.getElementById("bookDoctor").value;
  let date = field("bookDate");
  let time = document.getElementById("bookTime").value;
  let reason = field("bookReason");
  let msg = document.getElementById("bookMsg");

  if (doctor === "") {
    return fail(msg, "Please select a doctor.");
  }
  if (date === "") {
    return fail(msg, "Please choose a date.");
  }
  if (time === "") {
    return fail(msg, "Please choose a time slot.");
  }
  if (reason.length < 5) {
    return fail(msg, "Reason: at least 5 characters.");
  }

  /* is that doctor already booked at that date and time? */
  let taken = appointments.find(function (a) {
    return a.doctor === doctor && a.date === date && a.time === time && a.status !== "cancelled";
  });
  if (taken !== undefined) {
    return fail(msg, "That slot is already booked. Please choose another time.");
  }

  appointments.push({
    id: nextId,
    date: date,
    time: time,
    doctor: doctor,
    reason: reason,
    status: "pending"
  });
  nextId++;
  render();

  document.getElementById("bookDoctor").value = "";
  document.getElementById("bookDate").value = "";
  document.getElementById("bookTime").value = "";
  document.getElementById("bookReason").value = "";
  msg.textContent = "Appointment requested with " + doctor +
    ". Status: pending until the doctor confirms (demo only, nothing was sent).";
  msg.style.color = "green";
  return false;   /* no server yet, so cancel the real sending */
}

/* called by <body onload="startAppointments()"> */
function startAppointments() {
  fillDoctors();
  setupFilters();
  render();
}
