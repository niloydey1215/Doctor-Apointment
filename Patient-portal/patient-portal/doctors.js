/* doctors.js - Find Doctors page: search (onkeyup), filter and sort (onchange) */

function showDoctors(list) {
  let rows = "";
  for (let i = 0; i < list.length; i++) {
    let d = list[i];
    rows += "<tr><td><strong>" + d.name + "</strong></td><td>" + d.specialty + "</td><td>" +
            d.days + "</td><td>" + d.fee + " BDT</td><td>" + d.rating + " / 5</td></tr>";
  }
  if (list.length === 0) {
    rows = "<tr><td colspan='5'>No doctors found.</td></tr>";
  }
  document.getElementById("doctorRows").innerHTML = rows;
  document.getElementById("count").textContent =
    "Showing " + list.length + " of " + doctors.length + " doctors";
}

/* one function reads all three controls, so they always work together */
function applyFilters() {
  let q = field("search").toLowerCase();
  let specialty = document.getElementById("specialty").value;
  let sortBy = document.getElementById("sortBy").value;

  let list = doctors.filter(function (d) {
    let text = (d.name + " " + d.specialty).toLowerCase();
    return text.includes(q) && (specialty === "all" || d.specialty === specialty);
  });

  /* switch compares with ===, so the values must match the option values */
  switch (sortBy) {
    case "fee":
      list.sort(function (a, b) { return a.fee - b.fee; });
      break;
    case "rating":
      list.sort(function (a, b) { return b.rating - a.rating; });
      break;
    default:
      break;
  }
  showDoctors(list);
}

/* build the specialty drop-down from the doctors array */
function fillSpecialties() {
  const select = document.getElementById("specialty");
  let seen = [];
  for (let i = 0; i < doctors.length; i++) {
    if (!seen.includes(doctors[i].specialty)) {
      seen.push(doctors[i].specialty);
      const option = document.createElement("option");
      option.value = doctors[i].specialty;
      option.textContent = doctors[i].specialty;
      select.appendChild(option);
    }
  }
}

/* called by <body onload="startDoctors()"> */
function startDoctors() {
  fillSpecialties();
  applyFilters();
}
