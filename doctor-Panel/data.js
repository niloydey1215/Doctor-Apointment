'use strict';
const doctorProfile = {
  name: 'Dr. Rahim Noor',
  email: 'doctor@example.com',
  department: 'Cardiology',
  room: 'Room 204',
  slotMinutes: 30
};
const dayMs = 24 * 60 * 60 * 1000;
function isoDayOffset(offset) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setTime(date.getTime() + offset * dayMs);
  return date.toISOString().slice(0, 10);
}
const sampleAppointments = [
  { id: 'AP-1001', patientId: 'PT-1001', patient: 'Ayesha Sultana', age: 32, gender: 'Female', email: 'ayesha@example.test', phone: '01700000001', date: isoDayOffset(1), time: '10:00', reason: 'Follow-up consultation', status: 'Confirmed' },
  { id: 'AP-1002', patientId: 'PT-1002', patient: 'Mehedi Hasan', age: 45, gender: 'Male', email: 'mehedi@example.test', phone: '01700000002', date: isoDayOffset(1), time: '10:30', reason: 'Chest discomfort', status: 'Pending' },
  { id: 'AP-1003', patientId: 'PT-1003', patient: 'Nusrat Jahan', age: 28, gender: 'Female', email: 'nusrat@example.test', phone: '01700000003', date: isoDayOffset(2), time: '11:00', reason: 'Routine cardiac review', status: 'Confirmed' },
  { id: 'AP-1004', patientId: 'PT-1004', patient: 'Rafi Ahmed', age: 39, gender: 'Male', email: 'rafi@example.test', phone: '01700000004', date: isoDayOffset(-1), time: '11:30', reason: 'First consultation', status: 'Completed' },
  { id: 'AP-1005', patientId: 'PT-1005', patient: 'Samira Farhin', age: 52, gender: 'Female', email: 'samira@example.test', phone: '01700000005', date: isoDayOffset(-3), time: '14:00', reason: 'Blood pressure review', status: 'Cancelled' }
];
const storageKeys = { appointments: 'doctorPortalAppointments', availability: 'doctorPortalAvailability', seeded: 'doctorPortalSeeded' };
function loadAppointments() {
  if (!localStorage.getItem(storageKeys.seeded)) {
    localStorage.setItem(storageKeys.appointments, JSON.stringify(sampleAppointments));
    localStorage.setItem(storageKeys.seeded, 'yes');
  }
  try {
    const saved = JSON.parse(localStorage.getItem(storageKeys.appointments) || '[]');
    return Array.isArray(saved) ? saved : sampleAppointments.slice();
  } catch (_) { return sampleAppointments.slice(); }
}
function saveAppointments(rows) { localStorage.setItem(storageKeys.appointments, JSON.stringify(rows)); }
function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value + 'T12:00:00');
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatTime(value) {
  if (!value) return '—';
  const [hour, minute] = value.split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  return ((hour % 12) || 12) + ':' + String(minute).padStart(2, '0') + ' ' + suffix;
}
function isUpcomingAppointment(item) {
  return (item.status === 'Pending' || item.status === 'Confirmed') && item.date >= new Date().toISOString().slice(0, 10);
}
function defaultAvailability() {
  return {
    room: doctorProfile.room,
    duration: doctorProfile.slotMinutes,
    days: { 0: null, 1: ['10:00', '17:00'], 2: ['10:00', '17:00'], 3: ['10:00', '17:00'], 4: ['10:00', '17:00'], 5: null, 6: null }
  };
}
function loadAvailability() {
  try { return Object.assign(defaultAvailability(), JSON.parse(localStorage.getItem(storageKeys.availability) || '{}')); }
  catch (_) { return defaultAvailability(); }
}
