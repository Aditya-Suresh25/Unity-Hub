<?php
// Your database credentials
$servername = "localhost";
$username = "root";  // Use your actual username
$password = "12345";      // Use your actual password
$dbname = "major_project";

echo "<h1>Department IDs and Names</h1>";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $result = $conn->query("SELECT department_id, department_name FROM departments");
    
    echo "<table border='1' cellpadding='5'>";
    echo "<tr><th>Department ID</th><th>Department Name</th></tr>";
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row['department_id'] . "</td>";
            echo "<td>" . $row['department_name'] . "</td>";
            echo "</tr>";
        }
    } else {
        echo "<tr><td colspan='2'>No departments found</td></tr>";
    }
    
    echo "</table>";
    
    echo "<h2>HTML Option Tags for Your Form</h2>";
    echo "<pre>";
    
    $result = $conn->query("SELECT department_id, department_name FROM departments");
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            echo "&lt;option value=\"" . $row['department_id'] . "\"&gt;" . $row['department_name'] . "&lt;/option&gt;\n";
        }
    }
    
    echo "</pre>";
    
    $conn->close();
} catch(Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>