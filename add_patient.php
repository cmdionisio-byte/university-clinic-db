<?php 
    include("database.php");
    
    if(isset($_POST["PFirstName"], $_POST["PLastName"], $_POST["Sex"], $_POST["Birthday"], $_POST["ContactNo"])) {
        $firstname = $_POST["PFirstName"];
        $lastname = $_POST["PLastName"];
        $middleinit = $_POST["PMiddleInit"] ?? ''; 
        $sex = $_POST["Sex"];
        $birthday = $_POST["Birthday"];
        $contactno = $_POST["ContactNo"];

        $dupe_check = "SELECT PatientID FROM PATIENT 
                      WHERE PatientFirstName = ? 
                      AND PatientLastName = ?
                      AND PatientMiddleInit = ?
                      AND PatientSex = ?  
                      AND PatientBirthday = ? 
                      AND PatientContactNo = ? 
                      LIMIT 1";
                    
        $check_stmt = mysqli_prepare($conn, $dupe_check);

        mysqli_stmt_bind_param($check_stmt, "ssssss", $firstname, $lastname, $middleinit, $sex, $birthday, $contactno);
        mysqli_stmt_execute($check_stmt);
        mysqli_stmt_store_result($check_stmt);

        if (mysqli_stmt_num_rows($check_stmt) > 0) {
            mysqli_stmt_close($check_stmt);
            mysqli_close($conn); 
            exit; 
        }
        
        mysqli_stmt_close($check_stmt);

        $sql = "INSERT INTO PATIENT (PatientFirstName, PatientLastName, PatientMiddleInit, PatientSex, PatientBirthday, PatientContactNo) VALUES(?, ?, ?, ?, ?, ?)";
        
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ssssss", $firstname, $lastname, $middleinit, $sex, $birthday, $contactno);

        if (mysqli_stmt_execute($stmt)) {
            echo "New record created successfully";
        } else {
            echo "Error: " . mysqli_error($conn);
        }
        mysqli_stmt_close($stmt);

    } else {
        echo "Error: Required fields are missing.";
    }

    mysqli_close($conn);  
?>