'use strict';
const DEMO_DOCTOR = { email: 'doctor@example.com', password: 'demo1234', name: 'Dr. Rahim Noor' };
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const message = document.getElementById('loginMessage');
    if (email === DEMO_DOCTOR.email && password === DEMO_DOCTOR.password) {
      localStorage.setItem('doctorPortalSession', JSON.stringify({ name: DEMO_DOCTOR.name, email: DEMO_DOCTOR.email }));
      window.location.href = 'doctor-home.html';
      return;
    }
    message.textContent = 'Email or password is incorrect. Try the demo account shown below.';
  });
}
