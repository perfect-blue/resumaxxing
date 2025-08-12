function getUniqueProjectName(baseName) {
    const existingNames = Object.values(projects).map(p => p.name.toLowerCase());
    let name = baseName;
    let counter = 1;
    while (existingNames.includes(name.toLowerCase())) {
        name = `${baseName} ${counter++}`;
    }
    return name;
}

function saveProjectToStorage(project) {
    localStorage.setItem(`project_${project.id}`, JSON.stringify(project));
}

function deleteProjectFromStorage(projectId) {
    localStorage.removeItem(`project_${projectId}`);
}

function saveProjectIndex(ids) {
    localStorage.setItem("projects_index", JSON.stringify(ids));
}

function saveCurrentProjectId(id) {
    localStorage.setItem("currentProjectId", id || "");
}

function loadCurrentProjectId() {
    return localStorage.getItem("currentProjectId") || null;
}

let projects = loadProjectsFromStorage();
let currentProjectId = loadCurrentProjectId();

function loadProjectsFromStorage() {
    const ids = JSON.parse(localStorage.getItem("projects_index") || "[]");
    const loaded = {};
    ids.forEach(id => {
        const item = localStorage.getItem(`project_${id}`);
        if (item) {
            const parsed = JSON.parse(item);
            parsed.lastModified = new Date(parsed.lastModified);
            loaded[id] = parsed;
        }
    });
    return loaded;
}

function createProject(project = {}) {
    const baseName = project.name || "Untitled Project";
    const uniqueName = getUniqueProjectName(baseName);

    const newProject = {
        id: project.id || crypto.randomUUID(),
        name: uniqueName,
        lastModified: project.lastModified ? new Date(project.lastModified) : new Date()
    };

    projects[newProject.id] = newProject;
    currentProjectId = newProject.id;
    saveCurrentProjectId(currentProjectId);

    saveProjectToStorage(newProject);
    saveProjectIndex(Object.keys(projects));

    renderProject(newProject);
}

function renderProject(project) {
    const container = document.getElementById("projects");

    const projectItem = document.createElement('div');
    projectItem.className = `project-item ${project.id === currentProjectId ? 'active' : ''}`;
    projectItem.dataset.id = project.id;
    projectItem.onclick = () => loadProject(project.id);

    const nameEl = document.createElement('h3');
    nameEl.textContent = project.name || 'Untitled Project';

    if (project.id === currentProjectId) {
        nameEl.contentEditable = "true";
        nameEl.classList.add('editable-project-name');

        nameEl.addEventListener('click', (e) => e.stopPropagation());
        nameEl.addEventListener('blur', (e) => {
            const newName = e.target.textContent.trim() || 'Untitled Project';
            const lowerNewName = newName.toLowerCase();
            const nameExists = Object.values(projects)
                .some(p => p.id !== project.id && p.name.toLowerCase() === lowerNewName);

            if (nameExists) {
                alert("A project with this name already exists. Please choose another.");
                e.target.textContent = project.name; // revert to original
                return;
            }

            project.name = newName;
            project.lastModified = new Date();
            saveProjectToStorage(project);
            saveProjectIndex(Object.keys(projects));
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

function deleteProject(projectId) {
    delete projects[projectId];
    deleteProjectFromStorage(projectId);
    saveProjectIndex(Object.keys(projects));

    const el = document.querySelector(`[data-id="${projectId}"]`);
    if (el) el.remove();

    if (currentProjectId === projectId) {
        currentProjectId = null;
        saveCurrentProjectId(null);
    }
}

function renderProjects() {
    const container = document.getElementById("projects");
    container.innerHTML = '';
    Object.values(projects).forEach(renderProject);
}

function init() {
    Object.values(projects).forEach(renderProject);
}

init();

document.getElementById("addProjectBtn").addEventListener("click", () => {
    createProject();
});
