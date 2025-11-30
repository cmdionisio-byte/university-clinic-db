<?php
include('database.php');

// Check if a search term is provided
if (isset($_GET['term'])) {
    $searchTerm = $_GET['term'];
    // Add wildcards and escape the term to prevent SQL injection issues
    $searchPattern = "%" . $conn->real_escape_string($searchTerm) . "%";

    // SQL query to find doctors matching the name pattern
    // It checks the first name, last name, or the full name combination
    $sql = "SELECT DocFirstName, DocMiddleInit, DocLastName
            FROM DOCTOR
            WHERE DocFirstName LIKE ?
            OR DocLastName LIKE ?
            OR CONCAT(DocFirstName, ' ', DocLastName) LIKE ?
            OR CONCAT(DocFirstName, ' ', DocMiddleInit, ' ', DocLastName) LIKE ?
            LIMIT 10"; // Limit results for performance

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $searchPattern, $searchPattern, $searchPattern, $searchPattern);
    $stmt->execute();
    $result = $stmt->get_result();

    $doctors = [];
    while ($row = $result->fetch_assoc()) {
        // Construct the full name
        $fullName = $row['DocFirstName'] . ' ';
        if (!empty($row['DocMiddleInit'])) {
            $fullName .= $row['DocMiddleInit'] . '. ';
        }
        $fullName .= $row['DocLastName'];
        
        // Add the full name to the results array
        $doctors[] = trim($fullName);
    }

    // Return the array of names as a JSON response
    header('Content-Type: application/json');
    echo json_encode($doctors);

    $stmt->close();
}

$conn->close();
?>