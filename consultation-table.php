<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('database.php');

$query = isset($_GET['query']) ? $_GET['query'] : '';
$orderBy = $_GET['orderBy'];
$orderDir = $_GET['orderDir'];
$startDate = isset($_GET['startDate']) ? $_GET['startDate'] : '';
$endDate = isset($_GET['endDate']) ? $_GET['endDate'] : '';
$diagnosis = isset($_GET['diagnosis']) ? $_GET['diagnosis'] : '';
$prescription = isset($_GET['prescription']) ? $_GET['prescription'] : '';
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;


$tableData = '';
$sql = "SELECT CONSULTATION.ConsultationID, CONSULTATION.ConsultDateTime, PATIENT.PatientID,
    CONCAT(
        PATIENT.PatientFirstName, ' ',
        IFNULL(CONCAT(PATIENT.PatientMiddleInit, '. '), ''),
        PATIENT.PatientLastName
    ) AS PatientFullName,
    CONCAT(
        DOCTOR.DocFirstName, ' ',
        IFNULL(CONCAT(DOCTOR.DocMiddleInit, '. '), ''),
        DOCTOR.DocLastName
    ) AS DoctorFullName,
    CONSULTATION.Diagnosis, CONSULTATION.Prescription
    FROM PATIENT
    INNER JOIN CONSULTATION ON PATIENT.PatientID = CONSULTATION.PatientID
    INNER JOIN DOCTOR ON DOCTOR.DoctorID = CONSULTATION.DoctorID
    WHERE 1=1"; 

if ($query) {
    $sql .= " AND (CONCAT(
        PATIENT.PatientFirstName, ' ',
        IFNULL(CONCAT(PATIENT.PatientMiddleInit, '. '), ''),
        PATIENT.PatientLastName
    ) LIKE '%$query%' OR CONCAT(
        DOCTOR.DocFirstName, ' ',
        IFNULL(CONCAT(DOCTOR.DocMiddleInit, '. '), ''),
        DOCTOR.DocLastName
    ) LIKE '%$query%')";
}


if ($startDate && $endDate) {
    $sql .= " AND DATE(ConsultDateTime) BETWEEN '$startDate' AND '$endDate'";
}
else if ($startDate) {
    $sql .= " AND DATE(ConsultDateTime) >= '$startDate'";
}
else if ($endDate) {
    $sql .= " AND DATE(ConsultDateTime) <= '$endDate'";
}

if ($diagnosis) {
    $sql .= " AND CONSULTATION.Diagnosis LIKE '%$diagnosis%'";
}
if ($prescription) {
    $sql .= " AND CONSULTATION.Prescription LIKE '%$prescription%'";
}

if ($orderBy && $orderDir) {
    $sql .= " ORDER BY $orderBy $orderDir";
}
$result = $conn->query($sql);
$totalRows = $result->num_rows;

$offset = ($page-1) * 10;
$sql .= " LIMIT 10 OFFSET $offset";

$totalPages = ceil($totalRows / 10);

$result = $conn->query($sql);

while ($row = $result->fetch_assoc()) {
    $tableData .= "<tr>
                <td data-label='Date'>" . date("M j, Y", strtotime($row["ConsultDateTime"])) . "</td>
                <td data-label='Time'>" . date("g:i A", strtotime($row["ConsultDateTime"])) . "</td>
                <td data-label='Patient'> <a class='consultation-table-patients' href='./get_patient.php?id=" . $row["PatientID"] . "'>" . $row["PatientFullName"] . "</a></td>
                <td data-label='Diagnosis'>" . $row["Diagnosis"] . "</td>
                <td data-label='Doctor'>" . $row["DoctorFullName"] . "</td>
                <td style='width:1%; white-space:nowrap;'>
                    <button class='action view' onclick=viewConsultation(" . $row["ConsultationID"] . ")><img src='./img/view.svg' class='action-icon'></button>
                    <button class='action edit'  onclick=editConsultation(" . $row["ConsultationID"] . ") data-id='" . $row["ConsultationID"]  . "'><img src='./img/edit.svg' class='action-icon'></button>
                    <button class='action delete' onclick='deleteConsultation(" . $row["ConsultationID"]  .")' data-id='" . $row["ConsultationID"]  . "'><img src='./img/delete.svg' class='action-icon'></button>
                </td>
            </tr>";
}

echo json_encode([
    "tableData" => $tableData,
    "page" => $page,
    "totalPages" => $totalPages,
    "totalRows" => $totalRows
]);

?>