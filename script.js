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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('projectToggleBtn').addEventListener('click', toggleProjectSidebar);
    document.getElementById('editorToggleBtn').addEventListener('click', toggleEditorSidebar);
});