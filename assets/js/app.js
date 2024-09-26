function renderProjects() {
  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  console.log(projects);
  const projectDeck = document.getElementById("project-deck");
  projectDeck.innerHTML = "";

  let content = "";
  for (let i = 0; i < projects.length; i++) {
    let toolIcons = "";
    // Check if 'technologies' exists and has elements
    if (projects[i].technologies && projects[i].technologies.length > 0) {
      for (let j = 0; j < projects[i].technologies.length; j++) {
        const toolIcon = `<i class="fa-brands fa-${projects[i].technologies[j]} me-3"></i>`;
        toolIcons += toolIcon;
      }
    }

    const projectCard = `
      <div class="col">
        <div class="card h-100 project-card">
          <a href="/project-detail" class="text-decoration-none text-dark">
            <div class="card-img-top-wrapper p-3">
              <img src="${projects[i].image}" class="card-img-top" alt="project image" />
            </div>
            <div class="card-body">
              <h5 class="card-title">${projects[i].title}</h5>
              <p class="card-text"><small class="text-muted">Duration: ${projects[i].duration}</small></p>
              <p class="card-text">${projects[i].description}</p>
              <div class="technologies fs-1 mb-3">${toolIcons}</div>
            </div>
          </a>
          <div class="card-footer bg-transparent border-0 d-flex flex-column flex-grow-1 justify-content-end">
            <div class="d-flex gap-2 mb-2">
              <button class="btn btn-secondary flex-grow-1" onclick="editProject(${i})">Edit</button>
              <button class="btn btn-danger flex-grow-1" onclick="deleteProject(${i})">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
    content += projectCard;
  }
  projectDeck.innerHTML = content;
}

function editProject(index) {
  localStorage.setItem("editIndex", index);
  window.location.href = "/edit-project";
}

function deleteProject(index) {
  console.log("Delete project at index:", index);
  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  projects.splice(index, 1); // Remove the project at the specified index
  localStorage.setItem("projects", JSON.stringify(projects)); // Save updated projects
  renderProjects(); // Re-render the projects
}

document.addEventListener("DOMContentLoaded", renderProjects);
