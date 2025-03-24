// Wait for the DOM to load before running scripts
document.addEventListener('DOMContentLoaded', function () {
  // Initialize the project form submission handler
  const addProjectForm = document.getElementById('add-project-form');
  addProjectForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(addProjectForm);

    // Send POST request to projects_crud.php
    fetch('projects_crud.php', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert(data.message);
          addProjectForm.reset();
          closeAddProjectModal();
          loadProjects(); // Reload projects after successful submission
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the project.');
      });
  });

  // Open the add project modal when the button is clicked
  const addProjectBtn = document.getElementById('add-project-btn');
  addProjectBtn.addEventListener('click', openAddProjectModal);

  // Attach event listeners to any elements with the "close-modal" class inside the modal
  const closeModalElements = document.querySelectorAll('.modal .close-modal');
  closeModalElements.forEach(el => {
    el.addEventListener('click', closeAddProjectModal);
  });

  // Filter tab functionality
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      // Remove active class from all tabs
      filterTabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      this.classList.add('active');

      // Get the status filter
      const statusFilter = this.getAttribute('data-status');

      // Apply filtering
      filterProjects();
    });
  });

  // Search input event listener
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', filterProjects);
  }

  // Department filter change listener
  const departmentFilter = document.getElementById('department-filter');
  if (departmentFilter) {
    departmentFilter.addEventListener('change', filterProjects);
  }

  // Load projects on page load
  loadProjects();
});

// Function to open the add project modal
function openAddProjectModal() {
  document.getElementById('add-project-modal').style.display = 'block';
}

// Function to close the add project modal
function closeAddProjectModal() {
  document.getElementById('add-project-modal').style.display = 'none';
}

// Function to filter projects based on selected filters
function filterProjects() {
  const searchText = document.getElementById('search-input').value.toLowerCase();
  const departmentFilter = document.getElementById('department-filter').value;
  const statusFilter = document.querySelector('.filter-tab.active').getAttribute('data-status');

  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    const title = card.querySelector('.project-title').textContent.toLowerCase();
    const description = card.querySelector('.project-description')?.textContent.toLowerCase() || '';
    const status = card.getAttribute('data-status') || '';
    const department = card.getAttribute('data-department') || '';

    // Check if card matches all filters
    const matchesSearch = title.includes(searchText) || description.includes(searchText);
    const matchesDepartment = departmentFilter === 'all' || department.toLowerCase() === departmentFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || status.toLowerCase() === statusFilter.toLowerCase();

    // Show or hide based on filters
    if (matchesSearch && matchesDepartment && matchesStatus) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Function to load projects from the database and display them
function loadProjects() {
  fetch('projects_crud.php')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(projects => {
      const projectsGrid = document.getElementById('projects-grid');
      projectsGrid.innerHTML = ''; // Clear any existing content

      // Check if projects is an array
      if (!Array.isArray(projects)) {
        console.error('Expected an array of projects, got:', projects);
        projectsGrid.innerHTML = '<p>Error loading projects. Please try again later.</p>';
        return;
      }

      if (projects.length === 0) {
        projectsGrid.innerHTML = '<p>No projects found. Add a new project to get started!</p>';
        return;
      }

      projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-status', project.status || '');
        card.setAttribute('data-department', project.department_id || '');

        // Format the date values (assuming they come in YYYY-MM-DD format)
        const startDate = project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A';
        const endDate = project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A';

        // Create a background color based on priority
        let priorityClass = '';
        switch (project.priority) {
          case 'high':
            priorityClass = 'priority-high';
            break;
          case 'medium':
            priorityClass = 'priority-medium';
            break;
          case 'low':
            priorityClass = 'priority-low';
            break;
        }

        // Create status badge class
        let statusClass = '';
        switch (project.status) {
          case 'completed':
            statusClass = 'status-completed';
            break;
          case 'ongoing':
            statusClass = 'status-ongoing';
            break;
          case 'upcoming':
            statusClass = 'status-upcoming';
            break;
        }

        card.innerHTML = `
          <div class="card-header ${priorityClass}">
            <h3 class="project-title">${project.title || 'Untitled Project'}</h3>
            <span class="status-badge ${statusClass}">${project.status || 'Unknown'}</span>
          </div>
          <div class="card-body">
            <p class="project-description">${project.description || 'No description available.'}</p>
            <div class="project-details">
              <div class="detail-item">
                <span class="detail-label">Priority:</span>
                <span class="detail-value">${project.priority || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${project.location || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Department:</span>
                <span class="detail-value">${project.department_id || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Dates:</span>
                <span class="detail-value">${startDate} - ${endDate}</span>
              </div>
            </div>
            <div class="progress-container">
              <div class="progress-label">Progress: ${project.progress || 0}%</div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${project.progress || 0}%"></div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button onclick="editProject(${project.project_id})" class="btn btn-secondary">Edit</button>
            <button onclick="deleteProject(${project.project_id})" class="btn btn-danger">Delete</button>
          </div>
        `;
        projectsGrid.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error loading projects:', error);
      const projectsGrid = document.getElementById('projects-grid');
      projectsGrid.innerHTML = '<p>Error loading projects. Please check your server connection.</p>';
    });
}

// Function to delete a project
function deleteProject(projectId) {
  if (confirm('Are you sure you want to delete this project?')) {
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('project_id', projectId);

    fetch('projects_crud.php', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert(data.message);
          loadProjects();
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error deleting project:', error);
        alert('An error occurred while deleting the project.');
      });
  }
}

// Function to edit project (placeholder for future implementation)
function editProject(projectId) {
  alert('Edit functionality will be implemented in the next phase.');
  // This will be implemented in future
}

let subMenu = document.getElementById('subMenu');
function toggleMenu() {
  subMenu.classList.toggle('open-menu');
}

const navLinkE1s = document.querySelectorAll('.navlink');
const windowPathname = window.location.pathname;
navLinkE1s.forEach(navLinkE1 => {
  if (navLinkE1.href.includes(windowPathname)) {
    navLinkE1.classList.add('active');
  }
});
