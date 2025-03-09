<<<<<<< HEAD
// Wait for the DOM to load before running scripts
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the project form submission handler
  const addProjectForm = document.getElementById('add-project-form');
  addProjectForm.addEventListener('submit', function(e) {
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
      if(data.status === 'success') {
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
    tab.addEventListener('click', function() {
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
        switch(project.priority) {
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
        switch(project.status) {
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
  if(confirm('Are you sure you want to delete this project?')) {
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('project_id', projectId);

    fetch('projects_crud.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if(data.status === 'success') {
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
=======

// Expanded projects data with location field added
const projects = [
{
  id: 1,
  title: "Metro Line Extension",
  department: "Transport",
  location: "Delhi",
  startDate: "2025-03-15",
  endDate: "2027-06-30",
  priority: "high",
  progress: 0,
  status: "upcoming"
},
{
  id: 2,
  title: "City Hospital Renovation",
  department: "Healthcare",
  location: "Mumbai",
  startDate: "2024-10-05",
  endDate: "2025-08-20",
  priority: "medium",
  progress: 35,
  status: "ongoing"
},
{
  id: 3,
  title: "Public School Technology Update",
  department: "Education",
  location: "Bangalore",
  startDate: "2024-09-01",
  endDate: "2025-05-15",
  priority: "medium",
  progress: 68,
  status: "ongoing"
},
{
  id: 4,
  title: "Highway Bridge Repair",
  department: "Infrastructure",
  location: "Chennai",
  startDate: "2024-06-10",
  endDate: "2025-01-15",
  priority: "high",
  progress: 100,
  status: "completed"
},
{
  id: 5,
  title: "Solar Power Plant",
  department: "Energy",
  location: "Jodhpur",
  startDate: "2024-11-20",
  endDate: "2026-07-30",
  priority: "high",
  progress: 15,
  status: "ongoing"
},
{
  id: 6,
  title: "Community Library Construction",
  department: "Education",
  location: "Hyderabad",
  startDate: "2025-04-01",
  endDate: "2026-02-28",
  priority: "low",
  progress: 0,
  status: "upcoming"
},
{
  id: 7,
  title: "Water Treatment Facility Upgrade",
  department: "Infrastructure",
  location: "Pune",
  startDate: "2024-08-15",
  endDate: "2025-03-10",
  priority: "medium",
  progress: 78,
  status: "ongoing"
},
{
  id: 8,
  title: "Public Transit App Development",
  department: "Transport",
  location: "Kolkata",
  startDate: "2024-07-01",
  endDate: "2024-12-15",
  priority: "low",
  progress: 100,
  status: "completed"
},
{
  id: 9,
  title: "Emergency Response Center",
  department: "Healthcare",
  location: "Ahmedabad",
  startDate: "2025-02-01",
  endDate: "2026-05-30",
  priority: "high",
  progress: 0,
  status: "upcoming"
},
{
  id: 10,
  title: "Wind Farm Construction",
  department: "Energy",
  location: "Coimbatore",
  startDate: "2024-05-10",
  endDate: "2025-01-20",
  priority: "medium",
  progress: 92,
  status: "ongoing"
},
{
  id: 11,
  title: "City Park Renovation",
  department: "Infrastructure",
  location: "Jaipur",
  startDate: "2024-04-15",
  endDate: "2024-11-30",
  priority: "low",
  progress: 100,
  status: "completed"
},
{
  id: 12,
  title: "Telemedicine System Implementation",
  department: "Healthcare",
  location: "Lucknow",
  startDate: "2024-06-01",
  endDate: "2024-12-15",
  priority: "medium",
  progress: 100,
  status: "completed"
},
{
  id: 13,
  title: "Rural Irrigation System",
  department: "Agriculture",
  location: "Nagpur",
  startDate: "2024-09-10",
  endDate: "2025-11-20",
  priority: "high",
  progress: 22,
  status: "ongoing"
},
{
  id: 14,
  title: "Organic Farming Initiative",
  department: "Agriculture",
  location: "Nashik",
  startDate: "2024-07-15",
  endDate: "2025-01-30",
  priority: "medium",
  progress: 65,
  status: "ongoing"
},
{
  id: 15,
  title: "Agricultural Research Center",
  department: "Agriculture",
  location: "Indore",
  startDate: "2025-04-10",
  endDate: "2026-08-15",
  priority: "high",
  progress: 0,
  status: "upcoming"
},
{
  id: 16,
  title: "Digital ID System Implementation",
  department: "Technology",
  location: "Gurgaon",
  startDate: "2024-08-01",
  endDate: "2025-05-30",
  priority: "high",
  progress: 45,
  status: "ongoing"
},
{
  id: 17,
  title: "Government Cloud Migration",
  department: "Technology",
  location: "Noida",
  startDate: "2024-05-15",
  endDate: "2024-12-20",
  priority: "medium",
  progress: 88,
  status: "ongoing"
},
{
  id: 18,
  title: "Public Wi-Fi Expansion",
  department: "Technology",
  location: "Visakhapatnam",
  startDate: "2024-03-01",
  endDate: "2024-10-15",
  priority: "low",
  progress: 100,
  status: "completed"
},
{
  id: 19,
  title: "Urban Forest Initiative",
  department: "Environment",
  location: "Chandigarh",
  startDate: "2024-06-15",
  endDate: "2025-08-30",
  priority: "medium",
  progress: 40,
  status: "ongoing"
},
{
  id: 20,
  title: "Waste Management System Upgrade",
  department: "Environment",
  location: "Surat",
  startDate: "2024-09-01",
  endDate: "2025-06-30",
  priority: "high",
  progress: 25,
  status: "ongoing"
},
{
  id: 21,
  title: "Coastal Protection Program",
  department: "Environment",
  location: "Kochi",
  startDate: "2025-01-15",
  endDate: "2026-04-30",
  priority: "high",
  progress: 0,
  status: "upcoming"
},
{
  id: 22,
  title: "Community Health Program",
  department: "Social Affairs",
  location: "Patna",
  startDate: "2024-07-01",
  endDate: "2025-03-31",
  priority: "medium",
  progress: 55,
  status: "ongoing"
},
{
  id: 23,
  title: "Youth Employment Initiative",
  department: "Social Affairs",
  location: "Bhopal",
  startDate: "2024-04-15",
  endDate: "2024-12-15",
  priority: "high",
  progress: 85,
  status: "ongoing"
},
{
  id: 24,
  title: "Elder Care Support System",
  department: "Social Affairs",
  location: "Thane",
  startDate: "2024-02-01",
  endDate: "2024-11-30",
  priority: "medium",
  progress: 100,
  status: "completed"
},
{
  id: 25,
  title: "Affordable Housing Project",
  department: "Urban Development",
  location: "Faridabad",
  startDate: "2024-08-15",
  endDate: "2026-03-30",
  priority: "high",
  progress: 30,
  status: "ongoing"
},
{
  id: 26,
  title: "City Center Revitalization",
  department: "Urban Development",
  location: "Vadodara",
  startDate: "2024-05-01",
  endDate: "2025-09-30",
  priority: "medium",
  progress: 60,
  status: "ongoing"
},
{
  id: 27,
  title: "Public Square Renovation",
  department: "Urban Development",
  location: "Ghaziabad",
  startDate: "2024-03-15",
  endDate: "2024-11-15",
  priority: "low",
  progress: 100,
  status: "completed"
},
{
  id: 28,
  title: "Cybersecurity Enhancement",
  department: "Defense",
  location: "Bengaluru",
  startDate: "2024-09-01",
  endDate: "2025-08-31",
  priority: "high",
  progress: 20,
  status: "ongoing"
},
{
  id: 29,
  title: "Emergency Response System",
  department: "Defense",
  location: "Agra",
  startDate: "2025-01-15",
  endDate: "2026-01-15",
  priority: "high",
  progress: 0,
  status: "upcoming"
},
{
  id: 30,
  title: "Border Security Upgrade",
  department: "Defense",
  location: "Amritsar",
  startDate: "2024-06-01",
  endDate: "2025-05-31",
  priority: "high",
  progress: 50,
  status: "ongoing"
},
{
  id: 31,
  title: "Historic District Restoration",
  department: "Tourism",
  location: "Varanasi",
  startDate: "2024-07-15",
  endDate: "2025-12-31",
  priority: "medium",
  progress: 35,
  status: "ongoing"
},
{
  id: 32,
  title: "Tourist Information System",
  department: "Tourism",
  location: "Goa",
  startDate: "2024-05-01",
  endDate: "2024-11-30",
  priority: "low",
  progress: 90,
  status: "ongoing"
},
{
  id: 33,
  title: "National Park Visitor Center",
  department: "Tourism",
  location: "Shimla",
  startDate: "2025-03-01",
  endDate: "2026-06-30",
  priority: "medium",
  progress: 0,
  status: "upcoming"
},
{
  id: 34,
  title: "High-Speed Rail Planning",
  department: "Transport",
  location: "Mumbai",
  startDate: "2025-06-01",
  endDate: "2027-12-31",
  priority: "high",
  progress: 0,
  status: "upcoming"
},
{
  id: 35,
  title: "Bike Lane Network Expansion",
  department: "Transport",
  location: "Pune",
  startDate: "2024-08-15",
  endDate: "2025-07-31",
  priority: "medium",
  progress: 28,
  status: "ongoing"
},
{
  id: 36,
  title: "Mental Health Facility",
  department: "Healthcare",
  location: "Kochi",
  startDate: "2024-11-01",
  endDate: "2026-04-30",
  priority: "high",
  progress: 5,
  status: "ongoing"
},
{
  id: 37,
  title: "Medical Research Grant Program",
  department: "Healthcare",
  location: "Chennai",
  startDate: "2024-05-15",
  endDate: "2024-11-15",
  priority: "medium",
  progress: 100,
  status: "completed"
},
{
  id: 38,
  title: "STEM Education Initiative",
  department: "Education",
  location: "Hyderabad",
  startDate: "2024-08-01",
  endDate: "2025-07-31",
  priority: "high",
  progress: 32,
  status: "ongoing"
},
{
  id: 39,
  title: "Teacher Training Program",
  department: "Education",
  location: "Bhubaneswar",
  startDate: "2024-06-15",
  endDate: "2024-12-15",
  priority: "medium",
  progress: 75,
  status: "ongoing"
},
{
  id: 40,
  title: "Flood Control System",
  department: "Infrastructure",
  location: "Guwahati",
  startDate: "2024-10-01",
  endDate: "2026-03-31",
  priority: "high",
  progress: 15,
  status: "ongoing"
},
{
  id: 41,
  title: "Public Housing Renovation",
  department: "Infrastructure",
  location: "Kanpur",
  startDate: "2025-02-15",
  endDate: "2026-08-31",
  priority: "medium",
  progress: 0,
  status: "upcoming"
},
{
  id: 42,
  title: "Geothermal Energy Project",
  department: "Energy",
  location: "Ladakh",
  startDate: "2025-01-15",
  endDate: "2026-12-31",
  priority: "high",
  progress: 0,
  status: "upcoming"
},
{
  id: 43,
  title: "Energy Efficiency Program",
  department: "Energy",
  location: "Mysore",
  startDate: "2024-05-01",
  endDate: "2025-04-30",
  priority: "medium",
  progress: 60,
  status: "ongoing"
}
];

// Function to format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to generate priority badge
function getPriorityBadge(priority) {
  const colors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444"
  };
  
  return `<span class="priority-badge" style="background-color: ${colors[priority]}">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>`;
}

// Function to render projects with pagination
function renderProjects(filteredProjects, page = 1) {
  const projectsGrid = document.getElementById('projects-grid');
  projectsGrid.innerHTML = '';
  
  if (filteredProjects.length === 0) {
    projectsGrid.innerHTML = '<div class="no-projects">No projects found matching your criteria.</div>';
    renderPagination(1, 1);
    return;
  }
  
  // Pagination
  const projectsPerPage = 12;
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (page - 1) * projectsPerPage;
  const endIndex = Math.min(startIndex + projectsPerPage, filteredProjects.length);
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
  
  // Render projects
  paginatedProjects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    card.innerHTML = `
      <div class="project-header">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-department">${project.department} Department</p>
      </div>
      <div class="project-body">
        <div class="project-detail">
          <span class="detail-label">Location</span>
          <span class="detail-value">${project.location}</span>
        </div>
        <div class="project-detail">
          <span class="detail-label">Start Date</span>
          <span class="detail-value">${formatDate(project.startDate)}</span>
        </div>
        <div class="project-detail">
          <span class="detail-label">End Date</span>
          <span class="detail-value">${formatDate(project.endDate)}</span>
        </div>
        <div class="project-detail">
          <span class="detail-label">Priority</span>
          <span class="detail-value">${getPriorityBadge(project.priority)}</span>
        </div>
        <div class="project-detail">
          <span class="detail-label">Status</span>
          <span class="detail-value">${project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
        </div>
        <div class="progress-container">
          <div class="project-detail">
            <span class="detail-label">Progress</span>
            <span class="detail-value">${project.progress}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill ${project.priority}-priority" style="width: ${project.progress}%"></div>
          </div>
        </div>
      </div>
    `;
    
    projectsGrid.appendChild(card);
  });
  
  // Render pagination
  renderPagination(page, totalPages);
}

// Function to render pagination
function renderPagination(currentPage, totalPages) {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';
  
  if (totalPages <= 1) {
    return;
  }
  
  // Previous button
  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.className = 'page-button';
    prevButton.textContent = '←';
    prevButton.addEventListener('click', () => {
      filterProjects(currentPage - 1);
    });
    paginationContainer.appendChild(prevButton);
  }
        // Page number buttons
        for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.className = `page-button ${i === currentPage ? 'active' : ''}`;
    pageButton.textContent = i;
    pageButton.addEventListener('click', () => filterProjects(i));
    paginationContainer.appendChild(pageButton);
  }

  // Next button
  if (currentPage < totalPages) {
    const nextButton = document.createElement('button');
    nextButton.className = 'page-button';
    nextButton.textContent = '→';
    nextButton.addEventListener('click', () => filterProjects(currentPage + 1));
    paginationContainer.appendChild(nextButton);
  }
}

// Filter and sort projects based on criteria
function filterProjects(page = 1) {
  const activeTab = document.querySelector('.filter-tab.active');
  const statusFilter = activeTab.dataset.status;
  const searchQuery = document.getElementById('search-input').value.toLowerCase();
  const departmentFilter = document.getElementById('department-filter').value;
  
  let filteredProjects = projects;
  
  // Filter by status
  if (statusFilter !== 'all') {
    filteredProjects = filteredProjects.filter(project => project.status === statusFilter);
  }
  
  // Filter by department
  if (departmentFilter !== 'all') {
    filteredProjects = filteredProjects.filter(project => 
      project.department.toLowerCase() === departmentFilter
    );
  }
  
  // Filter by search query
  if (searchQuery) {
    filteredProjects = filteredProjects.filter(project => 
      project.title.toLowerCase().includes(searchQuery) || 
      project.department.toLowerCase().includes(searchQuery)
    );
  }
  
  renderProjects(filteredProjects, page);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  renderProjects(projects);
  
  // Set up tab click events
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterProjects();
    });
  });
  
  // Set up search and department filter events
  document.getElementById('search-input').addEventListener('input', () => filterProjects());
  document.getElementById('department-filter').addEventListener('change', () => filterProjects());
});
// Modal handling
const modal = document.getElementById('add-project-modal');
const addBtn = document.getElementById('add-project-btn');
const closeBtn = document.querySelector('.close-modal');

addBtn.addEventListener('click', () => modal.style.display = 'block');
closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// Modify the form submission handler
document.getElementById('add-project-form').addEventListener('submit', (e) => {
e.preventDefault();

const newProject = {
id: projects.length + 1,
title: document.getElementById('project-title').value,
department: document.getElementById('project-department').value,
location: document.getElementById('project-location').value,
startDate: document.getElementById('project-start-date').value,
endDate: document.getElementById('project-end-date').value,
priority: document.getElementById('project-priority').value,
status: document.getElementById('project-status').value,
progress: parseInt(document.getElementById('project-progress').value)
};

projects.unshift(newProject);
modal.style.display = 'none';
document.getElementById('add-project-form').reset();

// Reset filters to default state
document.querySelectorAll('.filter-tab').forEach(tab => {
tab.classList.remove('active');
if (tab.dataset.status === 'all') tab.classList.add('active');
});
document.getElementById('search-input').value = '';
document.getElementById('department-filter').value = 'all';

// Refresh the view
filterProjects(1);
});
>>>>>>> b314afec65d92cf39476d31d3c968d7e156e8bfc
