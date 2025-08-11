let projects = {}
let currentProjectId = null;

function createProject(project = {}) {
    const newProject = {
        id: project.id || crypto.randomUUID(), // generate unique ID if missing
        name: project.name || "Untitled Project",
        lastModified: project.lastModified ? new Date(project.lastModified) : new Date()
    };

    projects[newProject.id] = newProject;
    currentProjectId = newProject.id;
    renderProject(newProject);
}

function renderProject(project) {
    const container = document.getElementById("projects");

    const projectItem = document.createElement('div');
    projectItem.className = `project-item ${project.id === currentProjectId ? 'active' : ''}`;
    projectItem.onclick = () => loadProject(project.id);

    const nameEl = document.createElement('h3');
    nameEl.textContent = project.name || 'Untitled Project';

    if (project.id === currentProjectId) {
        nameEl.contentEditable = "true";
        nameEl.classList.add('editable-project-name');

        nameEl.addEventListener('click', (e) => e.stopPropagation());
        nameEl.addEventListener('input', (e) => {
            project.name = e.target.textContent.trim() || 'Untitled Project';
            project.lastModified = new Date();
            date.textContent = `Modified: ${project.lastModified.toLocaleDateString()}`;
        });
    }

    projectItem.appendChild(nameEl);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-project';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteProject(project.id);
    });
    projectItem.appendChild(deleteBtn);

    const date = document.createElement('p');
    date.textContent = `Modified: ${project.lastModified.toLocaleDateString()}`;
    projectItem.appendChild(date);

    container.appendChild(projectItem);
}

function renderProjects() {
    const container = document.getElementById("projects");
    container.innerHTML = '';
    Object.values(projects).forEach(renderSingleProject);
}