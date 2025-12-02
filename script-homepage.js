const addConsultationButton = document.querySelector('#add-consultation-btn');
const addConsultationForm = document.querySelector("#add-consultation-form");
const addConsultationModal = document.querySelector('#add-consultation-modal');
const addPatientInput = document.querySelector('#add-patient-name');
const addDoctorInput = document.querySelector('#add-doctor-name');
const addDiagnosisInput = document.querySelector('#add-diagnosis');
const addPrescriptionInput = document.querySelector('#add-prescription');
const modalCloseButton = document.querySelectorAll('.close-btn');
const isCurrentDateTimeCheckbox = document.querySelector('#is-current-date-time');

const addPatientButton = document.querySelector('#add-patient-btn');
const addPatientModal = document.querySelector('#add-patient-modal');
const addPatientForm = document.querySelector("#add-patient-form");

document.querySelectorAll('#add-patient-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        addPatientModal.style.display = 'flex';
    });
});

document.querySelectorAll('#add-patient-form').forEach(form => {
    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstname = document.querySelector('#add-p-firstname').value.trim();
    if (!firstname) {
        document.querySelector('#add-fname-error-message').textContent = 'Required.';
        document.querySelector('#add-fname-error-message').style.display = 'block';
        document.querySelector('#add-p-firstname').focus();
        return;
    }

    const middleinit = document.querySelector('#add-p-middleinit').value.trim();

    const lastname= document.querySelector('#add-p-lastname').value.trim();
    if (!lastname) {
        document.querySelector('#add-lname-error-message').textContent = 'Required.';
        document.querySelector('#add-lname-error-message').style.display = 'block';
        document.querySelector('#add-p-lastname').focus();
        return;
    }

    const sex = document.querySelector('#add-sex').value.trim();
    if (!sex) {
        document.querySelector('#add-sex-error-message').textContent = 'Please select a sex.';
        document.querySelector('#add-sex-error-message').style.display = 'block';
        return;
    }

    const bday = document.querySelector('#add-bday').value.trim();
    if (!bday) {
        document.querySelector('#add-bdayerror-message').textContent = 'Required.';
        document.querySelector('#add-bdayerror-message').focus();
        document.querySelector('#add-bday').style.display = 'block';
        return;
    }

    const prefix = document.querySelector('#contactprefix').value.trim();
    const partContact = document.querySelector('#partcontact').value.trim();
    const fullContactHidden = document.querySelector('#add-contact');

    if (!partContact || partContact.length !== 9 || !/^\d{9}$/.test(partContact)) {
        document.querySelector('#add-contact-error-message').textContent = 'Contact Number must be the required 9 digits.';
        document.querySelector('#add-contact-error-message').style.display = 'block';
        const errorMsgDiv = document.querySelector('#add-contact-error-message');
        errorMsgDiv.style.display = 'block';
        
        partContactInput.focus();
        return;
    }

   const fullContact = prefix + partContact;

    if (fullContactHidden) {
            fullContactHidden.value = fullContact;
        } else {
            console.error("Hidden contact field not found!");
            return; 
        }

    const formData = new FormData(addPatientForm);

    const response = await fetch('./add_patient.php', {
        method: 'POST',
        body: formData
    });

    const text = (await response.text()).trim();
    console.log('PHP response:', text);

    if (text === "New record created successfully") {
        addPatientModal.style.display = 'none';
    } else {
        alert("Error: " + text);
    }
    
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });
  console.log("Form Data as Object:", formObject);
    addPatientModal.style.display = 'none';
    addPatientConfirmModal.style.display = 'flex';
    addPatientForm.reset();
});});


addConsultationButton.addEventListener("click", () => {
    openModal(addConsultationModal);
})

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
    getDatabaseStatistics();
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



modalCloseButton.forEach((btn) => {
    btn.addEventListener("click", ()=> {
        addConsultationModal.style.display = 'none';
        addPatientModal.style.display = 'none';
        document.body.classList.remove("body-no-scroll");
    })
});

function disableButton(button, isButtonDisabled=true) {
    if (isButtonDisabled) {
        button.setAttribute('disabled', 0);
    }
    else {
        button.removeAttribute('disabled');
    }
}

//i just thought this would look cool lmao
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
    }

function openModal(modal) {
    modal.style.display = "flex";
    document.body.classList.add("body-no-scroll");
}    

async function getDatabaseStatistics() {
    const response = await fetch('homepage_stats.php');
    const result = await response.json();
    animateValue(document.querySelector('#total-consultations'), 0, result.totalConsultations, 500);
    animateValue(document.querySelector('#total-doctors'), 0, result.totalDoctors, 500);
    animateValue(document.querySelector('#total-patients'), 0, result.totalPatients, 500);
}

getDatabaseStatistics();

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