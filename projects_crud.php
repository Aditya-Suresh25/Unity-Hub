<?php
// projects_crud.php

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include your database connection
require 'db.php';

// Set header to return JSON responses
header('Content-Type: application/json');

// Determine the request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Get the 'action' parameter to determine the operation
    $action = $_POST['action'] ?? '';

    if ($action == 'create') {
        // CREATE: Insert a new project
        $title = $_POST['title'] ?? '';
        $department_id = $_POST['department_id'] ?? null;
        $location = $_POST['location'] ?? '';
        $start_date = $_POST['start_date'] ?? null;
        $end_date = $_POST['end_date'] ?? null;
        $priority = $_POST['priority'] ?? 'medium';
        $status = $_POST['status'] ?? 'upcoming';
        $progress = $_POST['progress'] ?? 0;
        
        // Validate required fields
        if (empty($title)) {
            echo json_encode(['status' => 'error', 'message' => 'Project title is required']);
            exit;
        }

        try {
            $sql = "INSERT INTO Projects (title, department_id, location, start_date, end_date, priority, status, progress) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            if ($stmt->execute([$title, $department_id, $location, $start_date, $end_date, $priority, $status, $progress])) {
                echo json_encode(['status' => 'success', 'message' => 'Project created successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to create project: ' . implode(' ', $stmt->errorInfo())]);
            }
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
        exit;
    } elseif ($action == 'update') {
        // UPDATE: Update an existing project
        $project_id = $_POST['project_id'] ?? null;
        $title = $_POST['title'] ?? '';
        $department_id = $_POST['department_id'] ?? null;
        $location = $_POST['location'] ?? '';
        $start_date = $_POST['start_date'] ?? null;
        $end_date = $_POST['end_date'] ?? null;
        $priority = $_POST['priority'] ?? 'medium';
        $status = $_POST['status'] ?? 'upcoming';
        $progress = $_POST['progress'] ?? 0;

        if ($project_id) {
            try {
                $sql = "UPDATE Projects SET title = ?, department_id = ?, location = ?, 
                        start_date = ?, end_date = ?, priority = ?, status = ?, progress = ? 
                        WHERE project_id = ?";
                $stmt = $pdo->prepare($sql);
                if ($stmt->execute([$title, $department_id, $location, $start_date, $end_date, $priority, $status, $progress, $project_id])) {
                    echo json_encode(['status' => 'success', 'message' => 'Project updated successfully']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Failed to update project: ' . implode(' ', $stmt->errorInfo())]);
                }
            } catch (PDOException $e) {
                echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Project ID not provided']);
        }
        exit;
    } elseif ($action == 'delete') {
        // DELETE: Remove a project
        $project_id = $_POST['project_id'] ?? null;
        if ($project_id) {
            try {
                $sql = "DELETE FROM Projects WHERE project_id = ?";
                $stmt = $pdo->prepare($sql);
                if ($stmt->execute([$project_id])) {
                    echo json_encode(['status' => 'success', 'message' => 'Project deleted successfully']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Failed to delete project: ' . implode(' ', $stmt->errorInfo())]);
                }
            } catch (PDOException $e) {
                echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Project ID not provided']);
        }
        exit;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        exit;
    }
} elseif ($method === 'GET') {
    // READ: Retrieve project(s)
    try {
        if (isset($_GET['project_id'])) {
            // Retrieve a specific project by ID
            $project_id = $_GET['project_id'];
            $stmt = $pdo->prepare("SELECT * FROM Projects WHERE project_id = ?");
            $stmt->execute([$project_id]);
            $project = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($project) {
                echo json_encode($project);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Project not found']);
            }
        } else {
            // Retrieve all projects
            $stmt = $pdo->query("SELECT * FROM Projects ORDER BY project_id DESC");
            $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($projects); // Return as JSON array
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
?>