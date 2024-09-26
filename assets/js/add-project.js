// Fetch the projects from localStorage
let projects = JSON.parse(localStorage.getItem("projects")) || [];

// Select form elements
const projectNameInput = document.getElementById("projectName");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const descriptionInput = document.getElementById("description");
const techCheckboxes = document.querySelectorAll('input[name="tech"]');
const imageUploadInput = document.getElementById("imageUpload");

// Form submission handler
document.getElementById("addForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const projectTitle = projectNameInput.value;
  const projectStartDate = startDateInput.value;
  const projectEndDate = endDateInput.value;
  const projectDescription = descriptionInput.value;

  // Get selected technologies
  let selectedTech = [];
  techCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedTech.push(checkbox.value);
    }
  });

  // Calculate project duration
  const startDateInMs = new Date(projectStartDate);
  const endDateInMs = new Date(projectEndDate);
  let projectDurationNum = endDateInMs - startDateInMs;
  projectDurationNum = projectDurationNum / (1000 * 60 * 60 * 24); // Convert ms to days
  let projectDuration = "";
  if (projectDurationNum / 365 >= 1) {
    const years = Math.floor(projectDurationNum / 365);
    projectDuration += years + " years ";
    projectDurationNum -= 365 * years;
  }
  if (projectDurationNum / 30 >= 1) {
    const months = Math.floor(projectDurationNum / 30);
    projectDuration += months + " months ";
    projectDurationNum -= 30 * months;
  }
  projectDuration += Math.floor(projectDurationNum) + " days";

  // If a new image is uploaded, use it; otherwise, set a default placeholder
  let projectImage = "assets/images/project-placeholder.jpg"; // Placeholder for new projects
  const imageFile = imageUploadInput.files[0];
  if (imageFile) {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = function (e) {
      projectImage = e.target.result;
      addProject();
    };
  } else {
    addProject(); // Call directly if no image is uploaded
  }

  function addProject() {
    // Create new project object
    const newProject = {
      title: projectTitle,
      startDate: projectStartDate,
      endDate: projectEndDate,
      duration: projectDuration,
      description: projectDescription,
      technologies: selectedTech,
      image: projectImage,
    };

    // Add the new project to the projects array
    projects.push(newProject);

    // Save updated projects back to localStorage
    localStorage.setItem("projects", JSON.stringify(projects));

    // Redirect to the home page after successful addition
    window.location.href = "/";
  }
});
