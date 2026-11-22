// Receptionist doctors page logic.

    // Sample data for Receptionist Panel. Changes are saved in this browser.
    function isoDate(offset = 0) { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10) }
    const defaultReceptionData = {
      patients: [
        { id: 1, name: "Rahim Uddin", phone: "01710000001", email: "rahim@gmail.com", age: 32, gender: "Male", address: "Dhaka" },
        { id: 2, name: "Nadia Islam", phone: "01810000002", email: "nadia@gmail.com", age: 27, gender: "Female", address: "Mirpur" },
        { id: 3, name: "Karim Hasan", phone: "01910000003", email: "karim@gmail.com", age: 45, gender: "Male", address: "Uttara" }
      ],
      doctors: [
        { id: 1, name: "Dr. Ahmed", specialty: "Cardiologist", fee: 1000, availability: "Available", schedule: "Sun, Tue, Thu" },
        { id: 2, name: "Dr. Sara", specialty: "Dermatologist", fee: 800, availability: "Available", schedule: "Sat, Mon, Wed" },
        { id: 3, name: "Dr. Rahman", specialty: "Neurologist", fee: 1200, availability: "Unavailable", schedule: "Sun, Tue" },
        { id: 4, name: "Dr. Fatima", specialty: "Dentist", fee: 700, availability: "Available", schedule: "Sat, Mon, Wed" }
      ],
      appointments: [
        { id: 1001, patientId: 1, doctorId: 1, date: isoDate(0), time: "10:00", status: "Confirmed", payment: "Received", fee: 1000 },
        { id: 1002, patientId: 2, doctorId: 2, date: isoDate(0), time: "11:30", status: "Pending", payment: "Pending", fee: 800 },
        { id: 1003, patientId: 3, doctorId: 3, date: isoDate(1), time: "12:00", status: "Confirmed", payment: "Received", fee: 1200 }
      ],
      receptionist: { name: "Receptionist", email: "reception@gmail.com", phone: "01700000000" }
    };
    function loadReceptionData() {
      let data; try { const saved = localStorage.getItem("odaReceptionistData"); data = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultReceptionData)); } catch (e) { data = JSON.parse(JSON.stringify(defaultReceptionData)); }
      data.patients=data.patients||[];data.doctors=data.doctors||[];data.appointments=data.appointments||[];data.receptionist=data.receptionist||defaultReceptionData.receptionist;
      data.appointments.forEach(a=>{if(!a.source)a.source="Online";if(typeof a.checkedIn!=="boolean")a.checkedIn=false;if(!a.paymentMethod)a.paymentMethod="";if(!a.receiptNo)a.receiptNo=""});
      localStorage.setItem("odaReceptionistData",JSON.stringify(data));return data;
    }
    let rdb = loadReceptionData();
    function saveReceptionData() { localStorage.setItem("odaReceptionistData", JSON.stringify(rdb)) }

  

    const currentFile = decodeURIComponent(location.pathname.split("/").pop() || "receptionist panel.html");
    const receptionistPages = [
      ["receptionist panel.html", "▦", "Dashboard"],
      ["receptionist appointments.html", "▤", "Appointments"],
      ["receptionist queue.html", "☷", "Daily Queue"],
      ["receptionist book appointment.html", "＋", "Book Appointment"],
      ["receptionist patients.html", "♙", "Patients"],
      ["receptionist doctors.html", "✚", "Doctors"],
      ["receptionist payments.html", "৳", "Payments"],
      ["receptionist profile.html", "⚙", "Profile"]
    ];
    const pageTitle = (receptionistPages.find(x => x[0] === currentFile) || receptionistPages[0])[2];
    const appRoot = document.getElementById("receptionistApp");
    function safe(v) { return String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])) }
    function getPatient(id) { return rdb.patients.find(p => p.id === Number(id)) }
    function getDoctor(id) { return rdb.doctors.find(d => d.id === Number(id)) }
    function dateText(d) { return d ? new Date(d + "T00:00:00").toLocaleDateString() : "—" }
    function badge(s) { return `<span class="status ${safe(s)}">${safe(s)}</span>` }
    function frame(content) {
      appRoot.innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand">Online Doctor<br><span>Appointment System</span></div><div class="role-label">Receptionist Panel</div><nav class="nav">${receptionistPages.map(([f, ic, n]) => `<a href="${f}" class="${currentFile === f ? "active" : ""}"><span class="nav-icon">${ic}</span><span class="nav-text">${n}</span></a>`).join("")}</nav><div class="side-footer">Receptionist Portal<br><a href="home page.html">← Back to Website</a><br><a href="log in.html">Log Out</a></div></aside><main class="main"><header class="topbar"><div><div class="crumb">Online Doctor Appointment System / ${pageTitle}</div><h1>${pageTitle}</h1></div><div class="user-chip"><span class="avatar">R</span><span>${safe(rdb.receptionist.name)}<br><small class="muted">Receptionist</small></span></div></header>${content}</main></div>`;
    }
    function stat(label, value, icon, note) { return `<div class="stat"><div class="stat-head"><span>${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-num">${value}</div><div class="stat-note">${note}</div></div>` }
    function rowsAppointments(list) { return list.map(a => { const p = getPatient(a.patientId), d = getDoctor(a.doctorId); return `<tr><td>#${a.id}</td><td><span class="person">${safe(p?.name || "Unknown")}</span><span class="sub">${safe(p?.phone || "")}</span></td><td>${safe(d?.name || "Unknown")}<span class="sub">${safe(d?.specialty || "")}</span></td><td>${dateText(a.date)}<span class="sub">${safe(a.time)}</span></td><td>${badge(a.status)}</td><td><div class="actions">${a.status === "Pending" ? `<button class="small success" onclick="changeStatus(${a.id},'Confirmed')">Confirm</button>` : ""}${!["Cancelled", "Completed"].includes(a.status) ? `<button class="small danger" onclick="changeStatus(${a.id},'Cancelled')">Cancel</button>` : ""}${a.status === "Confirmed" ? `<button class="small light" onclick="changeStatus(${a.id},'Completed')">Complete</button>` : ""}</div></td></tr>` }).join("") || `<tr><td colspan="6" class="empty">No appointments found.</td></tr>` }
    function dashboard() {
      const today = isoDate(0), todays = rdb.appointments.filter(a => a.date === today);
      frame(`<section class="cards">${stat("Total Appointments", rdb.appointments.length, "▤", "All appointment records")}${stat("Today's Appointments", todays.length, "▦", "Scheduled for today")}${stat("Pending", rdb.appointments.filter(a => a.status === "Pending").length, "◷", "Awaiting confirmation")}${stat("Total Patients", rdb.patients.length, "♙", "Registered patients")}</section>
 <section class="panel"><div class="panel-head"><div><h2>Recent Appointments</h2><p class="muted">Latest patient bookings</p></div><a class="btn light" href="receptionist appointments.html">View All</a></div><div class="table-wrap"><table><thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rowsAppointments([...rdb.appointments].sort((a, b) => b.id - a.id).slice(0, 5))}</tbody></table></div></section>
 <section class="panel"><div class="panel-head"><div><h2>Today's Appointments by Doctor</h2><p class="muted">Daily schedule and queue overview</p></div><a class="btn light" href="receptionist queue.html">Open Daily Queue</a></div>${rdb.doctors.map(d=>{const list=rdb.appointments.filter(a=>a.doctorId===d.id&&a.date===today&&a.status!=="Cancelled").sort((a,b)=>a.time.localeCompare(b.time));return `<div class="doctor-section"><h3>${safe(d.name)} — ${list.length} appointment(s)</h3><p class="muted">${list.map(a=>`${safe(getPatient(a.patientId)?.name||"Patient")} (${safe(a.time)})`).join(" · ")||"No appointments today"}</p></div>`}).join("")}</section><div class="panel-head"><h2>Quick Actions</h2></div><div class="quick-actions"><a class="btn primary" href="receptionist book appointment.html">＋ Book Appointment</a><a class="btn light" href="receptionist patients.html">＋ Register Patient</a><a class="btn light" href="receptionist doctors.html">View Doctors</a></div>`);
    }
    function changeStatus(id, status) { const a = rdb.appointments.find(x => x.id === id); if (a) { a.status = status; saveReceptionData(); renderPage() } }
    function appointmentsPage() {
      frame(`<section class="panel"><div class="panel-head"><div><h2>All Appointments</h2><p class="muted">${rdb.appointments.length} records</p></div><a class="btn primary" href="receptionist book appointment.html">＋ New Appointment</a></div><div class="toolbar"><input id="appointmentSearch" class="search" placeholder="Search patient or doctor..."><select id="appointmentFilter" class="filter"><option value="">All Statuses</option>${["Pending", "Confirmed", "Completed", "Cancelled"].map(s => `<option>${s}</option>`).join("")}</select></div><div class="table-wrap"><table><thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr></thead><tbody id="appointmentRows">${rowsAppointments(rdb.appointments)}</tbody></table></div></section>`);
      document.getElementById("appointmentSearch").addEventListener("input", filterAppointments);
      document.getElementById("appointmentFilter").addEventListener("change", filterAppointments);
    }
    function filterAppointments() { const q = document.getElementById("appointmentSearch").value.toLowerCase(), s = document.getElementById("appointmentFilter").value; const list = rdb.appointments.filter(a => (getPatient(a.patientId)?.name.toLowerCase().includes(q) || getDoctor(a.doctorId)?.name.toLowerCase().includes(q)) && (!s || a.status === s)); document.getElementById("appointmentRows").innerHTML = rowsAppointments(list) }
    function patientsRows(list) { return list.map(p => `<tr><td><span class="person">${safe(p.name)}</span><span class="sub">ID: ${p.id}</span></td><td>${safe(p.phone)}</td><td>${safe(p.email || "—")}</td><td>${safe(p.age || "—")}</td><td>${safe(p.gender || "—")}</td><td><div class="actions"><button class="small light" onclick="editPatient(${p.id})">Edit</button><button class="small danger" onclick="removePatient(${p.id})">Delete</button></div></td></tr>`).join("") || `<tr><td colspan="6" class="empty">No patients found.</td></tr>` }
    function patientsPage() {
      frame(`<section class="panel"><div class="panel-head"><div><h2>Patient Management</h2><p class="muted">Register, search and manage patient details</p></div><button class="btn primary" onclick="patientForm()">＋ Add Patient</button></div><div class="toolbar"><input id="patientSearch" class="search" placeholder="Search by name, phone or email..."></div><div class="table-wrap"><table><thead><tr><th>Patient</th><th>Phone</th><th>Email</th><th>Age</th><th>Gender</th><th>Actions</th></tr></thead><tbody id="patientRows">${patientsRows(rdb.patients)}</tbody></table></div></section><div id="patientFormArea"></div>`);
      document.getElementById("patientSearch").addEventListener("input", e => { const q = e.target.value.toLowerCase(); document.getElementById("patientRows").innerHTML = patientsRows(rdb.patients.filter(p => [p.name, p.phone, p.email].some(v => (v || "").toLowerCase().includes(q)))) });
    }
    function patientForm(p = null) {
      document.getElementById("patientFormArea").innerHTML = `<section class="form-card"><h2>${p ? "Edit Patient" : "Register New Patient"}</h2><form id="patientDataForm"><div class="form-grid"><div class="field"><label>Full Name *</label><input name="name" required value="${safe(p?.name || "")}"></div><div class="field"><label>Phone *</label><input name="phone" required value="${safe(p?.phone || "")}"></div><div class="field"><label>Email</label><input name="email" type="email" value="${safe(p?.email || "")}"></div><div class="field"><label>Age</label><input name="age" type="number" min="0" max="120" value="${safe(p?.age || "")}"></div><div class="field"><label>Gender</label><select name="gender"><option value="">Select</option>${["Male", "Female", "Other"].map(g => `<option ${p?.gender === g ? "selected" : ""}>${g}</option>`).join("")}</select></div><div class="field"><label>Address</label><input name="address" value="${safe(p?.address || "")}"></div></div><div class="form-actions"><button class="btn primary">Save Patient</button><button type="button" class="btn light" onclick="document.getElementById('patientFormArea').innerHTML=''">Close</button></div></form></section>`;
      document.getElementById("patientDataForm").addEventListener("submit", e => { e.preventDefault(); const obj = Object.fromEntries(new FormData(e.target).entries()); if (p) Object.assign(p, obj); else rdb.patients.push({ id: Date.now(), ...obj }); saveReceptionData(); renderPage() });
    }
    function editPatient(id) { patientForm(getPatient(id)) }
    function removePatient(id) { if (rdb.appointments.some(a => a.patientId === id)) { alert("This patient has appointment records and cannot be deleted in this demo."); return } if (confirm("Delete this patient?")) { rdb.patients = rdb.patients.filter(p => p.id !== id); saveReceptionData(); renderPage() } }
    function bookingPage() {
      frame(`<section class="form-card"><h2>Book Appointment for Patient</h2><p class="muted">Enter patient and appointment details below.</p><div class="notice">New patient? Register the patient first from the Patients page.</div><form id="bookingForm"><div class="form-grid"><div class="field"><label>Select Patient *</label><select name="patientId" required><option value="">Choose patient</option>${rdb.patients.map(p => `<option value="${p.id}">${safe(p.name)} — ${safe(p.phone)}</option>`).join("")}</select></div><div class="field"><label>Select Doctor *</label><select name="doctorId" id="doctorSelect" required><option value="">Choose doctor</option>${rdb.doctors.map(d => `<option value="${d.id}" ${d.availability !== "Available" ? "disabled" : ""}>${safe(d.name)} — ${safe(d.specialty)}</option>`).join("")}</select></div><div class="field"><label>Appointment Date *</label><input type="date" name="date" min="${isoDate(0)}" required></div><div class="field"><label>Appointment Time *</label><input type="time" name="time" required></div><div class="field"><label>Consultation Fee (৳)</label><input id="feeInput" name="fee" type="number" readonly required></div><div class="field"><label>Payment Status</label><select name="payment"><option>Pending</option><option>Received</option></select></div><div class="field full"><label>Reason for Visit</label><textarea name="reason" rows="3" placeholder="Optional"></textarea></div></div><div class="form-actions"><button class="btn primary">Book Appointment</button><a class="btn light" href="receptionist appointments.html">Cancel</a></div></form></section>`);
      document.getElementById("doctorSelect").addEventListener("change", e => document.getElementById("feeInput").value = getDoctor(e.target.value)?.fee || "");
      document.getElementById("bookingForm").addEventListener("submit", e => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.target).entries()); const exists = rdb.appointments.some(a => a.doctorId == f.doctorId && a.date === f.date && a.time === f.time && a.status !== "Cancelled"); if (exists) { alert("This doctor already has an appointment at this time. Choose another time."); return } rdb.appointments.push({ id: Date.now(), patientId: Number(f.patientId), doctorId: Number(f.doctorId), date: f.date, time: f.time, status: "Pending", payment: f.payment, fee: Number(f.fee), reason: f.reason }); saveReceptionData(); alert("Appointment booked successfully."); location.href = "receptionist appointments.html" });
    }
    function checkInPatient(id) { const a=rdb.appointments.find(x=>x.id===id); if(a){a.checkedIn=true;a.checkInTime=new Date().toLocaleTimeString();if(a.status==="Pending")a.status="Confirmed";saveReceptionData();renderPage()} }
    function rescheduleAppointment(id) { const a=rdb.appointments.find(x=>x.id===id);if(!a)return;const date=prompt("Enter new appointment date (YYYY-MM-DD):",a.date);if(!date)return;const time=prompt("Enter new appointment time (HH:MM):",a.time);if(!time)return;const clash=rdb.appointments.some(x=>x.id!==id&&x.doctorId===a.doctorId&&x.date===date&&x.time===time&&x.status!=="Cancelled");if(clash){alert("This doctor already has an appointment at that time.");return}a.date=date;a.time=time;a.checkedIn=false;a.status="Pending";saveReceptionData();renderPage() }
    function doctorsPage() { frame(`<section class="doctor-grid">${rdb.doctors.map(d => `<article class="doctor-card"><div class="doctor-icon">✚</div><h3>${safe(d.name)}</h3><p>${safe(d.specialty)}</p><div class="muted">Consultation Fee</div><div class="fee">৳${d.fee}</div><p>Schedule: ${safe(d.schedule)}</p>${badge(d.availability)}</article>`).join("")}</section>`) }
    function paymentsPage() {
      const total = rdb.appointments.reduce((s, a) => s + a.fee, 0), received = rdb.appointments.filter(a => a.payment === "Received").reduce((s, a) => s + a.fee, 0), pending = total - received;
      frame(`<section class="cards">${stat("Total Fees", "৳" + total, "৳", "All appointment fees")}${stat("Received", "৳" + received, "✓", "Payments received")}${stat("Pending", "৳" + pending, "◷", "Payments pending")}${stat("Transactions", rdb.appointments.length, "▤", "Appointment payment records")}</section><section class="panel"><div class="panel-head"><div><h2>Payment Records</h2><p class="muted">Update payment after receiving fee</p></div></div><div class="table-wrap"><table><thead><tr><th>Appointment</th><th>Patient</th><th>Doctor</th><th>Fee</th><th>Payment Status</th><th>Action</th></tr></thead><tbody>${rdb.appointments.map(a => `<tr><td>#${a.id}</td><td>${safe(getPatient(a.patientId)?.name || "Unknown")}</td><td>${safe(getDoctor(a.doctorId)?.name || "Unknown")}</td><td>৳${a.fee}</td><td>${badge(a.payment)}</td><td>${a.payment === "Pending" ? `<button class="small success" onclick="receivePayment(${a.id})">Mark Received</button>` : `<span class="muted">Paid</span>`}</td></tr>`).join("") || `<tr><td colspan="6" class="empty">No payment records.</td></tr>`}</tbody></table></div></section>`);
    }
    function receivePayment(id) { const a = rdb.appointments.find(x => x.id === id); if (a) { a.payment = "Received"; saveReceptionData(); renderPage() } }
    function profilePage() {
      const r = rdb.receptionist;
      frame(`<section class="profile-card"><div class="profile-head"><div class="profile-avatar">R</div><div><h2>${safe(r.name)}</h2><p class="muted">Receptionist Account</p></div></div><form id="profileForm"><div class="form-grid"><div class="field"><label>Full Name</label><input name="name" required value="${safe(r.name)}"></div><div class="field"><label>Email</label><input name="email" type="email" value="${safe(r.email)}"></div><div class="field"><label>Phone</label><input name="phone" value="${safe(r.phone)}"></div></div><div class="form-actions"><button class="btn primary">Update Profile</button></div></form><div class="notice">This demo saves profile changes in this browser only.</div></section>`);
      document.getElementById("profileForm").addEventListener("submit", e => { e.preventDefault(); Object.assign(rdb.receptionist, Object.fromEntries(new FormData(e.target).entries())); saveReceptionData(); alert("Profile updated."); renderPage() });
    }
    function renderPage() { switch (currentFile) { case "receptionist queue.html":queuePage();break; case "receptionist appointments.html": appointmentsPage(); break; case "receptionist book appointment.html": bookingPage(); break; case "receptionist patients.html": patientsPage(); break; case "receptionist doctors.html": doctorsPage(); break; case "receptionist payments.html": paymentsPage(); break; case "receptionist profile.html": profilePage(); break; default: dashboard() } }
    renderPage();

  