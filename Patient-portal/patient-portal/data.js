/* data.js - sample (fictional) data used by every page.
   Concepts: const / let, arrays, objects, arrays of objects (Lecture 05, Lab 04)
   There is no server in this course project yet, so the data lives in arrays. */

/* the one demo account the login page checks against */
const users = [
  { email: "patient@example.com", password: "demo1234" }
];

/* an object with a method: "this" means the object that owns the method */
const patient = {
  name: "Niloy Dey",
  id: "PT-1001",
  age: 32,
  email: "patient@example.com",
  phone: "01700000001",
  summary: function () {
    return this.name + " (" + this.id + ")";
  }
};

const doctors = [
  { id: 1, name: "Dr. Rahim Noor",   specialty: "Cardiology", days: "Sun, Tue, Thu", fee: 1000, rating: 4.8 },
  { id: 2, name: "Dr. Nadia Karim",  specialty: "Medicine",   days: "Mon, Wed",      fee: 700,  rating: 4.6 },
  { id: 3, name: "Dr. Farhan Ali",   specialty: "Neurology",  days: "Sun, Wed",      fee: 1200, rating: 4.9 },
  { id: 4, name: "Dr. Karim Hossain", specialty: "Pediatrics", days: "Tue, Thu",     fee: 800,  rating: 4.7 }
];

/* status is one of: pending, confirmed, completed, cancelled */
const appointments = [
  { id: 1, date: "2026-11-24", time: "10:00", doctor: "Dr. Rahim Noor",  reason: "Follow-up",        status: "confirmed" },
  { id: 2, date: "2026-11-26", time: "17:00", doctor: "Dr. Nadia Karim", reason: "Fever and cough",  status: "pending" },
  { id: 3, date: "2026-11-12", time: "10:00", doctor: "Dr. Rahim Noor",  reason: "Chest pain check", status: "completed" },
  { id: 4, date: "2026-11-05", time: "11:00", doctor: "Dr. Farhan Ali",  reason: "Headache",         status: "cancelled" }
];

const notices = [
  "Clinic hours: 9:00 AM to 8:00 PM, Sunday to Thursday.",
  "Please arrive 10 minutes before your appointment.",
  "Bring your previous prescriptions to every visit.",
  "You can cancel an appointment on the My Appointments page.",
  "The Cardiology clinic is closed on Friday."
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ---------- small helper functions shared by the pages ---------- */

/* read an input and remove spaces from both ends (Lab 04 validation slide) */
function field(id) {
  return document.getElementById(id).value.trim();
}

/* "2026-11-24" -> "24 Nov 2026" using string slice() and the months array */
function formatDate(d) {
  return d.slice(8, 10) + " " + months[Number(d.slice(5, 7)) - 1] + " " + d.slice(0, 4);
}

/* "17:00" -> "5:00 PM" */
function formatTime(t) {
  let hour = Number(t.slice(0, 2));
  let ampm = "AM";
  if (hour >= 12) {
    ampm = "PM";
  }
  if (hour > 12) {
    hour = hour - 12;
  }
  return hour + t.slice(2) + " " + ampm;
}

/* used with filter(): only pending and confirmed appointments are upcoming */
function isUpcoming(a) {
  return a.status === "pending" || a.status === "confirmed";
}

/* compare function for sort(): earliest date and time first */
function byDate(a, b) {
  let x = a.date + a.time;
  let y = b.date + b.time;
  if (x < y) {
    return -1;
  }
  if (x > y) {
    return 1;
  }
  return 0;
}
