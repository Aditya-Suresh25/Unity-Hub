<?php
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "root"; // Use your actual username
$password = "12345"; // Use your actual password
$dbname = "major_project";

try {
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Fetch projects with department names using JOIN
    $sql = "SELECT p.*, d.department_name 
            FROM projects p 
            JOIN departments d ON p.department_id = d.department_id 
            ORDER BY p.start_date DESC";
    
    $result = $conn->query($sql);
    
    $projects = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $projects[] = $row;
        }
    }
    
    echo json_encode($projects);


    
    
} catch(Exception $e) {
    echo json_encode(array("error" => $e->getMessage()));
}

$conn->close();
?>