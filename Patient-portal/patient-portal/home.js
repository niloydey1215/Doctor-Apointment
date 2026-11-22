/* home.js - Patient home page: profile card, number boxes, upcoming list, notices */

function showProfile() {
  document.getElementById("welcome").textContent = "Welcome, " + patient.name;
  document.getElementById("avatar").textContent = patient.name.slice(0, 1);
  document.getElementById("profileName").textContent = patient.name;
  document.getElementById("profileId").textContent = patient.id;
  document.getElementById("profileAge").textContent = patient.age;
  document.getElementById("profileEmail").textContent = patient.email;
  document.getElementById("profilePhone").textContent = patient.phone;
}

function countStatus(status) {
  return appointments.filter(function (a) {
    return a.status === status;
  }).length;
}

function showStats() {
  document.getElementById("statUpcoming").textContent = appointments.filter(isUpcoming).length;
  document.getElementById("statCompleted").textContent = countStatus("completed");
  document.getElementById("statCancelled").textContent = countStatus("cancelled");
}

function showUpcoming() {
  let list = appointments.filter(isUpcoming).sort(byDate);
  let rows = "";
  for (let i = 0; i < list.length; i++) {
    let a = list[i];
    rows += "<tr><td>" + formatDate(a.date) + "</td><td>" + formatTime(a.time) + "</td><td>" +
            a.doctor + "</td><td><span class='status " + a.status + "'>" + a.status + "</span></td></tr>";
  }
  if (list.length === 0) {
    rows = "<tr><td colspan='4'>No upcoming appointments.</td></tr>";
  }
  document.getElementById("upcomingRows").innerHTML = rows;
}

function showNotices() {
  const ul = document.getElementById("noticeList");
  for (let i = 0; i < notices.length; i++) {
    const li = document.createElement("li");
    li.textContent = notices[i];
    ul.appendChild(li);
  }
}

/* called by <body onload="startHome()"> */
function startHome() {
  showProfile();
  showStats();
  showUpcoming();
  showNotices();
}
