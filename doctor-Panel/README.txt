DOCTOR PORTAL — NO DATABASE VERSION

This version uses plain HTML, CSS and JavaScript. It has no PHP, SQL, database
server, build tools or external libraries. Its colors and layout are based on
the supplied Patient Portal.

FILES
- index.html: demo doctor login
- doctor-home.html: dashboard and upcoming appointments
- doctor-appointments.html: filters and appointment status actions
- doctor-patients.html: searchable fictional patient list
- doctor-availability.html: weekly schedule, duration and room settings
- style.css: shared Patient Portal visual style plus doctor-specific layout
- data.js, doctor.js, login.js: sample data and browser-only interactions

OPEN
1. Extract the ZIP.
2. Open index.html in a browser (or serve this folder with a local static web
   server if your browser restricts local-file storage).
3. Demo login: doctor@example.com / demo1234.

CHANGES TO APPOINTMENTS AND AVAILABILITY ARE SAVED ONLY IN THIS BROWSER'S
localStorage. They are not shared with another device or user. Login is a demo
flow, not secure authentication; credentials are visible in the JavaScript.
All sample people and details are fictional. Never use real patient data.
