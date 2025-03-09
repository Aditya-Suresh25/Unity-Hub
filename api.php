<?php
// api.php
require 'db.php';  // This file should establish your PDO connection

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'registerUser') {
  // Retrieve and sanitize input data
  $name = $_POST['name'] ?? '';
  $email = $_POST['email'] ?? '';
  $password = $_POST['password'] ?? '';

  // Hash the password
  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

  // Example query to insert a new user
  $stmt = $pdo->prepare("INSERT INTO Users (first_name, email, password) VALUES (?, ?, ?)");
  if ($stmt->execute([$name, $email, $hashedPassword])) {
      echo json_encode(['status' => 'success', 'message' => 'User registered successfully']);
  } else {
      echo json_encode(['status' => 'error', 'message' => 'Registration failed.']);
  }
  exit;
}
?>
