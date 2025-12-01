<?php 
    include('../database.php');
    $query = $_GET['prescription'];
    $sql = "SELECT DISTINCT Prescription
FROM CONSULTATION
WHERE Prescription LIKE '%$query%'
    	ORDER BY Prescription ASC
LIMIT 3;";
    $result = $conn->query($sql);

    if (!$result) {
        echo "not found";
    }

    $prescription = [];
    while ($row = $result->fetch_assoc()) {
        $prescription[] = $row['Prescription'];
    }
    header('Content-Type: application/json');
    echo json_encode($prescription);

?>