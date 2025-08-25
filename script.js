const stores = ['experiences', 'educations', 'projects', 'skills'];

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ResumeDB", 1);

        request.onerror = () => reject('Error opening database');
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("resumes")) {
                db.createObjectStore("resumes", { keyPath: "id" });
            }

            const childStores = ["experiences", "educations", "skills", "projects"];
            for (const store of childStores) {
                if (!db.objectStoreNames.contains(stores)) {
                    const objStore = db.createObjectStore(store, { keyPath: "id", autoIncrement: true });
                    objStore.createIndex("resume_id", "resume_id", { unique: false });
                }
            }
        };

    });
}

async function clearStore(db, storeName) {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.clear();
}

async function storeResume(db, resume) {
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction("resumes", "readwrite");
            const store = tx.objectStore("resumes");
            resume.id = crypto.randomUUID();
            const request = store.put(resume);
            request.onsuccess = () => {
                const id = request.result;
                if (!id) {
                    reject(new Error("Insert succeeded but no ID was returned"));
                } else {
                    resolve(id);
                }
            };

            request.onerror = () => {
                reject(new Error("Error inserting resume"));
            };
        } catch (err) {
            reject(err);
        }
    });
}

async function storeResumeData(db, storeName, resume_id, data) {
    if (!db.objectStoreNames.contains(storeName)) {
        throw new Error(`Store "${storeName}" does not exist`);
    }
    
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    for (const d of data){
        d.resume_id = resume_id;
        store.put(d);
    }

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject("Error inserting data");
    });
}

async function loadResume(db, resume_id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("resumes", "readonly");
        const store = tx.objectStore("resumes");
        
        let request;
        if (resume_id) {
            request = store.get(resume_id);
        } else {
            request = store.getAll();
        }

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Error fetching data");
    });
}

async function loadResumeData(db, storeName, resume_id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const index = store.index("resume_id");
        const request = index.getAll(resume_id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Error fetching data");
    });
}

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

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded');
    const db = await openDB();

    // Clear the stores
    await clearStore(db, "resumes");
    await clearStore(db, "experiences");
    await clearStore(db, "skills");
    await clearStore(db, "projects");
    await clearStore(db, "educations");

    const resume_id = await storeResume(db, {
        "name": "John Doe",
        "title": "Software Engineer",
        "email": "john.doe@example.com",
        "phone": "123-456-7890",
        "summary": "A software engineer with 5 years of experience in backend development.",
    });
    const resume = await loadResume(db, resume_id);
    console.log("Resume ID:", resume_id);
    console.log("Resume:", resume);

    // Insert related child data
    await storeResumeData(db, "experiences", resume_id, [
        {
            "position": "Backend Developer",
            "status": "Senior",
            "company": "Acme Corp",
            "startDate": "2022",
            "endDate": "2024",
            "isCurrent": false,
            "tasks": [
              "Built scalable APIs in Go",
              "Improved query performance by 40%"
            ]
        }
    ]);

    await storeResumeData(db, "educations", resume_id,  [
        {
            "institution": "XYZ University",
            "degree": "Bachelor of Science in Computer Science",
            "startDate": "2018",
            "endDate": "2022",
            "gpa": "3.8/4.0",
            "courses": [
                "Data Structures and Algorithms",
                "Database Management Systems",
                "Web Programming"
            ]
        }
    ]);

    await storeResumeData(db, "projects", resume_id, [
        {
            "name": "Project 1",
            "description": "A project that I worked on",
            "technologies": [
                "Go",
                "SQL"
            ],
            "link": "https://github.com/ravi0497/project1",
            "date": "2022"
        }
    ]);

    await storeResumeData(db, "skills", resume_id, [
        {
            "name": "Go",
            "level": "Advanced",
            "yearsOfExperience": "5"
        },
        {
            "name": "SQL",
            "level": "Intermediate",
            "yearsOfExperience": "3"
        }
    ]);

    // Fetch experiences
    const experiences = await loadResumeData(db, "experiences", resume_id);
    console.log("Experiences:", experiences);

    // Fetch educations
    const educations = await loadResumeData(db, "educations", resume_id);
    console.log("Educations:", educations);

    // Fetch projects
    const projects = await loadResumeData(db, "projects", resume_id);
    console.log("Projects:", projects);

    // Fetch skills
    const skills = await loadResumeData(db, "skills", resume_id);
    console.log("Skills:", skills);
});