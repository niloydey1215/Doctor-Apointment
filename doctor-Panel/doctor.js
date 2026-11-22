'use strict';
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function getDoctorSession() {
  try { return JSON.parse(localStorage.getItem('doctorPortalSession') || 'null'); }
  catch (_) { return null; }
}
function requireDoctor() {
  const session = getDoctorSession();
  if (!session || session.email !== doctorProfile.email) {
    window.location.replace('index.html');
    return null;
  }
  return session;
}
function appendCell(row, value, className) {
  const cell = document.createElement('td');
  if (className) cell.className = className;
  cell.textContent = value == null ? '' : String(value);
  row.appendChild(cell);
  return cell;
}
function statusCell(row, status) {
  const cell = document.createElement('td');
  const label = document.createElement('span');
  label.className = 'status ' + status.toLowerCase();
  label.textContent = status;
  cell.appendChild(label);
  row.appendChild(cell);
}
function appointmentsSorted(rows) {
  return rows.slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}
function renderHome(session) {
  const rows = appointmentsSorted(loadAppointments());
  document.getElementById('welcome').textContent = 'Welcome, ' + session.name;
  document.getElementById('profileName').textContent = session.name;
  document.getElementById('profileDepartment').textContent = doctorProfile.department;
  document.getElementById('profileEmail').textContent = doctorProfile.email;
  document.getElementById('profileRoom').textContent = 'Consultation room: ' + loadAvailability().room;
  document.getElementById('avatar').textContent = session.name.charAt(0);
  document.getElementById('statUpcoming').textContent = rows.filter(isUpcomingAppointment).length;
  document.getElementById('statCompleted').textContent = rows.filter(item => item.status === 'Completed').length;
  document.getElementById('statCancelled').textContent = rows.filter(item => item.status === 'Cancelled').length;
  const body = document.getElementById('upcomingRows');
  const upcoming = rows.filter(isUpcomingAppointment).slice(0, 5);
  upcoming.forEach(item => {
    const tr = document.createElement('tr');
    appendCell(tr, formatDate(item.date)); appendCell(tr, formatTime(item.time)); appendCell(tr, item.patient); statusCell(tr, item.status);
    body.appendChild(tr);
  });
  document.getElementById('upcomingEmpty').hidden = upcoming.length > 0;
}
function renderAppointments() {
  let activeFilter = 'All';
  const search = document.getElementById('appointmentSearch');
  const body = document.getElementById('appointmentRows');
  function draw() {
    const query = search.value.trim().toLowerCase();
    const all = appointmentsSorted(loadAppointments());
    const filtered = all.filter(item => (activeFilter === 'All' || item.status === activeFilter) &&
      (item.patient.toLowerCase().includes(query) || item.reason.toLowerCase().includes(query) || item.patientId.toLowerCase().includes(query)));
    body.replaceChildren();
    filtered.forEach(item => {
      const tr = document.createElement('tr');
      appendCell(tr, formatDate(item.date)); appendCell(tr, formatTime(item.time));
      const patient = appendCell(tr, item.patient); const id = document.createElement('small'); id.textContent = item.patientId; patient.appendChild(id);
      appendCell(tr, item.reason); statusCell(tr, item.status);
      const actionCell = document.createElement('td');
      const actions = item.status === 'Pending' ? [['Confirmed', 'Confirm'], ['Cancelled', 'Cancel']] : item.status === 'Confirmed' ? [['Completed', 'Complete'], ['Cancelled', 'Cancel']] : [];
      actions.forEach(([nextStatus, label]) => {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'small ' + (nextStatus === 'Cancelled' ? 'danger' : '');
        button.textContent = label; button.dataset.id = item.id; button.dataset.status = nextStatus;
        actionCell.appendChild(button);
      });
      if (!actions.length) actionCell.textContent = '—';
      tr.appendChild(actionCell); body.appendChild(tr);
    });
    document.getElementById('appointmentCount').textContent = 'Showing ' + filtered.length + ' of ' + all.length + ' appointment(s).';
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('active', item === button));
    draw();
  }));
  search.addEventListener('input', draw);
  body.addEventListener('click', event => {
    const button = event.target.closest('button[data-id]');
    if (!button) return;
    const rows = loadAppointments();
    const target = rows.find(item => item.id === button.dataset.id);
    if (!target) return;
    target.status = button.dataset.status;
    saveAppointments(rows); draw();
  });
  draw();
}
function renderPatients() {
  const search = document.getElementById('patientSearch');
  const body = document.getElementById('patientRows');
  function draw() {
    const q = search.value.trim().toLowerCase();
    const appts = loadAppointments();
    const byId = new Map();
    appts.forEach(item => {
      if (!byId.has(item.patientId)) byId.set(item.patientId, { id: item.patientId, name: item.patient, age: item.age, gender: item.gender, email: item.email, count: 0 });
      byId.get(item.patientId).count++;
    });
    const patients = Array.from(byId.values()).filter(item => (item.name + ' ' + item.id + ' ' + item.email).toLowerCase().includes(q)).sort((a, b) => a.name.localeCompare(b.name));
    body.replaceChildren();
    patients.forEach(item => {
      const tr = document.createElement('tr');
      appendCell(tr, item.id); appendCell(tr, item.name); appendCell(tr, item.age + ' years'); appendCell(tr, item.gender); appendCell(tr, item.email); appendCell(tr, item.count);
      body.appendChild(tr);
    });
    document.getElementById('patientCount').textContent = 'Showing ' + patients.length + ' patient(s).';
  }
  search.addEventListener('input', draw); draw();
}
function renderAvailability() {
  const form = document.getElementById('availabilityForm');
  const saved = loadAvailability();
  const tbody = document.getElementById('scheduleRows');
  WEEKDAYS.forEach((day, index) => {
    const tr = document.createElement('tr');
    const dayCell = document.createElement('th'); dayCell.scope = 'row';
    const label = document.createElement('label'); label.className = 'day-label';
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.name = 'day_' + index; checkbox.checked = !!saved.days[index];
    label.append(checkbox, document.createTextNode(' ' + day)); dayCell.appendChild(label); tr.appendChild(dayCell);
    [['start', '10:00'], ['end', '17:00']].forEach(([kind, fallback]) => {
      const td = document.createElement('td'); const time = document.createElement('input'); time.type = 'time'; time.name = kind + '_' + index; time.setAttribute('aria-label', day + ' ' + kind + ' time');
      time.value = (saved.days[index] && saved.days[index][kind === 'start' ? 0 : 1]) || fallback;
      td.appendChild(time); tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  document.getElementById('duration').value = String(saved.duration || 30);
  document.getElementById('room').value = saved.room || doctorProfile.room;
  document.getElementById('resetAvailability').addEventListener('click', () => {
    localStorage.removeItem(storageKeys.availability); window.location.reload();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const result = { room: document.getElementById('room').value.trim(), duration: Number(document.getElementById('duration').value), days: {} };
    let invalid = false;
    WEEKDAYS.forEach((day, index) => {
      const enabled = form.elements['day_' + index].checked;
      if (!enabled) { result.days[index] = null; return; }
      const start = form.elements['start_' + index].value;
      const end = form.elements['end_' + index].value;
      if (!start || !end || start >= end) invalid = true;
      result.days[index] = [start, end];
    });
    const message = document.getElementById('availabilityMessage');
    if (!result.room || invalid) {
      message.textContent = 'Enter a room and valid start/end times for each selected day.';
      message.className = 'error'; return;
    }
    localStorage.setItem(storageKeys.availability, JSON.stringify(result));
    doctorProfile.room = result.room;
    message.textContent = 'Availability saved in this browser.'; message.className = 'success';
  });
}
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page) {
    const session = requireDoctor();
    if (!session) return;
    document.querySelectorAll('[data-logout]').forEach(button => button.addEventListener('click', () => {
      localStorage.removeItem('doctorPortalSession'); window.location.href = 'index.html';
    }));
    const pages = { home: renderHome, appointments: renderAppointments, patients: renderPatients, availability: renderAvailability };
    pages[document.body.dataset.page]?.(session);
  }
});
