const viewButton = document.querySelectorAll('.action.view');
const viewConsultationModal = document.querySelector('#consultation-modal');
const addConsultationModal = document.querySelector('#add-consultation-modal');
const deletionModal = document.querySelector('#delete-confirmation-modal');
const filterConsultationModal = document.querySelector('#filter-consultation-modal');
const editConsultationModal = document.querySelector('#edit-consultation-modal');
const modalCloseButton = document.querySelectorAll('.close-btn');
const deleteConsultationButton = document.querySelectorAll('.action.delete');
const filterConsultationButton = document.querySelector('#filter-consultation-btn');
const editConsultationButton = document.querySelectorAll('.action.edit');
const confirmDeletionButton = document.querySelector('.action.confirm-delete');
const addConsultationButton = document.querySelector('#add-consultation-btn');
const isCurrentDateTimeCheckbox = document.querySelector('#is-current-date-time');
const addConsultationForm = document.querySelector("#add-consultation-form");
const filterConsultationForm = document.querySelector('#filter-consultation-form');
const editConsultationForm = document.querySelector('#edit-consultation-form');
const confirmEditConsultationButton = document.querySelector('#confirm-edit-btn');
const addPatientInput = document.querySelector('#add-patient-name');
const addDoctorInput = document.querySelector('#add-doctor-name');
const addDiagnosisInput = document.querySelector('#add-diagnosis');
const addPrescriptionInput = document.querySelector('#add-prescription');
const editPatientInput = document.querySelector('#edit-patient-name');
const editDiagnosisInput = document.querySelector('#edit-diagnosis');
const editPrescriptionInput = document.querySelector('#edit-prescription');
const editDoctorInput = document.querySelector('#edit-doctor-name');
const filterDiagnosisInput = document.querySelector('#filter-diagnosis');
const filterPrescriptionInput = document.querySelector('#filter-prescription');
const consultationSearchBox = document.querySelector('#consultation-searchbox');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

//order,sorting,pagination shit
let livesearchQuery = "";
let diagnosisFilter = "";
let prescriptionFilter = "";
let startingDateFilter = "";
let endingDateFilter = "";
let orderBy = "ConsultDateTime";
let orderDir = "DESC";
let currentPage = 1;

async function loadTable() {
    const response = await fetch(`consultation-table.php?query=${encodeURIComponent(livesearchQuery)}&orderBy=${encodeURIComponent(orderBy)}&orderDir=${orderDir}&startDate=${encodeURIComponent(startingDateFilter)}&endDate=${encodeURIComponent(endingDateFilter)}&diagnosis=${encodeURIComponent(diagnosisFilter)}&prescription=${encodeURIComponent(prescriptionFilter)}&page=${currentPage}`);
    let result = await response.json();
    prevButton.dataset.page = currentPage - 1;
    nextButton.dataset.page = currentPage + 1;

    if (result.totalRows <= 10) {
        document.querySelector('.pagination').style.display = 'none';
    }
    else {
        document.querySelector('.pagination').style.display = 'flex';
    }

    if (currentPage == 1) {
        prevButton.style.display = 'none';
    }
    else if (currentPage == result.totalPages) {
        nextButton.style.display = 'none';
    }
    else {
        prevButton.style.display = 'inline-block';
        nextButton.style.display = 'inline-block';
    }

    document.querySelector('#current-page').textContent = currentPage;
    document.querySelector('#max-page').textContent = result.totalPages;
    document.querySelector('#consultations-table-body').innerHTML = result.tableData;
}

prevButton.addEventListener('click', ()=> {
    currentPage -= 1;
    loadTable();
})

nextButton.addEventListener('click', ()=> {
    currentPage += 1;
    loadTable();
})

loadTable();
//Livesearch
consultationSearchBox.addEventListener('input', async ()=> {
    livesearchQuery = consultationSearchBox.value;
    loadTable();
});

async function viewConsultation(id) {
    console.log(document.querySelector('#view-patient-id'));
    openModal(viewConsultationModal);
    try {
        const response = await fetch(`get_consultation.php?id=${id}`);
        const data = await response.json();
        console.log(data);
        document.querySelector('#view-consultation-date').textContent = data.ConsultDate;
        document.querySelector('#view-consultation-time').textContent = data.ConsultTime;
        document.querySelector('#view-patient-name').innerHTML = `
            ${data.PatientFullName} <span class="view-id" id="view-patient-id"></span>
        `;
        document.querySelector('#view-diagnosis').textContent = data.Diagnosis;
        document.querySelector('#view-prescription').textContent = data.Prescription;
        document.querySelector('#view-remarks').textContent = data.Remarks;
        document.querySelector('#view-doctor-name').innerHTML = `
            ${data.DoctorFullName} <span class="view-id" id="view-doctor-id"></span>
        `;
        document.querySelector('#view-patient-id').textContent = `(${data.PatientID})`;
        document.querySelector('#view-doctor-id').textContent = `(${data.DoctorID})`;
    } catch(error) {
        console.log(error);
    }
}

//Order
document.querySelectorAll(".sortable").forEach(th => {
    th.addEventListener("click", () => {
        const col = th.dataset.col;

        if (orderBy === col) {
            orderDir = orderDir === "ASC" ? "DESC" : "ASC";
        } else {
            orderBy = col;
            orderDir = "ASC";
        }

        document.querySelectorAll(".sortable").forEach(h => {
            h.classList.remove("asc", "desc", "active");
        });
        th.classList.add("active");
        th.classList.add(orderDir.toLowerCase());

        console.log("Sorting by:", orderBy, orderDir);
        loadTable();
    });
});

viewButton.forEach((viewButton)=> {
    viewButton.addEventListener("click", async ()=> {

    });
});

confirmDeletionButton.addEventListener("click", async ()=> {
    const id = confirmDeletionButton.dataset.id;
    const response = await fetch(`delete_consultation.php?id=${id}`);
    loadTable();
    deletionModal.style.display = 'none';
})

addConsultationButton.addEventListener("click", () => {
    openModal(addConsultationModal);
})

filterConsultationButton.addEventListener("click", () => {
    openModal(filterConsultationModal);
});

async function editConsultation(id) {
    openModal(editConsultationModal);
    confirmEditConsultationButton.dataset.id = id;
    try {
        const response = await fetch(`get_consultation.php?id=${id}`);
        const data = await response.json();
        document.querySelector('#edit-consultation-date').value = convertToISO(data.ConsultDate); 
        document.querySelector('#edit-consultation-time').value = convertTo24Hour(data.ConsultTime);
        document.querySelector('#edit-patient-name').value = data.PatientFullName;
        document.querySelector('#edit-diagnosis').value = data.Diagnosis;
        document.querySelector('#edit-prescription').value = data.Prescription;
        document.querySelector('#edit-remarks').value = data.Remarks;
        document.querySelector('#edit-doctor-name').value = data.DoctorFullName;
    }
    catch(error) {
        alert('not work');
    }
}

editConsultationButton.forEach((editConsultationButton)=> {
    editConsultationButton.addEventListener("click", async ()=> {
    
    });
})






editConsultationForm.addEventListener("submit", async (e) => {
    const id = confirmEditConsultationButton.dataset.id;
    e.preventDefault();
    const dateValue = document.querySelector('#edit-consultation-date').value;
    const timeValue = document.querySelector('#edit-consultation-time').value;
    if (!dateValue || !timeValue) {
        document.querySelector('#edit-datetime-error-message').textContent = 'Please input your desired date and time.';
        document.querySelector('#edit-datetime-error-message').style.display = 'block';
        return;
    }

    if (!document.querySelector('#edit-patient-name').value.trim()) {
        document.querySelector('#edit-patient-error-message').textContent = 'Required.';
        document.querySelector('#edit-patient-error-message').style.display = 'block';
        document.querySelector('#edit-patient-name').focus();
        return;
    }

    const diagnosis = document.querySelector('#edit-diagnosis').value.trim();
    if (!diagnosis) {
        document.querySelector('#edit-diagnosis-error-message').textContent = 'Required.';
        document.querySelector('#edit-diagnosis-error-message').style.display = 'block';
        document.querySelector('#edit-diagnosis').focus();
        return;
    }

    const prescription = document.querySelector('#edit-prescription').value.trim();
    if (!prescription) {
        document.querySelector('#edit-prescription-error-message').textContent = 'Required.';
        document.querySelector('#edit-prescription-error-message').style.display = 'block';
        document.querySelector('#edit-prescription').focus();
        return;
    }
    const doctorName = document.querySelector('#edit-doctor-name').value.trim();
    if (!doctorName) {
        document.querySelector('#edit-doctor-error-message').textContent = 'Required.';
        document.querySelector('#edit-doctor-name').focus();
        document.querySelector('#edit-doctor-error-message').style.display = 'block';
        return;
    }


    const formData = new FormData(editConsultationForm);
    formData.append('id', id);

    for (let [key, value] of formData.entries()) {
    console.log(key, value);

    loadTable();
}   

    const response = await fetch('./edit_consultation.php', {
        method: 'POST',
        body: formData
    });
    const text = (await response.text()).trim();
    console.log('PHP response:', text);

    if (text === "Record edited successfully") {
        editConsultationModal.style.display = 'none';
    } else {
        alert("Error: " + text);
    }
});

let hasPatientInputError = false;
let hasDoctorInputError = false;
editConsultationForm.addEventListener('input', (e) => {
    let timeoutId;
    clearTimeout(timeoutId);
    const patientError = document.querySelector('#edit-patient-error-message');
    const editButton = document.querySelector('#confirm-edit-btn');
    const doctorError = document.querySelector('#edit-doctor-error-message');
    timeoutId = setTimeout(async () => {
        const field = e.target;

        if (field.name === "ConsultationDate" || field.name === "ConsultationTime") {
            document.querySelector('#edit-datetime-error-message').style.display = 'none';
        }

        console.log(field.value);

        if (field.name === 'PatientName') {
            let autosuggestions = [];

            try {
                const response = await fetch(`./autosuggestions/autosuggest-patients.php?name=${encodeURIComponent(field.value)}`);
                autosuggestions = await response.json();
                console.log(autosuggestions);
            } catch (err) {
                console.error('Autosuggest fetch failed', err);
            }

            if (!field.checkValidity()) {
                patientError.textContent = 'Please enter a valid name.';
                patientError.style.display = 'block';
                hasPatientInputError = true;
            } else if (autosuggestions.length === 0) {
                patientError.textContent = 'Patient not found in database.';
                patientError.style.display = 'block';
                hasPatientInputError = true;
            } else {
                patientError.style.display = 'none';
                hasPatientInputError = false;
            }
        }

        if (field.name === 'DoctorName') {
            let autosuggestions = [];
            try {
                const response = await fetch(`./autosuggestions/autosuggest-doctors.php?name=${encodeURIComponent(field.value)}`);
                autosuggestions = await response.json();
                console.log(autosuggestions);
            } catch (err) {
                console.error('Autosuggest fetch failed', err);
            }
            if (!field.checkValidity()) {
                doctorError.textContent = 'Please enter a valid name.';
                doctorError.style.display = 'block';
                hasDoctorInputError = true;
            } else if (autosuggestions.length === 0) {
                doctorError.textContent = 'Doctor not found in database.';
                doctorError.style.display = 'block';
                hasDoctorInputError = true;          
            }
            else {
                doctorError.style.display = 'none';
                hasDoctorInputError = false;
            }
        }
        if (hasDoctorInputError || hasPatientInputError) {
            disableButton(editButton);
        }
        else {
            disableButton(editButton,false);
        }
    }, 500);
});

function deleteConsultation(id) {
    openModal(deletionModal);
    confirmDeletionButton.dataset.id = id;
}



addConsultationForm.addEventListener("submit", async (e) => {
    e.preventDefault();
if (!isCurrentDateTimeCheckbox.checked) {
    const dateValue = document.querySelector('#set-consultation-date').value;
    const timeValue = document.querySelector('#set-consultation-time').value;

    if (!dateValue || !timeValue) {
        document.querySelector('#add-datetime-error-message').textContent = 'Please input your desired date and time.';
        document.querySelector('#add-datetime-error-message').style.display = 'block';
        return; 
    }
}
    if (!document.querySelector('#add-patient-name').value.trim()) {
        document.querySelector('#add-patient-error-message').textContent = 'Required.';
        document.querySelector('#add-patient-error-message').style.display = 'block';
        document.querySelector('#add-patient-name').focus();
        return;
    }

    const diagnosis = document.querySelector('#add-diagnosis').value.trim();
    if (!diagnosis) {
        document.querySelector('#add-diagnosis-error-message').textContent = 'Required.';
        document.querySelector('#add-diagnosis-error-message').style.display = 'block';
        document.querySelector('#add-diagnosis').focus();
        return;
    }

    const prescription = document.querySelector('#add-prescription').value.trim();
    if (!prescription) {
        document.querySelector('#add-prescription-error-message').textContent = 'Required.';
        document.querySelector('#add-prescription-error-message').style.display = 'block';
        document.querySelector('#add-prescription').focus();
        return;
    }
    const doctorName = document.querySelector('#add-doctor-name').value.trim();
    if (!doctorName) {
        document.querySelector('#add-doctor-error-message').textContent = 'Required.';
        document.querySelector('#add-doctor-name').focus();
        document.querySelector('#add-doctor-error-message').style.display = 'block';
        return;
    }


    const formData = new FormData(addConsultationForm);

    const response = await fetch('./add_consultation.php', {
        method: 'POST',
        body: formData
    });
    const text = (await response.text()).trim();
    console.log('PHP response:', text);

    if (text === "New record created successfully") {
        addConsultationModal.style.display = 'none';
    } else {
        alert("Error: " + text);
    }
    loadTable();
})

addConsultationForm.addEventListener('input', (() => {
    const addButton = document.querySelector('.action.add');
    let timeoutId;
    let hasPatientInputError = false;
    let hasDoctorInputError = false;
    return (e) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
            const field = e.target;
            if (field.name == "ConsultationDate" || field.name == "ConsultationTime") {
                document.querySelector('#add-datetime-error-message').style.display = 'none';
            }
            if (field.name === 'PatientName') {
                let autosuggestions = [];
                try {
                    const response = await fetch(`./autosuggestions/autosuggest-patients.php?name=${encodeURIComponent(field.value)}`);
                    autosuggestions = await response.json();
                } catch (err) {
                    console.error('Autosuggest fetch failed', err);
                }

                if (!field.checkValidity()) {
                    document.querySelector('#add-patient-error-message').textContent = 'Please enter a valid name.';
                    document.querySelector('#add-patient-error-message').style.display = 'block';
                    hasPatientInputError = true;
                } 
                else if (autosuggestions.length === 0) {
                    document.querySelector('#add-patient-error-message').textContent = 'Patient not found in database.';
                    document.querySelector('#add-patient-error-message').style.display = 'block';
                    hasPatientInputError = true;            
                } else {
                    document.querySelector('#add-patient-error-message').style.display = 'none';
                    hasPatientInputError = false;

                }
            }
            if (field.name === 'DoctorName') {
                let autosuggestions = [];

                try {
                    const response = await fetch(`./autosuggestions/autosuggest-doctors.php?name=${encodeURIComponent(field.value)}`);
                    autosuggestions = await response.json();
                } catch (err) {
                    console.error('Autosuggest fetch failed', err);
                }
                if (!field.checkValidity()) {
                    document.querySelector('#add-doctor-error-message').textContent = 'Please enter a valid name.';
                    document.querySelector('#add-doctor-error-message').style.display = 'block';
                    hasDoctorInputError = true;
                } else if (autosuggestions.length === 0) {
                    document.querySelector('#add-doctor-error-message').textContent = 'Doctor not found in database.';
                    document.querySelector('#add-doctor-error-message').style.display = 'block';
                    hasDoctorInputError = true;                   
                }
                else {
                    document.querySelector('#add-doctor-error-message').style.display = 'none';
                    hasDoctorInputError = false;
                }
            }
            if (hasDoctorInputError || hasPatientInputError) {
                disableButton(addButton);
            }
            else {
                disableButton(addButton,false);
            }
        }, 500); // 500ms debounce delay
    };
})());

isCurrentDateTimeCheckbox.addEventListener("change", ()=> {
    const isChecked = isCurrentDateTimeCheckbox.checked;
    if (isChecked) {
        document.querySelector('#set-consultation-date').setAttribute('disabled', 0);
        document.querySelector('#set-consultation-time').setAttribute('disabled', 0);
    }
    else {
        document.querySelector('#set-consultation-date').removeAttribute('disabled');
        document.querySelector('#set-consultation-time').removeAttribute('disabled');
    }
})

filterConsultationForm.addEventListener('input', ((e) => {
    let timeoutId;
    const startDateInput = document.querySelector('#filter-start-date');
    const endDateInput = document.querySelector('#filter-end-date');
    //set max possible dates to current
    startDateInput.setAttribute('max', new Date().toISOString().slice(0, 10));
    endDateInput.setAttribute('max', new Date().toISOString().slice(0, 10));
    return (e) => {
        e.preventDefault();
        clearTimeout(timeoutId);
        const field = e.target;
        timeoutId = setTimeout(() => {
            //Validation for dates
            if (startDateInput.value && endDateInput.value) {
                const startDate = new Date(startDateInput.value);
                const endDate = new Date(endDateInput.value);
                if (endDate < startDate) {
                    document.querySelector('#filter-date-error-message').textContent = "End date must not be earlier than starting date";
                    disableButton(document.querySelector('.action.filter'));
                    document.querySelector('#filter-date-error-message').style.display = "block";
                } else {
                    document.querySelector('#filter-date-error-message').style.display = "none";
                    disableButton(document.querySelector('.action.filter'), false);
                }
            }
        }, 500);
    };
})());

filterConsultationForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const startDateInput = document.querySelector('#filter-start-date');
    const endDateInput = document.querySelector('#filter-end-date');
    const diagnosisInput = document.querySelector('#filter-diagnosis');
    const prescriptionInput = document.querySelector('#filter-prescription');
    startingDateFilter = startDateInput.value;
    endingDateFilter = endDateInput.value;
    diagnosisFilter = diagnosisInput.value;
    prescriptionFilter = prescriptionInput.value;
    loadTable();
    filterConsultationModal.style.display = 'none';
    document.body.classList.remove("body-no-scroll");
})

addPatientInput.addEventListener('input', async (e) => {
    const query = addPatientInput.value.trim();
    const response = await fetch(`./autosuggestions/autosuggest-patients.php?name=${encodeURIComponent(query)}`);
    const autosuggestions = await response.json();
    const container = document.querySelector('#add-patient-autosuggest');

    container.innerHTML = '';
    if (Object.keys(autosuggestions).length == 0 || query == '') {
        container.style.display = 'none';
    }
    else {
        autosuggestions.forEach(name => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = name;
        item.addEventListener('click', () => {
            addPatientInput.value = name;
            container.style.display = 'none';
        });
        container.appendChild(item);
    });

    container.style.display = 'block';
    }
    
});

addDiagnosisInput.addEventListener('input', async (e) => {
    const query = addDiagnosisInput.value.trim();
    const response = await fetch(`./autosuggestions/autosuggest-diagnosis.php?diagnosis=${encodeURIComponent(query)}`);
    const autosuggestions = await response.json();
    const container = document.querySelector('#add-diagnosis-autosuggest');

    container.innerHTML = '';
    if (Object.keys(autosuggestions).length == 0 || query == '') {
        container.style.display = 'none';
    }
    else {
        autosuggestions.forEach(name => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = name;
        item.addEventListener('click', () => {
            addDiagnosisInput.value = name;
            container.style.display = 'none';
        });
        container.appendChild(item);
    });

    container.style.display = 'block';
    }
    
});

addPrescriptionInput.addEventListener('input', async (e) => {
    const query = addPrescriptionInput.value.trim();
    const response = await fetch(`./autosuggestions/autosuggest-prescription.php?prescription=${encodeURIComponent(query)}`);
    const autosuggestions = await response.json();
    const container = document.querySelector('#add-prescription-autosuggest');

    container.innerHTML = '';
    if (Object.keys(autosuggestions).length == 0 || query == '') {
        container.style.display = 'none';
    }
    else {
        autosuggestions.forEach(name => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = name;
        item.addEventListener('click', () => {
            addPrescriptionInput.value = name;
            container.style.display = 'none';
        });
        container.appendChild(item);
    });

    container.style.display = 'block';
    }
    
});

addDoctorInput.addEventListener('input', async (e)=> {
    const query = addDoctorInput.value.trim();
    const response = await fetch(`./autosuggestions/autosuggest-doctors.php?name=${encodeURIComponent(query)}`);
    const autosuggestions = await response.json();
    const container = document.querySelector('#add-doctor-autosuggest');

    container.innerHTML = '';
    if (Object.keys(autosuggestions).length == 0 || query == '') {
        container.style.display = 'none';
    }
    else {
        autosuggestions.forEach(name => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = name;
        item.addEventListener('click', () => {
            addDoctorInput.value = name;
            container.style.display = 'none';
        });
        container.appendChild(item);
    });

    container.style.display = 'block';
    }
});

editPatientInput.addEventListener('input', async (e) => {
    const query = editPatientInput.value.trim();
    const response = await fetch(`./autosuggestions/autosuggest-patients.php?name=${encodeURIComponent(query)}`);
    const autosuggestions = await response.json();
    const container = document.querySelector('#edit-patient-autosuggest');

    container.innerHTML = '';
    if (Object.keys(autosuggestions).length == 0 || query == '') {
        container.style.display = 'none';
    }
    else {
        autosuggestions.forEach(name => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = name;
        item.addEventListener('click', () => {
            editPatientInput.value = name;
            container.style.display = 'none';
        });
        container.appendChild(item);
    });

    container.style.display = 'block';
    }
    
});

editDiagnosisInput.addEventListener('input', async (e) => {
    const query = editDiagnosisInput.value.trim();
    const response = await fetch(`./autosuggestions/autosuggest-diagnosis.php?diagnosis=${encodeURIComponent(query)}`);
    const autosuggestions = await response.json();
    const container = document.querySelector('#edit-diagnosis-autosuggest');

    container.innerHTML = '';
    if (Object.keys(autosuggestions).length == 0 || query == '') {
        container.style.display = 'none';
    }
    else {
        autosuggestions.forEach(name => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = name;
        item.addEventListener('click', () => {
            editDiagnosisInput.value = name;
            container.style.display = 'none';
        });
        container.appendChild(item);
    });
    container.style.display = 'block';
    }
    
});

editPrescriptionInput.addEventListener('input', async (e) => {
    const query = editPrescriptionInput.value.trim();
    const response = await fetch(`./autosuggestions/autosuggest-prescription.php?prescription=${encodeURIComponent(query)}`);
    const autosuggestions = await response.json();
    const container = document.querySelector('#edit-prescription-autosuggest');

    container.innerHTML = '';
    if (Object.keys(autosuggestions).length == 0 || query == '') {
        container.style.display = 'none';
    }
    else {
        autosuggestions.forEach(name => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = name;
        item.addEventListener('click', () => {
            editPrescriptionInput.value = name;
            container.style.display = 'none';
        });
        container.appendChild(item);
    });

    container.style.display = 'block';
    }
    
});

editDoctorInput.addEventListener('input', async (e) => {
    const query = editDoctorInput.value.trim();
    const response = await fetch(`./autosuggestions/autosuggest-doctors.php?name=${encodeURIComponent(query)}`);
    const autosuggestions = await response.json();
    const container = document.querySelector('#edit-doctor-autosuggest');

    container.innerHTML = '';
    if (Object.keys(autosuggestions).length == 0 || query == '') {
        container.style.display = 'none';
    }
    else {
        autosuggestions.forEach(name => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = name;
        item.addEventListener('click', () => {
            editDoctorInput.value = name;
            container.style.display = 'none';
        });
        container.appendChild(item);
    });

    container.style.display = 'block';
    }
    
});

filterDiagnosisInput.addEventListener('input', async (e) => {
    const query = filterDiagnosisInput.value.trim();
    const response = await fetch(`./autosuggestions/autosuggest-diagnosis.php?diagnosis=${encodeURIComponent(query)}`);
    const autosuggestions = await response.json();
    const container = document.querySelector('#filter-diagnosis-autosuggest');

    container.innerHTML = '';
    if (Object.keys(autosuggestions).length == 0 || query == '') {
        container.style.display = 'none';
    }
    else {
        autosuggestions.forEach(name => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = name;
        item.addEventListener('click', () => {
            filterDiagnosisInput.value = name;
            container.style.display = 'none';
        });
        container.appendChild(item);
    });
    container.style.display = 'block';
    }
    
});

filterPrescriptionInput.addEventListener('input', async (e) => {
    const query = filterPrescriptionInput.value.trim();
    const response = await fetch(`./autosuggestions/autosuggest-prescription.php?prescription=${encodeURIComponent(query)}`);
    const autosuggestions = await response.json();
    const container = document.querySelector('#filter-prescription-autosuggest');

    container.innerHTML = '';
    if (Object.keys(autosuggestions).length == 0 || query == '') {
        container.style.display = 'none';
    }
    else {
        autosuggestions.forEach(name => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = name;
        item.addEventListener('click', () => {
            filterPrescriptionInput.value = name;
            container.style.display = 'none';
        });
        container.appendChild(item);
    });

    container.style.display = 'block';
    }
    
});





modalCloseButton.forEach((btn) => {
    btn.addEventListener("click", ()=> {
        deletionModal.style.display = 'none';
        viewConsultationModal.style.display = 'none';
        addConsultationModal.style.display = 'none';
        editConsultationModal.style.display = 'none';
        filterConsultationModal.style.display = 'none';
        document.body.classList.remove("body-no-scroll");
    })
});

function openModal(modal) {
    modal.style.display = "flex";
    document.body.classList.add("body-no-scroll");
}

function disableButton(button, isButtonDisabled=true) {
    if (isButtonDisabled) {
        button.setAttribute('disabled', 0);
    }
    else {
        button.removeAttribute('disabled');
    }
}

function convertToISO(dateStr) {
    const date = new Date(dateStr);

    if (isNaN(date)) {
        throw new Error("Invalid date format");
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


function convertTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(' '); // e.g., ["11:00", "AM"]
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12;
    } else if (modifier.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
    }
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');

    return `${hh}:${mm}`;
}

const mobileBtn = document.getElementById("mobile-menu-btn");
const slideMenu = document.getElementById("tba-slide-menu");
const overlay = document.getElementById("tba-overlay");

mobileBtn.addEventListener("click", () => {
    slideMenu.classList.add("open");
    overlay.classList.add("show");
});

overlay.addEventListener("click", () => {
    slideMenu.classList.remove("open");
    overlay.classList.remove("show");
});
