<?php
include 'database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = intval($_POST['id']);
    $first = $_POST['firstname'];
    $last = $_POST['lastname'];
    $middle = $_POST['middleinit'];
    $specialty_ids = isset($_POST['specialtyids']) ? $_POST['specialtyids'] : [];
    $email = $_POST['email'];
    $address = $_POST['address'];
    $contact = $_POST['contact'];
    $sex = $_POST['sex']; // NEW FIELD
    $dob = !empty($_POST['dob']) ? date('Y-m-d', strtotime($_POST['dob'])) : NULL;

    // 1. UPDATE INFO
    $sql = "UPDATE DOCTOR SET 
            DocFirstName='$first', 
            DocLastName='$last', 
            DocMiddleInit='$middle', 
            DocEmail='$email', 
            DocAddress='$address', 
            DocContactNo='$contact', 
            DocSex='$sex', 
            DocDOB='$dob' 
            WHERE DoctorID=$id";

    if ($conn->query($sql) === TRUE) {
        
        // 2. RESET SPECIALTIES
        $conn->query("DELETE FROM DOCTOR_SPECIALTY WHERE DoctorID = $id");

        // 3. INSERT NEW SPECIALTIES
        if (!empty($specialty_ids)) {
            $spec_stmt = $conn->prepare("INSERT INTO DOCTOR_SPECIALTY (DoctorID, SpecialtyID) VALUES (?, ?)");
            foreach ($specialty_ids as $spec_id) {
                $spec_stmt->bind_param("ii", $id, $spec_id);
                $spec_stmt->execute();
            }
            $spec_stmt->close();
        }

        header("Location: staff.php");
        exit();
    } else {
        echo "Error: " . $conn->error;
    }
}
?>
