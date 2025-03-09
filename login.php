<?php
session_start();
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve and sanitize form data
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    // Prepare SQL statement to find user by email
    $stmt = $pdo->prepare("SELECT * FROM Users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        // Verify the password
        if (password_verify($password, $user['password'])) {
            // Password is correct: create session
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_name'] = $user['first_name']; // Adjust according to your table

            // You can redirect or send a JSON response
            echo json_encode(['status' => 'success', 'message' => 'Login successful']);
            exit;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
            exit;
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
        exit;
    }
}
