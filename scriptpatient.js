const deletePatientModal = document.querySelector('#delete-patient-modal');
const deletePatientButton = document.querySelector('.action.delete-ptnt');
const confirmDeletionButton = document.querySelector('.action.confirm-delete-patient');

const editPatientModal = document.querySelector('#edit-patient-modal');
const editPatientConfirmModal = document.querySelector('#edit-patient-confirm-modal');
const editPatientButton = document.querySelector('.action.edit-ptnt');
const saveEditsButton = document.querySelector('.action.save-edits');
const editPatientForm = document.getElementById('edit-patient-form');


const addPatientButton = document.querySelector('#add-patient-btn');
const addPatientModal = document.querySelector('#add-patient-modal');
const addPatientForm = document.querySelector("#add-patient-form");
const addPatientConfirmModal = document.querySelector('#add-patient-confirm-modal');

const filterPatientModal = document.querySelector('#filter-patient-modal');
const filterPatientButton = document.querySelector('#filter-patient-btn');
const filterPatientForm = document.querySelector('#filter-patient-form');
const confirmFilterButton = document.querySelector('.action.filter-reset')

const modals = document.querySelectorAll('.modal');

const searchBoxes = document.querySelectorAll("#patient-searchbox");
const resultsContainers = document.querySelectorAll("#patient-search-results");

function debounce(func, wait = 300) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

searchBoxes.forEach((searchBox, index) => {
    const resultsDiv = resultsContainers[index] || resultsContainers[0]; 

    searchBox.addEventListener("keyup", debounce(() => {
        const query = searchBox.value.trim();
        const filterInput = getFilter();
        
        let url = "livesearch_patient.php";
        const queryInput = [];

       const shouldSearch = query.length > 0 || filterInput;

        if (query.length > 0) {
            queryInput.push("q=" + encodeURIComponent(query));
            resultsDiv.style.display = 'block'; 
        } else {
            resultsDiv.style.display = 'none';
        }

        if (filterInput) {
            queryInput.push(filterInput);
        }
        
        if (queryInput.length === 0) {
            resultsDiv.innerHTML = "";
            resultsDiv.style.display = 'none'; 
            return;
        }

        url += "?" + queryInput.join("&"); 

        fetch(url) 
            .then(res => res.text())
            .then(data => {
                resultsDiv.innerHTML = data;
            })
            .catch(err => console.error("Live search error:", err));
    }, 300)); 
});

function closeModals() {
    modals.forEach(modal => {
        modal.style.display = 'none';
        if (modal.id === 'add-patient-modal') {
            const formToReset = modal.querySelector('form');
            if (formToReset) {
                formToReset.reset();
            }
        }
    });
}

function getFilter() {
    const formData = new FormData(filterPatientForm);
    const input = {};
    
    const sex = formData.get('Sex');
    if (sex) {
        input.sex = sex;
    }

    const startDate = formData.get('StartDate');
    if (startDate) {
        input.startBday = startDate;
    }
    
    const endDate = formData.get('EndDate');
    if (endDate) {
        input.endBday = endDate;
    }
    
    const contact = formData.get('ContactNo');
    if (contact && contact.trim().length > 0) {
        input.contact = contact.trim();
    }
    
    return new URLSearchParams(input).toString();
}
 
document.querySelectorAll('.close-btn-patient').forEach(btn => {
    btn.addEventListener('click', closeModals);
});

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
        partContact.focus();
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

    const patientDupe = document.querySelector('#dupe-patient-error-message'); 
    patientDupe.style.display = 'none'; 
    patientDupe.textContent = '';

        if (text === "New record created successfully") {
            addPatientModal.style.display = 'none';
            addPatientConfirmModal.style.display = 'flex';
            addPatientForm.reset();

        } else if (text.startsWith("Error:")) {
            patientDupe.textContent = text.replace("Error:", "").trim();
            patientDupe.style.display = 'block';
            addPatientModal.style.display = 'flex';
            
            document.querySelector('#add-lname-error-message').style.display = 'none';
            document.querySelector('#add-sex-error-message').style.display = 'none';
            document.querySelector('#add-bdayerror-message').style.display = 'none';
            document.querySelector('#add-contact-error-message').style.display = 'none';
            
        } else {
            // Unknown error
            alert("An unexpected error occurred: " + text);
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

if(filterPatientButton){
document.querySelectorAll('#filter-patient-btn').forEach(btn => {
    btn.addEventListener('click', () => {
       filterPatientModal.style.display = 'flex';
    });
});
}

if (deletePatientButton) {
    deletePatientButton.addEventListener("click", () => {
        if (deletePatientModal) {
            deletePatientModal.style.display = 'flex';
        } else {
            console.error("Delete modal not found.");
        }
    });
} else {
    console.log("Delete button not found.");
}

if (confirmDeletionButton) {
    confirmDeletionButton.addEventListener("click", async () => {
        if (!deletePatientButton) {
             console.error("Cannot confirm deletion: Delete button data-id is missing.");
             return;
        }
        
        const id = deletePatientButton.dataset.id;
        const response = await fetch(`delete_patient.php?id=${id}`);
        const text = await response.text();
        if (text.includes("success")) {   
            window.location.href = "patient.php"; 
        } else {
            alert("Failed to delete patient.");
        }
    });
}

if (editPatientButton) {editPatientButton.addEventListener("click", async () => {
    editPatientModal.style.display = 'flex';
    const id = editPatientButton.dataset.id; 

    try {
        const response = await fetch(`fetch_patient.php?id=${id}`);
        const data = await response.json();

        document.querySelector('#edit-p-firstname').value = data.PatientFirstName;
        document.querySelector('#edit-p-middleinit').value = data.PatientMiddleInit;
        document.querySelector('#edit-p-lastname').value = data.PatientLastName;
        document.querySelector('#edit-sex').value = data.PatientSex;
        document.querySelector('#edit-bday').value = data.PatientBirthday;  
        
        const fullContact = data.PatientContactNo; 

        if (fullContact && fullContact.startsWith('+639') && fullContact.length >= 13) {
            const partContactNo = fullContact.slice(-9); 
            document.querySelector('#edit-partcontact').value = partContactNo;
            document.querySelector('#edit-contact').value = fullContact;
        } else {
            document.querySelector('#edit-partcontact').value = '';
            document.querySelector('#edit-contact').value = '';
            console.warn("Patient contact number is missing or invalid format.");
        }

        saveEditsButton.dataset.id = id;
    } catch (error) {
        alert("Error loading patient.");
        console.error(error);
    }
});
}

// FOr trimming name inputs sa edit
const editFirstNameInput = document.querySelector('#edit-p-firstname');
const editMiddleInitInput = document.querySelector('#edit-p-middleinit');
const editLastNameInput = document.querySelector('#edit-p-lastname');
if (editFirstNameInput) {
    editFirstNameInput.addEventListener('blur', function() {
        this.value = this.value.trim();
    });
}
if (editMiddleInitInput) {
    editMiddleInitInput.addEventListener('blur', function() {
        this.value = this.value.trim();
    });
}
if (editLastNameInput) {
    editLastNameInput.addEventListener('blur', function() {
        this.value = this.value.trim();
    });
}

if(editPatientForm){
document.querySelectorAll('#edit-patient-form').forEach(form => {
    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const patientID = saveEditsButton.dataset.id;
    const tableRows = document.querySelectorAll("#patient-information-table tr");

    // Contact splicing
    const partContactInput = document.querySelector('#edit-partcontact'); 
    const partContact = partContactInput.value.trim();
    const prefix = document.querySelector('#contactprefix').value.trim();
    
    const formData = new FormData(editPatientForm);
    formData.append('PatientID', patientID); 

    let finalFullContact = '';
    
    if (partContact.length > 0) {
            if (partContact.length !== 9 || !/^\d{9}$/.test(partContact)) {
                contactErrorElement.textContent = 'Contact Number must be exactly 9 digits.';
                contactErrorElement.style.display = 'block';
                partContactInput.focus();
                return; 
            }
            finalFullContact = prefix + partContact; 
            formData.set('ContactNo', finalFullContact); 
            document.querySelector('#edit-contact').value = finalFullContact; 
    }

    try {
        const response = await fetch('update_patient.php', {
            method: 'POST',
            body: formData 
        });

        const data = await response.json();

        if (data.success) {
            // Name
            const newFirstName = formData.get('PFirstName');
            const newMiddleInit = formData.get('PMiddleInit');
            const newLastName = formData.get('PLastName');
            let newFullName = newFirstName;

            if (newMiddleInit && newMiddleInit.trim() !== "") {
                newFullName += ` ${newMiddleInit.trim()}.`;
            }
            newFullName += ` ${newLastName}`
            tableRows[1].children[1].innerText = newFullName.trim();

            // Sex
            if (formData.get('Sex')) tableRows[2].children[1].innerText = formData.get('Sex');

            // Birthday
            if (formData.get('Birthday')) tableRows[3].children[1].innerText = formData.get('Birthday');

            // Contact Number
            const newContactValue = finalFullContact || formData.get('ContactNo'); 
            if (newContactValue) {
                tableRows[4].children[1].innerText = newContactValue;
            }

            editPatientModal.style.display = 'none';
            editPatientConfirmModal.style.display = 'flex';
            editPatientForm.reset();
        } else {
            alert(`Update failed: ${data.message}`);
        }
    } catch(err) {
        console.error(err);
        alert('An error occurred while updating patient info.');
    }

    });
});
}

if(filterPatientForm){
document.querySelector('#filter-patient-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    closeModals();
    const currentSearchBox = searchBoxes[0];
    if (currentSearchBox) {
        currentSearchBox.dispatchEvent(new Event('keyup'));
    }
});
}

if(confirmFilterButton){
document.querySelector('.action.filter-reset').addEventListener('click', function(e) {
    e.preventDefault(); 
    filterPatientForm.reset();
    closeModals();
    const currentSearchBox = searchBoxes[0];
    if (currentSearchBox) {
        currentSearchBox.dispatchEvent(new Event('keyup'));
    }
});
}
