<?php 
include ('database.php');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $sql = "UPDATE PATIENT SET PatientIsActive = 0 WHERE PatientID = $id;";
    
    if ($conn->query($sql) === TRUE) {
        echo "success";
    } else {
        echo "error";
    }
}
?>

