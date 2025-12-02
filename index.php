<?php
 include("database.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HSO Database</title>
    <link rel="stylesheet" href="./style.css">
    <script src="https://kit.fontawesome.com/ea8c838e77.js" crossorigin="anonymous"></script>
</head>
<body>

<?php include('header.php') ?>

<!--ADD PATIENT-->
<div id="add-patient-modal" class="modal">
    <div class="modal-content">
        <div class="close-btn-div">
            <div>Add new patient</div>
            <button class="close-btn" id="close-add-modal"><img class='btn-img' src="./img/close.svg"></button>
        </div>
        <div class="modal-message">
            <form id='add-patient-form' method='POST'>
                <!-- NAME -->
                <fieldset class='p-name-fieldset'>                   
                    <div class="forms-input">
                        <label for="add-p-firstname">First Name *</label>
                        <input type="text" name="PFirstName" id="add-p-firstname" pattern="^[A-Za-z.]+([ .][A-Za-z.]+)*$" title="Name must contain only letters and periods." maxlength="64" required>
                        <span class='error-message' id='add-fname-error-message'>Yipeee</span>
                    </div>     
                    <div class="forms-input">
                        <label for="add-p-middleinit">Middle Initial</label>
                        <input type="text" name="PMiddleInit" id="add-p-middleinit" pattern="^[A-Za-z]+$" maxlength="2" title="Initials must only be letters.">
                        <span class='error-message' id='add-mname-error-message'>Yipeee</span>
                    </div> 
                    <div class="forms-input">
                        <label for="add-p-lastname">Last Name *</label>
                        <input type="text" name="PLastName" id="add-p-lastname" pattern="^[A-Za-z.]+([ .][A-Za-z.]+)*$" maxlength="64" title="Name must contain only letters and periods." required>
                        <span class='error-message' id='add-lname-error-message'>Yipeee</span>
                    </div> 
                </fieldset>

                <!-- SEX -->
                <fieldset class='sex-fieldset'>
                    <div class="forms-input">
                        <label for="add-sex">Sex *</label>
                        <select name="Sex" id="add-sex" required>
                            <option value="" selected disabled> </option>
                            <option value="F">Female</option>
                            <option value="M">Male</option>
                            <option value="O">Other</option>
                        </select>
                    </div>     
                </fieldset>

                <!-- BIRTHDAY -->
                <fieldset class='bday-fieldset'>
                    <div class="forms-input">
                        <label for="add-bday">Birthday *</label>
                        <input name="Birthday" id="add-bday" type="date" min="1900-01-01" max="<?php echo date("Y-m-d"); ?>" required>
                        <span class='error-message' id='add-bdayerror-message'>Yipeee</span>
                    </div>     
                </fieldset>
                
                <!-- CONTACT -->
                <fieldset class='contactno-fieldset'>
                    <div class="forms-input">
                        <label for="add-contact">Contact Number *</label>
                        <div style="display:flex">
                        <input type="text" value="+639" readonly id="contactprefix">
                        <input type="tel" id="partcontact" name="PartContactNo" placeholder="123456789" pattern="[0-9]{9}" maxlength="9" title="Input must contain numbers only." required>
                        </div>
                        <input type="hidden" name="ContactNo" id="add-contact">
                        <span class='error-message' id='add-contact-error-message'>Yipeee</span>
                    </div>     
                </fieldset>
            </form>
        </div>

        <div class='consultation-modal-actions'>
            <button class='action add' type='submit' form='add-patient-form'>Add</button>
        </div>
    </div>
</div>

<!--ADD CONSULT-->
<div id="add-consultation-modal" class="modal">
    <div class="modal-content">
        <div class="close-btn-div">
            <div>Add new consultation</div>
            <button class="close-btn"><img class='btn-img' src="./img/close.svg"></button>
        </div>

        <div class="modal-message">
            <form id='add-consultation-form' action='./add_consultation.php' method='POST' autocomplete="off">

                <fieldset class='date-time-fieldset'>
                    <legend>Date and Time</legend>

                    <div id='is-current-date-time-container'>
                        <input type='checkbox' id="is-current-date-time" checked>
                        <label for="is-current-date-time">Current time and date</label>
                    </div>

                    <div id='set-date-time-container'>
                        <label>Date</label>
                        <input type="date" name="ConsultationDate" id="set-consultation-date" min='2024-01-01' disabled>

                        <label>Time</label>
                        <input type="time" name="ConsultationTime" id="set-consultation-time" disabled> 
                    </div>
                    <span class='error-message' id='add-datetime-error-message'>Yipeee</span>  
                </fieldset>

                <fieldset class='patient-fieldset'>
                    <legend>Patient</legend>
                    <div class="forms-input">
                        <label for="patient-name">Patient Name *</label>
                        <input type="text" name="PatientName" id="add-patient-name" pattern="^[A-Za-z.]+([ .][A-Za-z.]+)*$" maxlength="64">
                        <span class='error-message' id='add-patient-error-message'>Yipeee</span>
                        <div id="add-patient-autosuggest" class="autosuggest-box"></div>
                    </div>
                </fieldset>

                <fieldset class='consultation-fieldset'>
                    <legend>Consultation</legend>

                    <div class="forms-input">
                        <label for="add-diagnosis">Diagnosis *</label>
                        <input type="text" name="Diagnosis" id="add-diagnosis" maxlength="64">
                        <span class='error-message' id='add-diagnosis-error-message'>Yipeee</span>
                        <div id="add-diagnosis-autosuggest" class="autosuggest-box"></div>
                    </div>

                    <div class="forms-input">
                        <label for="add-prescription">Prescription *</label>
                        <input type="text" name="Prescription" id="add-prescription" maxlength="64">
                        <span class='error-message' id='add-prescription-error-message'>Yipeee</span>
                        <div id="add-prescription-autosuggest" class="autosuggest-box"></div>
                    </div>

                    <div class="forms-input">
                        <label for="add-remarks">Remarks</label>
                        <input type='text' name='Remarks' id='add-remarks' maxlength='256'>
                    </div>
                </fieldset>
            
                <fieldset class='doctor-fieldset'>
                    <legend>Doctor</legend>
                    <div class="forms-input">
                        <label for="add-doctor-name">Doctor Name *</label>
                        <input type="text" name="DoctorName" id="add-doctor-name" pattern="^[A-Za-z.]+([ .][A-Za-z.]+)*$" maxlength="64">
                        <span class='error-message' id='add-doctor-error-message'>Yipeee</span>
                        <div id="add-doctor-autosuggest" class="autosuggest-box"></div>
                    </div>     
                </fieldset>

            </form>
        </div>

        <div class='consultation-modal-actions'>
            <button class='action add' type='submit' form='add-consultation-form'>Add</button>
        </div>
    </div>
</div>



<div class="about-container">
    <div class="section-title">About the Clinic</div>
    <div class="description">
    Welcome to the database website of TBA Clinic. This platform is designed to streamline the clinic's operations by providing efficient management of patients, doctors, and consultations. Our goal is to deliver fast, organized, and reliable access to clinic data for staff and administrators.
    </div>
    <div class="section-title" style="margin-top: 40px;">Clinic Statistics</div>
    <div class="stats">
        <div class="stat-card">
            <div class="stat-number" id='total-consultations'>0</div>
            <div class="stat-label">Total Consultations</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id='total-doctors'>0</div>
            <div class="stat-label">Total Doctors</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id='total-patients'>0</div>
            <div class="stat-label">Total Patients</div>
        </div>
    </div>
    <div class="actions">
        <div class="section-title">Quick Actions</div>
        <div class="action-buttons">
            <button class="action-btn" id='add-consultation-btn'><i class="fa-solid fa-book-medical"></i> Add Consultation</button>
            <button class="action-btn"><i class="fa-solid fa-user-doctor"></i> Add Doctor</button>
            <button class="action-btn" id='add-patient-btn'><i class="fa-solid fa-user"></i> Add Patient</button>
        </div>
    </div>
</div>

<?php include('footer.php') ?>

<script src='./script-homepage.js'></script>
</body>
</html>