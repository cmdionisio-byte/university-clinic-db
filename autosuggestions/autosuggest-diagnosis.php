<?php 
    include('../database.php');
    $diagnosis = $_GET['diagnosis'];
    $sql = "SELECT DISTINCT Diagnosis
FROM CONSULTATION
WHERE Diagnosis LIKE '%$diagnosis%'
    	ORDER BY Diagnosis ASC
LIMIT 3;";
    $result = $conn->query($sql);

    if (!$result) {
        echo "not found";
    }

    $diagnosis = [];
    while ($row = $result->fetch_assoc()) {
        $diagnosis[] = $row['Diagnosis'];
    }
    header('Content-Type: application/json');
    echo json_encode($diagnosis);

?>