
<?php
include("database.php");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


if (!isset($_GET['q'])) { 
    $searchname = "";
} else {
    $searchname = htmlspecialchars($_GET['q']);
}

if (!empty($searchname) && !preg_match("/^[A-Za-z.-]+(?:[ .-][A-Za-z.-]+)*$/", $searchname)) {
    echo "<p class='error-search'>Invalid characters in search.</p>";
    exit;
}

$search_term = "%".$searchname."%";
$active_status = "1";

$filter_sex = $_GET['sex'] ?? null;
$filter_start_bday = $_GET['startBday'] ?? null;
$filter_end_bday = $_GET['endBday'] ?? null;
$filter_contact = $_GET['contact'] ?? null;

$sql_where = " (`PatientFirstName` LIKE ? 
                OR `PatientLastName` LIKE ? 
                OR CONCAT(PatientFirstName, ' ', PatientLastName) LIKE ? 
                OR CONCAT(PatientFirstName, ' ', PatientMiddleInit, ' ', PatientLastName) LIKE ? 
                OR CONCAT(PatientFirstName, ' ', PatientMiddleInit) LIKE ? 
                OR CONCAT(PatientMiddleInit, ' ', PatientLastName) LIKE ? 
                OR CONCAT(PatientLastName,' ', PatientFirstName) LIKE ?
              )
              AND `PatientIsActive` = ?";
$filter_input = [$search_term, $search_term, $search_term, $search_term, $search_term, $search_term, $search_term, $active_status];
$types = "ssssssss"; 

if ($filter_sex && $filter_sex !== '') {
    $sql_where .= " AND `PatientSex` = ?";
    $filter_input[] = $filter_sex;
    $types .= "s";
}


if ($filter_contact && $filter_contact !== '') {
    $full_contact_search = "%".$filter_contact."%"; 
    $sql_where .= " AND `PatientContactNo` LIKE ?";
    $filter_input[] = $full_contact_search;
    $types .= "s";
}

if ($filter_start_bday && $filter_start_bday !== '') {
    $sql_where .= " AND `PatientBirthday` >= ?";
    $filter_input[] = $filter_start_bday;
    $types .= "s";
}

if ($filter_end_bday && $filter_end_bday !== '') {
    $sql_where .= " AND `PatientBirthday` <= ?";
    $filter_input[] = $filter_end_bday;
    $types .= "s";
}

$sql = "SELECT * FROM `PATIENT` WHERE " . $sql_where . " ORDER BY `PatientID`";


$stmt = mysqli_prepare($conn, $sql);

$bind_args = [$stmt, $types];


foreach ($filter_input as $key => $value) {
    $bind_args[] = &$filter_input[$key];
}

call_user_func_array('mysqli_stmt_bind_param', array_merge([$stmt, $types], $filter_input));

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