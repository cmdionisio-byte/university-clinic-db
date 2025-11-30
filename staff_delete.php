<?php
include 'database.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    // Delete from DOCTOR table
    $sql = "DELETE FROM DOCTOR WHERE DoctorID = $id";

    if ($conn->query($sql) === TRUE) {
        header("Location: staff.php"); 
        exit();
    } else {
        echo "Error: " . $conn->error;
    }
}
?>