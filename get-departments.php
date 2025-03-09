<?php
// Replace with your actual database credentials
$servername = "localhost";
$username = "root";
$password = "12345";
$dbname = "major_project";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $conn->prepare("SELECT department_id, department_name FROM departments");
    $stmt->execute();
    
    echo "<h2>Department IDs</h2>";
    echo "<pre>";
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "ID: " . $row['department_id'] . " - Name: " . $row['department_name'] . "\n";
    }
    echo "</pre>";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
$conn = null;
?>