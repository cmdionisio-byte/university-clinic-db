<?php
include("database.php");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$has_filters = isset($_GET['sex']) || isset($_GET['startBday']) || isset($_GET['endBday']) || isset($_GET['contact']);
if (!isset($_GET['q']) || empty($_GET['q']) && !$has_filters) {
    echo "";
    exit;
}

$searchname = htmlspecialchars($_GET['q']); 
$active_status = "1";

$filter_sex = $_GET['sex'] ?? null;
$filter_start_bday = $_GET['startBday'] ?? null;
$filter_end_bday = $_GET['endBday'] ?? null;
$filter_contact = $_GET['contact'] ?? null;

$sql_where_clauses = ["`PatientIsActive` = ?"];
$filter_input = [$active_status];
$types = "s"; 

if (!empty($searchname)) {
    if (!preg_match("/^[A-Za-z.-]+(?:[ .-][A-Za-z.-]+)*$/", $searchname)) {
        echo "<p class='error-search'>Invalid characters in search.</p>";
        exit;
    }
    
    $search_term = "%".$searchname."%";
    $search_clauses = [
        "`PatientFirstName` LIKE ?", 
        "`PatientLastName` LIKE ?", 
        "CONCAT(PatientFirstName, ' ', PatientLastName) LIKE ?", 
        "CONCAT(PatientFirstName, ' ', PatientMiddleInit, ' ', PatientLastName) LIKE ?", 
        "CONCAT(PatientFirstName, ' ', PatientMiddleInit) LIKE ?", 
        "CONCAT(PatientMiddleInit, ' ', PatientLastName) LIKE ?", 
        "CONCAT(PatientLastName,' ', PatientFirstName) LIKE ?"
    ];
    
    $sql_where_clauses[] = "(" . implode(" OR ", $search_clauses) . ")";
    
    for ($i = 0; $i < 7; $i++) {
        $filter_input[] = $search_term;
        $types .= "s";
    }
}

if ($filter_sex && $filter_sex !== '') {
    $sql_where_clauses[] = "`PatientSex` = ?";
    $filter_input[] = $filter_sex;
    $types .= "s";
}

if ($filter_contact && $filter_contact !== '') {
    $full_contact_search = "%".$filter_contact."%"; 
    $sql_where_clauses[] = "`PatientContactNo` LIKE ?";
    $filter_input[] = $full_contact_search;
    $types .= "s";
}

if ($filter_start_bday && $filter_start_bday !== '') {
    $sql_where_clauses[] = "`PatientBirthday` >= ?";
    $filter_input[] = $filter_start_bday;
    $types .= "s";
}

if ($filter_end_bday && $filter_end_bday !== '') {
    $sql_where_clauses[] = "`PatientBirthday` <= ?";
    $filter_input[] = $filter_end_bday;
    $types .= "s";
}


$sql_where = implode(" AND ", $sql_where_clauses);
$sql = "SELECT * FROM `PATIENT` WHERE " . $sql_where . " ORDER BY `PatientID`";

$stmt = mysqli_prepare($conn, $sql);

$bind_refs = [$stmt, $types]; 

foreach ($filter_input as $key => $value) {
$bind_refs[] = &$filter_input[$key];
}

call_user_func_array('mysqli_stmt_bind_param', $bind_refs);


mysqli_stmt_execute($stmt);
$res = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($res) === 0) {
    echo "<p>No patients found.</p>";
    exit;
}

while ($row = mysqli_fetch_assoc($res)) {
    echo "
        <div>
            <a href='get_patient.php?id={$row['PatientID']}'>
                <h4 class='link-to-other'>"
                    .htmlspecialchars($row['PatientFirstName'])." "
                    .htmlspecialchars($row['PatientMiddleInit'])." "
                    .htmlspecialchars($row['PatientLastName']).
                "</h4>
            </a>
            <hr>
        </div>
    ";
}
?>