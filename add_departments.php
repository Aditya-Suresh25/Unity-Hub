<?php
// Your database credentials
$servername = "localhost";
$username = "root";  // Use your actual username
$password = "12345";      // Use your actual password
$dbname = "major_project";

echo "<h1>Add Departments</h1>";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    // Sample departments
    $departments = [
        ['Transport', 'Department responsible for transportation infrastructure and services.'],
        ['Healthcare', 'Department managing healthcare facilities and medical services.'],
        ['Education', 'Department overseeing educational institutions and programs.'],
        ['Infrastructure', 'Department handling public infrastructure development and maintenance.'],
        ['Energy', 'Department managing energy resources and utilities.'],
        ['Agriculture', 'Department overseeing agricultural development and food security.'],
        ['Technology', 'Department focused on technological innovation and digital services.'],
        ['Environment', 'Department responsible for environmental protection and conservation.'],
        ['Social Affairs', 'Department handling social welfare and community services.'],
        ['Urban Development', 'Department managing urban planning and city development.'],
        ['Defense', 'Department overseeing national security and defense forces.'],
        ['Tourism', 'Department promoting tourism and cultural heritage.']
    ];
    
    // Insert departments
    $success = 0;
    $fail = 0;
    
    foreach ($departments as $dept) {
        $stmt = $conn->prepare("INSERT INTO departments (department_name, description) VALUES (?, ?)");
        $stmt->bind_param("ss", $dept[0], $dept[1]);
        
        if ($stmt->execute()) {
            $success++;
        } else {
            $fail++;
            echo "Error adding " . $dept[0] . ": " . $conn->error . "<br>";
        }
    }
    
    echo "<p>Added $success departments successfully. Failed to add $fail departments.</p>";
    
    echo "<p><a href='view_departments.php'>View Departments</a></p>";
    
    $conn->close();
} catch(Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>