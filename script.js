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

// Zoom functionality for A4 paper preview
function setupZoom() {
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomLevelDisplay = document.getElementById('zoomLevel');
    const a4Paper = document.getElementById('a4Paper');
    
    let zoomLevel = 100; // Default zoom level (100%)
    const minZoom = 0;
    const maxZoom = 200;
    const zoomStep = 10;
    
    // Update zoom display and apply transform
    function updateZoom() {
        zoomLevelDisplay.textContent = `${zoomLevel}%`;
        a4Paper.style.transform = `scale(${zoomLevel / 100})`;
    }
    
    // Zoom in button click handler
    zoomInBtn.addEventListener('click', () => {
        if (zoomLevel < maxZoom) {
            zoomLevel += zoomStep;
            updateZoom();
        }
    });
    
    // Zoom out button click handler
    zoomOutBtn.addEventListener('click', () => {
        if (zoomLevel > minZoom) {
            zoomLevel -= zoomStep;
            updateZoom();
        }
    });
}

// Add event listeners after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('projectToggleBtn').addEventListener('click', toggleProjectSidebar);
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
    
    // Initialize zoom functionality
    setupZoom();
});