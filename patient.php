<?php
include("database.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Information</title>
    <link rel="stylesheet" href="./style.css">
    <script src="https://kit.fontawesome.com/ea8c838e77.js" crossorigin="anonymous"></script>
</head>
<body>
    
<!--CONFIRMED ADD MODAL-->
 <div id="add-patient-confirm-modal" class="modal">
    <div class="modal-contentP">
        <div class="close-btn-div">
            <div>Edit Success</div>
            <button class="close-btn-patient"><img class='btn-img' src="./img/close.svg"></button>
        </div>

        <div class="modal-message">
            <h2 class="edit-patient-reminder">Patient Successfully Added!</h2>
        </div>
    </div>
    </div>

<!-- ADD MODAL -->
<div id="add-patient-modal" class="modal">
    <div class="modal-content">
        <div class="close-btn-div">
            <div>Add new patient</div>
            <button class="close-btn-patient" id="close-add-modal"><img class='btn-img' src="./img/close.svg"></button>
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
                        <div>
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

<!-- HEADER -->
<div class="header">
    <a id="hyperlink-logo" href="./index.php">
        <div class='header-img' id='logo'>
            <img id='logo-img' src='./img/logo.svg'> TBAClinic 
        </div>
    </a>
    <ul class="links">
        <li><a href="./index.php">Home</a></li>
        <li><a href="./consultation.php">Consultations</a></li>
        <li><a href="./patient.php">Patients</a></li>
        <li><a href="./staff.php">Staff</a></li>
        <li><a href="#footer">Contact</a></li>
    </ul>
    <button id='mobile-menu-btn'><img class='header-img' src='./img/menu.svg'></button>
</div>

<!-- FILTER MODAL -->
<div id="filter-patient-modal" class="modal">
    <div class="modal-content">
        <div class="close-btn-div">
            <div>Filter Patients</div>
            <button class="close-btn-patient"><img class='btn-img' src="./img/close.svg"></button>
        </div>
        <div class="modal-message">
            <form id="filter-patient-form" method='POST'>
                <fieldset class='sex-fieldset'>
                    <div class="forms-input">
                        <label for="filter-sex">Sex *</label>
                        <select name="Sex" id="filter-sex">
                            <option value="" selected disabled> </option>
                            <option value="F">Female</option>
                            <option value="M">Male</option>
                            <option value="O">Other</option>
                        </select>
                    </div>     
                </fieldset>
                <fieldset class='sex-fieldset'>
                    <div class="forms-input">
                        <label for="filter-bday">Birthday</label>
                        <input  name="Birthday" id="filter-bday" type="date" min="1900-01-01" max="<?php echo date("Y-m-d"); ?>">
                    </div>
                </fieldset>
                <fieldset class='sex-fieldset'>
                    <div class="forms-input">
                        <label for="filter-contact">Contact Number</label>
                        <input type="number" name="ContactNo" id="filter-contact" maxlength="64">
                    </div>
                </fieldset>
            </form>      
        </div>
        <div class='consultation-modal-actions'>
            <button type='submit' class='action filter' form="filter-patient-form">Filter</button>
            <button type='submit' class='action filter-reset' form="filter-patient-form">Reset</button>
        </div>
    </div>
</div>

<!-- SEARCH BAR AND ACTIONS -->
<div class="patient-table-container">
    <div><h2 class='consultation-history'>Patient Information</h2></div>
    <div class="patient-actions">
        <button type="button" class="patient action" id='add-patient-btn'><i class="fa-solid fa-plus"></i> <span>Add new patient</span></button>
        <button type="button" class='patient action' id='filter-patient-btn'><i class="fa-solid fa-filter"></i> <span>Filter</span></button>
    </div>
    <div class="patient-search">
        <input type="text" id="patient-searchbox" placeholder="Search patient name...">
    </div>
</div>

<!-- LIVE SEARCH RESULTS -->
<div id="patient-search-results"></div>

<div id="footer">
    © 2025 TBA Clinic · tbaclinic@univ.edu.ph · (074) 442 1983
</div>

<!-- SCRIPT -->
<script src="./scriptpatient.js"></script>

</body>
</html>
