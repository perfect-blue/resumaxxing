// Use requestAnimationFrame for smoother animations
function toggleProjectSidebar() {
    const sidebar = document.getElementById('projectSidebar');
    const livePreview = document.getElementById('livePreview');
    
    requestAnimationFrame(() => {
        sidebar.classList.toggle('collapsed');
        livePreview.classList.toggle('live-preview-sidebar-collapsed');
    });
}

function toggleEditorSidebar() {
    const sidebar = document.getElementById('editorSidebar');
    
    requestAnimationFrame(() => {
        sidebar.classList.toggle('collapsed');
    });
}

// Experience Management Functions
function addExperienceItem() {
    const experienceItems = document.querySelector('#experience-section .experience-items');
    const newItem = document.createElement('div');
    newItem.className = 'experience-item';
    newItem.innerHTML = `
        <button class="delete-item-btn" onclick="deleteExperienceItem(this)">×</button>
        <p contenteditable="true" class="editable"><strong>Job Title</strong> - Company Name (Year-Year)</p>
        <p contenteditable="true" class="editable">• Add your key achievement or responsibility here</p>
        <p contenteditable="true" class="editable">• Add another achievement or responsibility</p>
    `;
    experienceItems.appendChild(newItem);
    
    // Focus on the first editable element
    const firstEditable = newItem.querySelector('.editable');
    if (firstEditable) {
        firstEditable.focus();
    }
}

function deleteExperienceItem(button) {
    const experienceItem = button.closest('.experience-item');
    const experienceItems = document.querySelector('#experience-section .experience-items');
    
    // Prevent deletion if it's the last item
    if (experienceItems.children.length > 1) {
        experienceItem.remove();
    } else {
        alert('You must have at least one experience item.');
    }
}

// Education Management Functions
function addEducationItem() {
    const educationItems = document.querySelector('#education-section .education-items');
    const newItem = document.createElement('div');
    newItem.className = 'education-item';
    newItem.innerHTML = `
        <button class="delete-item-btn" onclick="deleteEducationItem(this)">×</button>
        <p contenteditable="true" class="editable"><strong>Degree</strong> - Institution Name (Year-Year)</p>
        <p contenteditable="true" class="editable">• Add relevant coursework, achievements, or details</p>
    `;
    educationItems.appendChild(newItem);
    
    // Focus on the first editable element
    const firstEditable = newItem.querySelector('.editable');
    if (firstEditable) {
        firstEditable.focus();
    }
}

function deleteEducationItem(button) {
    const educationItem = button.closest('.education-item');
    educationItem.remove();
}

// Skills Management Functions
function addSkillItem() {
    const skillsItems = document.querySelector('#skills-section .skills-items');
    const newItem = document.createElement('div');
    newItem.className = 'skill-item';
    newItem.innerHTML = `
        <button class="delete-item-btn" onclick="deleteSkillItem(this)">×</button>
        <p contenteditable="true" class="editable"><strong>Category:</strong> Add your skills here</p>
    `;
    skillsItems.appendChild(newItem);
    
    // Focus on the first editable element
    const firstEditable = newItem.querySelector('.editable');
    if (firstEditable) {
        firstEditable.focus();
    }
}

function deleteSkillItem(button) {
    const skillItem = button.closest('.skill-item');
    skillItem.remove();
}

// Projects Management Functions
function addProjectItem() {
    const projectItems = document.querySelector('#projects-section .project-items');
    const newItem = document.createElement('div');
    newItem.className = 'project-item';
    newItem.innerHTML = `
        <button class="delete-item-btn" onclick="deleteProjectItem(this)">×</button>
        <p contenteditable="true" class="editable"><strong>Project Name</strong> - Project Type</p>
        <p contenteditable="true" class="editable">• Add project description or achievement here</p>
        <p contenteditable="true" class="editable">• Add another key feature or technology used</p>
    `;
    projectItems.appendChild(newItem);
    
    // Focus on the first editable element
    const firstEditable = newItem.querySelector('.editable');
    if (firstEditable) {
        firstEditable.focus();
    }
}

function deleteProjectItem(button) {
    const projectItem = button.closest('.project-item');
    projectItem.remove();
}

// Section Management Functions
function deleteSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section && confirm('Are you sure you want to delete this entire section?')) {
        section.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        label.addEventListener('click', () => {
            const forAttribute = label.getAttribute('for');
            if (forAttribute) {
                const input = document.getElementById(forAttribute);
                if (input) input.focus();
            }
        });
    });
    
});