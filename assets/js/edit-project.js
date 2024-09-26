// Function to load project data into the form based on project index
function loadProjectData() {
  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  const projectIndex = localStorage.getItem("editIndex");

  if (projectIndex !== null) {
    const project = projects[projectIndex];

    // Pre-fill form fields with project data
    document.getElementById("projectName").value = project.title;
    document.getElementById("description").value = project.description;

    const startDate = project.startDate ? project.startDate : ""; // Optional startDate
    const endDate = project.endDate ? project.endDate : ""; // Optional endDate
    document.getElementById("startDate").value = startDate;
    document.getElementById("endDate").value = endDate;

    // Check the technologies used in the project and mark the appropriate checkboxes
    if (project.technologies && project.technologies.length > 0) {
      project.technologies.forEach((tool) => {
        const toolCheckbox = document.getElementById(tool);
        if (toolCheckbox) {
          toolCheckbox.checked = true;
        }
      });
    }
  }
}

// Function to handle form submission and update the project data
function updateProject(event) {
  event.preventDefault();

  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  const projectIndex = localStorage.getItem("editIndex");

  if (projectIndex !== null) {
    const updatedProject = {
      title: document.getElementById("projectName").value,
      description: document.getElementById("description").value,
      startDate: document.getElementById("startDate").value,
      endDate: document.getElementById("endDate").value,
      technologies: Array.from(
        document.querySelectorAll('input[name="tech"]:checked')
      ).map((input) => input.value),
    };

    // Handle image upload
    const imageInput = document.getElementById("imageUpload");
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        updatedProject.image = e.target.result; // Data URL of the image
        saveAndRedirect(updatedProject, projectIndex, projects);
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      // If no new image uploaded, keep the old image
      updatedProject.image = projects[projectIndex].image;
      saveAndRedirect(updatedProject, projectIndex, projects);
    }
  }
}

// Function to save updated project and redirect to the home page
function saveAndRedirect(updatedProject, projectIndex, projects) {
  // Update the project in the array
  projects[projectIndex] = updatedProject;

  // Save updated array back to localStorage
  localStorage.setItem("projects", JSON.stringify(projects));

  // Clear the editIndex and redirect to home
  localStorage.removeItem("editIndex");
  window.location.href = "/";
}

// Load project data on page load
document.addEventListener("DOMContentLoaded", loadProjectData);

// Handle form submission
document.getElementById("editForm").addEventListener("submit", updateProject);
