// Low-level storage helpers
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

// Data loading from storage
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

// Core state variables
let projects = loadProjectsFromStorage();
let currentProjectId = loadCurrentProjectId();

// Project creation/deletion logic
function createProject(project = {}) {
    const baseName = project.name || "Untitled Project";
    const uniqueName = getUniqueProjectName(baseName);

    const newProject = {
        id: project.id || crypto.randomUUID(),
        name: uniqueName,
        lastModified: project.lastModified ? new Date(project.lastModified) : new Date(),
        data: {
            "fullname": null,
            "email": null,
            "phone": null,
            "summary": null,
            "experiences": [],
            "educations": [],
            "skills": null,
        }
    };

    projects[newProject.id] = newProject;
    currentProjectId = newProject.id;
    saveCurrentProjectId(currentProjectId);

    saveProjectToStorage(newProject);
    saveProjectIndex(Object.keys(projects));

    renderProject(newProject);
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

// Project loading and saving logic
function loadProject(projectId) {
    currentProjectId = projectId;
    saveCurrentProjectId(projectId);

    Object.keys(data).forEach(key => {
        const el = document.getElementById(key);
        if (el) el.value = data[key] || '';
    });

    updatePreview(false);
}

function saveResume() {
    if (!currentProjectId) return;

    const resume = projects[currentProjectId];
    console.log("resume", resume);
    const fields = ['fullname', 'email', 'phone', 'summary', 'skills'];
    const newData = {};
    fields.forEach(field => {
        newData[field] = document.getElementById(field)?.value || '';
    });

    resume.data = newData;
    resume.lastModified = new Date();
    saveProjectToStorage(resume);
    saveProjectIndex(Object.keys(projects))
}

// Resume rendering logic
function generateResumeHTML(data) {
    return `
        <div class="resume-page">
            <div class="page-number">Page 1</div>
            <div class="resume-header">
                <div class="resume-name">${data.fullname || 'Your Name'}</div>
                <div class="resume-contact">
                    ${data.email || 'email@example.com'} | 
                    ${data.phone || '(555) 123-4567'}
                </div>
            </div>
            
            ${data.summary ? `
            <div class="resume-section">
                <h3>Professional Summary</h3>
                <p>${data.summary}</p>
            </div>
            ` : ''}
            
            ${data.experience && data.experience.length > 0 ? `
            <div class="resume-section">
                <h3>Experience</h3>
                ${data.experience.map(exp => `
                    <div class="resume-item">
                        <h4>${exp.title || ''}</h4>
                        <div class="company">${exp.company || ''}</div>
                        <div class="date">${exp.date || ''}</div>
                        <p>${exp.description || ''}</p>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.education && data.education.length > 0 ? `
            <div class="resume-section">
                <h3>Education</h3>
                ${data.education.map(edu => `
                    <div class="resume-item">
                        <h4>${edu.degree || ''}</h4>
                        <div class="company">${edu.school || ''}</div>
                        <div class="date">${edu.date || ''}</div>
                        <p>${edu.info || ''}</p>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.skills ? `
            <div class="resume-section">
                <h3>Skills</h3>
                <p>${data.skills}</p>
            </div>
            ` : ''}
        </div>
    `;
}

function updatePreview(save = true) {
    console.log("currentProjectId", currentProjectId);
    if (!currentProjectId) return;
    if (save) saveResume();
    const data = projects[currentProjectId].data;
    console.log("data", data);
    const newHTML = generateResumeHTML(data);
    
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(newHTML, "text/html");
    const newPage = newDoc.querySelector(".resume-page");

    const pagesContainer = document.getElementById("pagesContainer");
    const oldPage = pagesContainer.querySelector(".resume-page");

    if (!oldPage) {
        // First render
        const frag = document.createDocumentFragment();
        frag.appendChild(newPage);
        pagesContainer.replaceChildren(frag);
    } else {
        // Diff each section instead of replacing all
        const oldSections = oldPage.querySelectorAll(".resume-section, .resume-header");
        const newSections = newPage.querySelectorAll(".resume-section, .resume-header");

        newSections.forEach((newSec, i) => {
            const oldSec = oldSections[i];
            if (!oldSec) {
                // New section added
                oldPage.appendChild(newSec.cloneNode(true));
            } else if (oldSec.outerHTML !== newSec.outerHTML) {
                // Only replace changed section
                oldSec.replaceWith(newSec.cloneNode(true));
            }
        });

        // Remove extra old sections that are no longer in the new HTML
        if (oldSections.length > newSections.length) {
            for (let j = newSections.length; j < oldSections.length; j++) {
                oldSections[j].remove();
            }
        }
    }
}

// Project list rendering logic
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

function renderProjects() {
    const container = document.getElementById("projects");
    container.innerHTML = '';
    Object.values(projects).forEach(renderProject);
}

// UI initialization and event binding
function init() {
    Object.values(projects).forEach(renderProject);
}

function addInputListeners(container = document) {
    const inputs = container.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

document.getElementById("addProjectBtn").addEventListener("click", () => {
    createProject();
});

document.addEventListener('DOMContentLoaded', function() {
    addInputListeners();
    init();
});