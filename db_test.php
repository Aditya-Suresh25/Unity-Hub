<?php
// Replace with your actual database credentials
$servername = "localhost";
$username = "root";
$password = "12345";
$dbname = "major_project";

echo "<h1>Database Test</h1>";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    echo "Connected successfully<br>";
    
    $result = $conn->query("SHOW TABLES");
    
    echo "<h2>Tables in database:</h2>";
    while($row = $result->fetch_array()) {
        echo $row[0] . "<br>";
    }
    
    echo "<h2>Department Table Structure:</h2>";
    $result = $conn->query("DESCRIBE departments");
    if($result) {
        while($row = $result->fetch_assoc()) {
            echo $row['Field'] . " - " . $row['Type'] . "<br>";
        }
    } else {
        echo "Cannot find departments table";
    }
    
    $conn->close();
} catch(Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>