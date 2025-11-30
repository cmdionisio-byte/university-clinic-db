<?php
include 'database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $first = trim($_POST['firstname']);
    $last = trim($_POST['lastname']);
    $middle = trim($_POST['middleinit']);
    $specialty_ids = isset($_POST['specialtyids']) ? $_POST['specialtyids'] : []; 
    $email = trim($_POST['email']);
    $address = trim($_POST['address']);
    $contact = trim($_POST['contact']);
    $sex = $_POST['sex']; // NEW FIELD
    $dob = !empty($_POST['dob']) ? date('Y-m-d', strtotime($_POST['dob'])) : NULL;

    // 1. DUPLICATE CHECK
    $check_sql = "SELECT DoctorID, IsActive FROM DOCTOR WHERE (DocFirstName = ? AND DocLastName = ?) OR (DocEmail = ? AND DocEmail != '')";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("sss", $first, $last, $email);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        echo "<script>alert('Error: Doctor already exists!'); window.location.href = 'staff.php';</script>";
        exit();
    }
    $check_stmt->close();

    // 2. INSERT DOCTOR
    $sql = "INSERT INTO DOCTOR (DocFirstName, DocLastName, DocMiddleInit, DocEmail, DocAddress, DocContactNo, DocSex, DocDOB, IsActive) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)";

    $stmt = $conn->prepare($sql);
    // Added 's' for sex string
    $stmt->bind_param("ssssssss", $first, $last, $middle, $email, $address, $contact, $sex, $dob);

    if ($stmt->execute()) {
        $new_doc_id = $conn->insert_id;

        // 3. INSERT SPECIALTIES
        if (!empty($specialty_ids)) {
            $spec_stmt = $conn->prepare("INSERT INTO DOCTOR_SPECIALTY (DoctorID, SpecialtyID) VALUES (?, ?)");
            foreach ($specialty_ids as $spec_id) {
                $spec_stmt->bind_param("ii", $new_doc_id, $spec_id);
                $spec_stmt->execute();
            }
            $spec_stmt->close();
        }

        header("Location: staff.php");
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }
    $stmt->close();
}
$conn->close();
?>