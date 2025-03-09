<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<style>
    table {
    border-collapse: collapse;
    width: 100%;
}

th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f0f0f0;
}

</style>


<?php
// Include your database connection file
require 'db.php';

try {
    // Fetch all users from the Users table
    $stmt = $pdo->query("SELECT * FROM Users");
    $users = $stmt->fetchAll();

    if ($users) {
        echo "<h2>Registered Users</h2>";
        echo "<table border='1'>";
        echo "<tr><th>Name</th>
        <th>Email</th></tr>";

        foreach ($users as $user) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($user['first_name']) . "</td>";
            echo "<td>" . htmlspecialchars($user['email']) . "</td>";
            echo "</tr>";
        }

        echo "</table>";
    } else {
        echo "No users found.";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
</body>
</html>




