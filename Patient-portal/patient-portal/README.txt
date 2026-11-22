ONLINE DOCTOR APPOINTMENT SYSTEM - PATIENT PORTAL
CSC 3215 Web Technologies (HTML + CSS + JavaScript only)

Run: open this folder in VS Code and start Live Server on index.html
(or double-click index.html).

Demo account: patient@example.com   password: demo1234

PAGES
index.html                 Login (validateForm, onsubmit)
registration.html          Patient registration form + validation
patient-home.html          Profile card, number boxes, upcoming list, notice board
patient-doctors.html       Search (onkeyup), filter and sort (onchange)
patient-appointments.html  List, filter buttons, book (push), cancel (modal)

FILES
style.css         all styles (external CSS)
data.js           sample data: arrays of objects, helper functions
login.js, register.js, home.js, doctors.js, appointments.js   one script per page

Notes: there is no server, so data is not saved after a page reload and the
login check is not real security. A real system must validate on the server too.
