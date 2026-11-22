let editingDoctorRow = null;
let editingReceptionRow = null;

function updateCounts() {
    let d = document.getElementById('totalDoctors');
    let r = document.getElementById('totalReceptionists');
    let p = document.getElementById('totalPatients');

    if (d) d.textContent = document.querySelectorAll('#doctorTable tbody tr').length;
    if (r) r.textContent = document.querySelectorAll('#receptionTable tbody tr').length;
    if (p) p.textContent = document.querySelectorAll('#patientTable tbody tr').length;
}

function searchTable(input, id) {
    let q = input.value.toLowerCase();

    document.querySelectorAll('#' + id + ' tbody tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
}

document.querySelectorAll('[data-search]').forEach(x => {
    x.addEventListener('input', () => searchTable(x, x.dataset.search));
});

function resetDoctorForm() {
    editingDoctorRow = null;

    let f = document.getElementById('doctorForm');

    if (f) {
        f.reset();
        doctorPassword.required = true;
        doctorFormTitle.textContent = 'Create Doctor Account';
        doctorSubmit.textContent = 'Create Doctor';
    }
}

function resetReceptionForm() {
    editingReceptionRow = null;

    let f = document.getElementById('receptionForm');

    if (f) {
        f.reset();
        receptionPassword.required = true;
        receptionFormTitle.textContent = 'Create Receptionist Account';
        receptionSubmit.textContent = 'Create Account';
    }
}

let doctorForm = document.getElementById('doctorForm');

if (doctorForm) {
    doctorForm.onsubmit = e => {
        e.preventDefault();

        let v = [
            doctorName.value,
            doctorEmail.value,
            doctorSpecialization.value,
            doctorPhone.value
        ];

        if (editingDoctorRow) {
            v.forEach((x, i) => {
                editingDoctorRow.cells[i].textContent = x;
            });

            alert('Doctor information updated successfully!');
        } else {
            let row = doctorTable.tBodies[0].insertRow();

            v.forEach(x => row.insertCell().textContent = x);

            row.insertCell().innerHTML =
                '<button data-action="edit-doctor" class="btn-warning">Edit</button> ' +
                '<button data-action="delete" class="btn-danger">Delete</button>';

            alert('Doctor added successfully!');
        }

        resetDoctorForm();
        updateCounts();
    };
}

let receptionForm = document.getElementById('receptionForm');

if (receptionForm) {
    receptionForm.onsubmit = e => {
        e.preventDefault();

        let v = [
            receptionName.value,
            receptionEmail.value,
            receptionPhone.value
        ];

        if (editingReceptionRow) {
            v.forEach((x, i) => {
                editingReceptionRow.cells[i].textContent = x;
            });

            alert('Receptionist updated successfully!');
        } else {
            let row = receptionTable.tBodies[0].insertRow();

            v.forEach(x => row.insertCell().textContent = x);

            row.insertCell().innerHTML =
                '<button data-action="edit-reception" class="btn-warning">Edit</button> ' +
                '<button data-action="delete" class="btn-danger">Delete</button>';

            alert('Receptionist added successfully!');
        }

        resetReceptionForm();
        updateCounts();
    };
}

document.getElementById('doctorClear')?.addEventListener('click', resetDoctorForm);
document.getElementById('receptionClear')?.addEventListener('click', resetReceptionForm);

document.addEventListener('click', e => {
    let b = e.target.closest('[data-action]');

    if (!b) return;

    let row = b.closest('tr');
    let a = b.dataset.action;

    if (a === 'delete' && confirm('Are you sure you want to delete this record?')) {
        row.remove();
        updateCounts();
    }

    if (a === 'edit-doctor') {
        editingDoctorRow = row;

        ['doctorName', 'doctorEmail', 'doctorSpecialization', 'doctorPhone']
            .forEach((id, i) => {
                document.getElementById(id).value = row.cells[i].textContent;
            });

        doctorPassword.required = false;
        doctorFormTitle.textContent = 'Edit Doctor';
        doctorSubmit.textContent = 'Update Doctor';
        doctorForm.scrollIntoView({ behavior: 'smooth' });
    }

    if (a === 'edit-reception') {
        editingReceptionRow = row;

        ['receptionName', 'receptionEmail', 'receptionPhone']
            .forEach((id, i) => {
                document.getElementById(id).value = row.cells[i].textContent;
            });

        receptionPassword.required = false;
        receptionFormTitle.textContent = 'Edit Receptionist';
        receptionSubmit.textContent = 'Update Receptionist';
        receptionForm.scrollIntoView({ behavior: 'smooth' });
    }

    if (a === 'confirm') {
        row.cells[4].innerHTML = '<span class="status confirmed">Confirmed</span>';
        b.disabled = true;
        b.textContent = 'Confirmed';

        alert('Appointment confirmed!');
    }

    if (a === 'cancel' && confirm('Are you sure you want to cancel this appointment?')) {
        row.cells[4].innerHTML = '<span class="status cancelled">Cancelled</span>';
        b.disabled = true;
    }
});

document.getElementById('settingsForm')?.addEventListener('submit', e => {
    e.preventDefault();
    alert('Demo: Admin profile settings updated successfully!');
});

updateCounts();