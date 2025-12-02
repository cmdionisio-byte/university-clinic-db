<?php
 include("database.php");
 ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Information</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
        <link rel="stylesheet" href="./style.css">
        <script src="https://kit.fontawesome.com/ea8c838e77.js" crossorigin="anonymous"></script>
</head>
<body>

<!-- DELETE CONFIRMATION MODAL -->
    <div id="delete-patient-modal" class='modal'>
    <div class='modal-contentP'>
        <div class="close-btn-div">
            <div></div>
            <button class="close-btn-patient"><img class='btn-img' src="./img/close.svg"></button>
        </div>

        <div class='modal-message'>
            Are you sure you want to delete this patient? This action cannot be undone.
        </div>

        <div class='consultation-modal-actions'>
            <button class='action confirm-delete-patient' >Delete Patient</button>
            <button class='action close-btn-patient'>Nevermind</button>
        </div>

    </div>
    </div>

<?php
                if(ISSET($_REQUEST['id'])){
                    $id = $_REQUEST['id'];
                    $query = mysqli_query($conn, "SELECT * FROM PATIENT WHERE PatientID = $id") or die(mysqli_error($conn));
                    $fetch = mysqli_fetch_array($query);
                    $patientID = $fetch['PatientID'];

                    $consultQuery = mysqli_query(
                        $conn,
                        "SELECT * FROM CONSULTATION WHERE PatientID = '$patientID' ORDER BY ConsultDateTime DESC"
                    ) or die(mysqli_error($conn));
?>
<!--EDIT MODAL-->
    <div id="edit-patient-modal" class="modal">
    <div class="modal-contentP">

        <div class="close-btn-div">
            <div>Edit Patient Details</div>
            <button class="close-btn-patient"><img class='btn-img' src="./img/close.svg"></button>
        </div>

        <div class="modal-message">
        
            <form id='edit-patient-form' method='POST'>

           <!--NAME-->
                <fieldset class='p-name-fieldset'>                   
                    <div class="forms-input">
                        <label for="edit-p-firstname">First Name</label>
                        <input type="text" name="PFirstName" id="edit-p-firstname" pattern="^[A-Za-z.]+([ .][A-Za-z.]+)*$" title="Name must contain only letters and periods." maxlength="64" required>
                        <span class='error-message' id='edit-name-error-message'>Yipeee</span>
                    </div>     

                    <div class="forms-input">
                        <label for="edit-p-middleinit">Middle Initial</label>
                        <input type="text" name="PMiddleInit" id="edit-p-middleinit" pattern="^[A-Za-z]+$" maxlength="2" title="Initials must only be letters.">
                        <span class='error-message' id='edit-name-error-message'>Yipeee</span>
                    </div> 

                    <div class="forms-input">
                        <label for="edit-p-lastname">Last Name</label>
                        <input type="text" name="PLastName" id="edit-p-lastname" pattern="^[A-Za-z.]+([ .][A-Za-z.]+)*$" title="Name must contain only letters and periods." maxlength="64" required>
                        <span class='error-message' id='edit-name-error-message'>Yipeee</span>
                    </div> 
                </fieldset>

            <!-- SEX -->
                <fieldset class='sex-fieldset'>
                    <div class="forms-input">
                        <label for="edit-sex">Sex *</label>
                        <select name="Sex" id="edit-sex" required>
                            <option value="" selected disabled> </option>
                            <option value="F">Female</option>
                            <option value="M">Male</option>
                        </select>
                    </div>     
                </fieldset>

            <!--BIRTHDAY-->
                <fieldset class='bday-fieldset'>
                    <div class="forms-input">
                        <label for="edit-bday">Birthday</label>
                        <input  name="Birthday" id="edit-bday" type="date" min="1900-01-01" max="<?php echo date("Y-m-d"); ?>">
                        <span class='error-message' id='edit-bdayerror-message'>Yipeee</span>
                    </div>     
                </fieldset>
                
            <!--CONTACT-->
               <fieldset class='contactno-fieldset'>
                    <div class="forms-input">
                        <label for="edit-contact">Contact Number *</label>
                        <div style="flex">
                        <input type="text" value="+639" readonly id="contactprefix">
                        <input type="tel" id="edit-partcontact" name="PartContactNo" placeholder="123456789" pattern="[0-9]{9}" maxlength="9" title="Input must contain 9 digit numbers." required>
                        </div>
                        <input type="hidden" name="ContactNo" id="edit-contact">
                        <span class='error-message' id='edit-contact-error-message'>Yipeee</span>
                    </div>     
                </fieldset>
            </form>
            </div>

        <div class='consultation-modal-actions'>
            <button class='action save-edits' type='submit' form='edit-patient-form' data-id='<?php echo $patientID; ?>'>Save</button>
        </div>
    </div>
    </div>

<!--CONFIRMED EDIT MODAL-->
 <div id="edit-patient-confirm-modal" class="modal">
    <div class="modal-contentP">
        <div class="close-btn-div">
            <div>Edit Success</div>
            <button class="close-btn-patient"><img class='btn-img' src="./img/close.svg"></button>
        </div>

        <div class="modal-message">
            <h2 class="edit-patient-reminder">Patient Successfully Updated!</h2>
        </div>
    </div>
    </div>


    <div class="header">
        <a id="hyperlink-logo" href="./index.php">
            <div class='header-img' id='logo'>
                <img id='logo-img' src='./img/logo.svg'>
                TBAClinic 
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

<!--PATIENT DETAILS-->
    
    <div class="patient-information-container">
        <div id="patient-information">
            <div class="patient-actions">
                <button type="button" class="action edit-ptnt" data-id='<?php echo $patientID; ?>'><i class="fa-solid fa-pen-to-square"></i> <span>Edit patient information</span></button>
                <button type="button" class="action delete-ptnt" data-id='<?php echo $patientID; ?>'><i class="fa-solid fa-trash"></i> <span>Delete patient</span></button>
            </div>

            <h2 style="text-align: center;">Patient Details</h2>
                <div id="patient-information-table"><table class = "table table-striped">
                    <tr><th>Patient ID</th> <td><?php echo $fetch['PatientID']?></td> </tr>
                    <tr><th>Name</th> <td><?php echo $fetch['PatientFirstName']?> 
                    <?php echo !empty($fetch['PatientMiddleInit']) ? $fetch['PatientMiddleInit'] . ". " : "";?> 
                    <?php echo $fetch['PatientLastName']?></td> </tr>
                    <tr><th>Sex</th> <td><?php echo $fetch['PatientSex']?></td> </tr>
                    <tr><th>Birthday</th> <td><?php echo $fetch['PatientBirthday']?></td> </tr>
                    <tr><th>Contact Number</th> <td><?php echo $fetch['PatientContactNo']?></td> </tr>
                </table>
            </div>
            <?php }?>
        </div>

<!--CONSULTATION HISTORY-->       
        <div id="consult-information">
            <h2 style="text-align: center;">Consultation History</h2>
                <div id="consult-information-table"> 
                    <?php $sql = " SELECT c.ConsultationID, c.ConsultDateTime,c.Diagnosis,c.Prescription,c.Remarks,
                        CONCAT(d.DocFirstName, ' ', IFNULL(CONCAT(d.DocMiddleInit, '. '), ''),d.DocLastName) AS DoctorFullName
                        FROM CONSULTATION c
                        INNER JOIN DOCTOR d ON d.DoctorID = c.DoctorID
                        WHERE c.PatientID = '$patientID'
                        ORDER BY c.ConsultDateTime DESC";
                        $result = $conn->query($sql); 
                        ?>

                <?php if ($result->num_rows === 0): ?>
                    <p class="no-consults-msg">
                        This patient has no consultation history yet.
                    </p>

                <?php else: ?>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th class="col-date">Date</th>
                            <th class="col-time">Time</th>
                            <th class="col-diag">Diagnosis</th>
                            <th class="col-prescr">Prescription</th>
                            <th class="col-remrks">Remarks</th>
                            <th class="col-doc">Doctor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($row = $result->fetch_assoc()) { ?>
                            <tr>
                                <td class="col-date">
                                    <?= date("M j, Y", strtotime($row["ConsultDateTime"])) ?>
                                </td>

                                <td class="col-time">
                                    <?= date("g:i A", strtotime($row["ConsultDateTime"])) ?>
                                </td>

                                <td class="col-diag"><?= $row["Diagnosis"] ?></td>
                                <td class="col-prescr"><?= $row["Prescription"] ?></td>

                                <td class="col-remrks">
                                    <?= $row["Remarks"] ?>
                                </td>

                                <td class="col-doc"><?= $row["DoctorFullName"] ?></td>
                            </tr>
                        <?php } ?>
                    </tbody>
                </table>

                <?php endif; ?>
            </div>
        </div>
    </div>


    <div id="footer">
        © 2025 TBA Clinic · tbaclinic@univ.edu.ph · (074) 442 1983
    </div>


<script src="./scriptpatient.js"></script>
</body>
</html>
