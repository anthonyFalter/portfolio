// Project data with sample projects for each category
const projects = {
    data: [
        // Data Projects
        {
            id: 1,
            title: "Sales Analytics Dashboard",
            description: "Interactive dashboard for tracking sales performance and customer insights.",
            types: ["Data", "Analytics"],
            status: "Finished",
            highlights: [
                "Real-time sales data visualization",
                "Customer segmentation analysis",
                "Automated report generation"
            ],
            tools: ["python.svg", "tableau.svg", "sql.svg"],
            image: "https://cdn.prod.website-files.com/6889b90a636f017605fbaf59/68983a31aeee42c56da38dcb_BiniConcert.png"
        },
        {
            id: 2,
            title: "Market Research Analysis",
            description: "Comprehensive market analysis tool for business intelligence.",
            types: ["Data", "Analytics"],
            status: "In Progress",
            highlights: [
                "Competitor analysis",
                "Trend forecasting",
                "Data visualization"
            ],
            tools: ["r.svg", "powerbi.svg", "excel.svg"],
            image: "https://cdn.prod.website-files.com/6889b90a636f017605fbaf59/68983a31aeee42c56da38dcb_BiniConcert.png"
        },
        {
            id: 3,
            title: "Customer Churn Predictor",
            description: "Machine learning model to predict customer churn rates.",
            types: ["Data", "Analytics"],
            status: "Finished",
            highlights: [
                "Predictive analytics",
                "Customer retention strategies",
                "Performance optimization"
            ],
            tools: ["python.svg", "tensorflow.svg", "pandas.svg"],
            image: "https://cdn.prod.website-files.com/6889b90a636f017605fbaf59/68983a31aeee42c56da38dcb_BiniConcert.png"
        },
        {
            id: 4,
            title: "Test DATA",
            description: "Machine learning model to predict customer churn rates.",
            types: ["Data", "Analytics"],
            status: "Finished",
            highlights: [
                "Predictive analytics",
                "Customer retention strategies",
                "Performance optimization"
            ],
            tools: ["python.svg", "tensorflow.svg", "pandas.svg"],
            image: "https://cdn.prod.website-files.com/6889b90a636f017605fbaf59/68983a31aeee42c56da38dcb_BiniConcert.png"
        },
        
        // Graphics Projects
        {
            id: 4,
            title: "Brand Identity Package",
            description: "Complete visual identity for a modern tech startup.",
            types: ["Graphics", "Design"],
            status: "Finished",
            highlights: [
                "Logo design",
                "Brand guidelines",
                "Marketing collateral"
            ],
            tools: ["illustrator.svg", "photoshop.svg", "indesign.svg"],
            image: "https://cdn.prod.website-files.com/6889b90a636f017605fbaf59/68983a31aeee42c56da38dcb_BiniConcert.png"
        },
        {
            id: 5,
            title: "UI/UX Mobile App Design",
            description: "User interface design for a fitness tracking application.",
            types: ["Graphics", "Design"],
            status: "In Progress",
            highlights: [
                "User flow mapping",
                "High-fidelity prototypes",
                "Design system"
            ],
            tools: ["figma.svg", "sketch.svg", "adobexd.svg"],
            image: "https://cdn.prod.website-files.com/6889b90a636f017605fbaf59/68983a31aeee42c56da38dcb_BiniConcert.png"
        },
        {
            id: 6,
            title: "Product Packaging Design",
            description: "Eco-friendly packaging design for a sustainable brand.",
            types: ["Graphics", "Design"],
            status: "Finished",
            highlights: [
                "3D mockups",
                "Print-ready files",
                "Material selection"
            ],
            tools: ["dimension.svg", "illustrator.svg", "photoshop.svg"],
            image: "https://cdn.prod.website-files.com/6889b90a636f017605fbaf59/68983a31aeee42c56da38dcb_BiniConcert.png"
        },
        
        // Development Projects
        {
            id: 7,
            title: "E-commerce Platform",
            description: "Full-featured online store with payment integration.",
            types: ["Development", "Web"],
            status: "Finished",
            highlights: [
                "Responsive design",
                "Secure checkout",
                "Admin dashboard"
            ],
            tools: ["react.svg", "nodejs.svg", "mongodb.svg"],
            image: "https://cdn.prod.website-files.com/6889b90a636f017605fbaf59/68983a31aeee42c56da38dcb_BiniConcert.png"
        },
        {
            id: 8,
            title: "Task Management App",
            description: "Collaborative project management tool for remote teams.",
            types: ["Development", "Web"],
            status: "In Progress",
            highlights: [
                "Real-time updates",
                "User authentication",
                "File sharing"
            ],
            tools: ["vue.svg", "firebase.svg", "tailwind.svg"],
            image: "https://cdn.prod.website-files.com/6889b90a636f017605fbaf59/68983a31aeee42c56da38dcb_BiniConcert.png"
        },
        {
            id: 9,
            title: "Fitness Tracker API",
            description: "RESTful API for fitness application with analytics.",
            types: ["Development", "Web"],
            status: "Finished",
            highlights: [
                "JWT authentication",
                "Data visualization",
                "Scalable architecture"
            ],
            tools: ["python.svg", "django.svg", "postgresql.svg"],
            image: "https://cdn.prod.website-files.com/6889b90a636f017605fbaf59/68983a31aeee42c56da38dcb_BiniConcert.png"
        }
    ]
};

// Function to update the "Others" section with next 3 projects
function updateOthersSection() {
    const otherProjectItems = document.querySelectorAll('.other-project-thumbnail-item');
    if (!otherProjectItems.length) {
        console.error('Could not find other project items');
        return;
    }
    
    // Get all available projects in the current category
    const allProjects = getFilteredProjects(currentCategory);
    
    // Get projects for the "Others" section (next 3 projects not currently shown)
    let nextProjects = [];
    
    // Add projects from the queue first
    nextProjects = [...projectQueue];
    
    // If we don't have enough projects in the queue, add more from all projects
    if (nextProjects.length < 3) {
        const remainingProjects = allProjects.filter(p => 
            p.id !== currentProject?.id && 
            !nextProjects.some(np => np.id === p.id) &&
            !historyStack.some(hp => hp.id === p.id)
        );
        
        // Shuffle the remaining projects
        const shuffled = [...remainingProjects];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Add enough to make 3 total projects
        nextProjects = [...nextProjects, ...shuffled].slice(0, 3);
    } else {
        // Just take the first 3 from queue
        nextProjects = nextProjects.slice(0, 3);
    }
    
    console.log('Updating others section with projects:', nextProjects);
    
    // Update each container with project data
    otherProjectItems.forEach((item, index) => {
        const project = nextProjects[index];
        if (!project) {
            item.style.display = 'none';
            return;
        }
        
        item.style.display = 'block';
        
        // Update project title
        const titleElement = item.querySelector('.other-project-title');
        if (titleElement) titleElement.textContent = project.title;
        
        // Update project type
        const typeContainer = item.querySelector('.other-project-type-container');
        if (typeContainer && project.types && project.types.length > 0) {
            // Clear existing type tags
            typeContainer.innerHTML = '';
            // Add new type tags
            project.types.forEach(type => {
                const typeDiv = document.createElement('div');
                typeDiv.className = 'work-tag-div';
                typeDiv.innerHTML = `<a href="#" class="project-type project-type1-tag w-button">${type}</a>`;
                typeContainer.appendChild(typeDiv);
            });
        }
        
        // Update project image
        const imageElement = item.querySelector('.image-4');
        if (imageElement) imageElement.src = project.image;
        
        // Update project description
        const descContainer = item.querySelector('.other-project-desc-container');
        if (descContainer) {
            const descElement = descContainer.querySelector('h1');
            if (descElement) descElement.textContent = project.description;
        }
        
        // Add click handler to make it navigable
        item.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Don't do anything if clicking the same project
            if (currentProject && currentProject.id === project.id) {
                return;
            }
            
            // Add current project to history if it exists
            if (currentProject) {
                historyStack.push(currentProject);
                
                // Add current project back to queue if it's not already there
                const existsInQueue = projectQueue.some(p => p.id === currentProject.id);
                if (!existsInQueue) {
                    projectQueue.unshift(currentProject);
                }
            }
            
            // Set new current project
            currentProject = project;
            
            // Remove the clicked project from queue if it exists there
            const projectIndex = projectQueue.findIndex(p => p.id === project.id);
            if (projectIndex !== -1) {
                projectQueue.splice(projectIndex, 1);
            }
            
            // Update the UI
            updateFeaturedProject(project);
            updateOthersSection();
        };
    });
}

// Function to update the featured project display
function updateFeaturedProject(project, skipAnimation = false) {
    if (!project) return;
    
    // Update current project
    currentProject = project;
    currentProjectId = project.id;
    
    const mainContent = document.querySelector('.content-main');
    const projectInfo = document.querySelector('.project-info');
    const highlightsContainer = document.querySelector('.work-highlights-list-container');
    
    // Get all elements that need transitions
    const titleElement = document.getElementById('heading_projects-title');
    const descElement = document.getElementById('paragraph_projects-description');
    const typeContainer = document.querySelector('.project-type-container');
    const statusElement = document.getElementById('subheading_project-status');
    const highlightsList = document.querySelector('.list');
    
    // Fade out current content if animation is enabled
    const updateContent = () => {
        // Update main image
        const mainImage = document.querySelector('.content-main img');
        if (mainImage) {
            mainImage.src = project.image;
            mainImage.alt = project.title;
        }

        // Update title
        if (titleElement) titleElement.textContent = project.title;

        // Update description
        if (descElement) descElement.textContent = project.description;

        // Update project types
        if (typeContainer && project.types) {
            typeContainer.innerHTML = project.types.map(type => `
                <div class="work-tag-div">
                    <a href="#" class="project-type project-type1-tag w-button" onclick="event.preventDefault();">
                        ${type}
                    </a>
                </div>
            `).join('');
        }

        // Update status
        if (statusElement) statusElement.textContent = project.status;

        // Update highlights
        if (highlightsList) {
            highlightsList.innerHTML = project.highlights
                .map(highlight => `
                    <li class="list-item">
                        <span class="key-highlights-list_item">${highlight}</span>
                    </li>`)
                .join('');
        }
        
        // Fade in new content after a short delay
        setTimeout(() => {
            if (mainContent) mainContent.classList.remove('fade-out');
            [projectInfo, titleElement, descElement, typeContainer, highlightsContainer].forEach(el => {
                if (el) el.classList.remove('hide');
            });
        }, 50);
    };
    
    if (!skipAnimation) {
        // Start fade out
        if (mainContent) mainContent.classList.add('fade-out');
        [projectInfo, titleElement, descElement, typeContainer, highlightsContainer].forEach(el => {
            if (el) el.classList.add('hide');
        });
        
        // Update content after fade out completes
        setTimeout(updateContent, 300);
    } else {
        updateContent();
    }
}

let currentCategory = 'all';
let currentProjectId = null;
let idleTimer;
const IDLE_DELAY = 5000; // 5 seconds

// Function to get filtered projects by category
function getFilteredProjects(category) {
    if (category === 'all') {
        return [...projects.data];
    }
    return projects.data.filter(project => 
        project.types.some(type => type.toLowerCase() === category.toLowerCase())
    );
}

// Function to show next random project
function showNextRandomProject() {
    const filteredProjects = getFilteredProjects(currentCategory);
    if (filteredProjects.length === 0) return;
    
    let randomIndex;
    
    // If there's more than one project, ensure we don't show the same one consecutively
    if (filteredProjects.length > 1) {
        const currentIndex = filteredProjects.findIndex(p => p.id === currentProjectId);
        do {
            randomIndex = Math.floor(Math.random() * filteredProjects.length);
        } while (randomIndex === currentIndex);
    } else {
        randomIndex = 0;
    }
    
    updateFeaturedProject(filteredProjects[randomIndex]);
}

// Function to start idle shuffle
function startIdleShuffle() {
    // Clear any existing timer
    if (idleTimer) clearTimeout(idleTimer);
    
    // Set new timer
    idleTimer = setTimeout(() => {
        showNextRandomProject();
        startIdleShuffle(); // Continue the cycle
    }, IDLE_DELAY);
}

// Function to filter projects by category
function filterProjects(category, event = null) {
    currentCategory = category; // Update current category
    
    // Reset idle timer on user interaction
    startIdleShuffle();
    
    // Remove active class from all category buttons
    document.querySelectorAll('.category-btn, .category-2-btn, .category-3-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    } else if (event && event.target && event.target.closest('button')) {
        event.target.closest('button').classList.add('active');
    }
    
    // Filter projects by category
    let filteredProjects;
    if (category === 'all') {
        filteredProjects = [...projects.data];
    } else {
        filteredProjects = projects.data.filter(project => 
            project.types.some(type => type.toLowerCase() === category.toLowerCase())
        );
    }
    
    // Reset navigation state
    projectQueue = [];
    historyStack = [];
    
    // Update the project queue with filtered projects
    if (filteredProjects.length > 0) {
        // Set the first project as current
        currentProject = filteredProjects[0];
        
        // Add remaining projects to queue (shuffled)
        if (filteredProjects.length > 1) {
            projectQueue = [...filteredProjects.slice(1)];
            // Shuffle the queue
            for (let i = projectQueue.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [projectQueue[i], projectQueue[j]] = [projectQueue[j], projectQueue[i]];
            }
        }
        
        // Update the UI
        updateFeaturedProject(currentProject);
        updateOthersSection();
    } else {
        // If no projects in this category, clear the display
        currentProject = null;
        updateFeaturedProject(null);
        updateOthersSection();
    }
}

// Function to handle manual shuffle
function handleManualShuffle() {
    const projects = getCurrentFilteredProjects();
    historyStack = [];
    
    // Show first project in the category
    const filtered = getFilteredProjects(category);
    if (filtered.length > 0) {
        currentProject = filtered[0];
        updateFeaturedProject(filtered[0]);
        updateOthersSection(); // Update others section when category changes
    }
};

// Navigation queue and history
let projectQueue = [];
let historyStack = [];
let currentProject = null;

// Function to initialize or update the project queue
function updateProjectQueue() {
    const projects = getFilteredProjects(currentCategory);
    if (projects.length === 0) return [];
    
    // Create a shuffled copy of the projects
    const shuffled = [...projects];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // If there's a current project, ensure it's not in the queue
    if (currentProject) {
        const currentIndex = shuffled.findIndex(p => p.id === currentProject.id);
        if (currentIndex !== -1) {
            shuffled.splice(currentIndex, 1);
        }
    }
    
    return shuffled;
}

// Function to navigate to next project
function showNextProject() {
    const projects = getFilteredProjects(currentCategory);
    if (projects.length <= 1) return; // Need at least 2 projects to navigate
    
    // If queue is empty, create a new shuffled queue
    if (projectQueue.length === 0) {
        // Get all projects except current one
        projectQueue = projects.filter(p => !currentProject || p.id !== currentProject.id);
        
        // Shuffle the queue
        for (let i = projectQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [projectQueue[i], projectQueue[j]] = [projectQueue[j], projectQueue[i]];
        }
    }
    
    // If still no projects in queue, nothing to do
    if (projectQueue.length === 0) return;
    
    // Get next project from queue
    const nextProject = projectQueue.shift();
    
    // Add current project to history if it exists
    if (currentProject) {
        historyStack.push(currentProject);
        
        // Add current project back to the end of the queue
        // but only if it's not already in the queue
        if (!projectQueue.some(p => p.id === currentProject.id)) {
            projectQueue.push(currentProject);
        }
    }
    
    // Update current project and display it
    currentProject = nextProject;
    updateFeaturedProject(nextProject);
    updateOthersSection(); // Update others section after navigation
}

// Function to navigate to previous project
function showPreviousProject() {
    // If no history, nothing to go back to
    if (historyStack.length === 0) return;
    
    // Get previous project from history
    const prevProject = historyStack.pop();
    
    // Add current project back to the queue
    if (currentProject) {
        // Only add to queue if it's not already there
        if (!projectQueue.some(p => p.id === currentProject.id)) {
            projectQueue.unshift(currentProject);
        }
    }
    
    // Update current project and display it
    currentProject = prevProject;
    updateFeaturedProject(prevProject);
    updateOthersSection(); // Update others section after navigation
}


// Initialize the application
function initializeApp() {
    // Set default category
    currentCategory = 'Data';
    
    // Initialize project queue
    projectQueue = updateProjectQueue();
    
    // Show first project if available
    const projects = getFilteredProjects(currentCategory);
    if (projects.length > 0) {
        currentProject = projects[0];
        updateFeaturedProject(projects[0]);
        updateOthersSection();
    }
}

// Handle project type button clicks
document.addEventListener('click', (e) => {
    // Check if the clicked element or its parent has the project-type class
    const typeBtn = e.target.closest('.project-type1-tag, .project-type');
    if (typeBtn) {
        e.preventDefault();
        e.stopPropagation();
        // Don't do anything else - we just want to prevent the default behavior
        return false;
    }
});

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    initializeApp();
    
    // Get navigation buttons
    const prevBtn = document.getElementById('prev-project');
    const nextBtn = document.getElementById('next-project');
    
    // Add event listeners for navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showPreviousProject();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNextProject();
        });
    }
    
    // Get category buttons
    const dataBtn = document.getElementById('btn-data-category');
    const graphicsBtn = document.getElementById('btn-graphics-category');
    const devBtn = document.getElementById('btn-development-category');
    
    // Set 'Data' as the default active category
    if (dataBtn) {
        dataBtn.classList.add('active');
        currentCategory = 'Data';
        const dataProjects = getFilteredProjects('Data');
        if (dataProjects.length > 0) {
            updateFeaturedProject(dataProjects[0], true);
        }
    }

    // Function to handle category button clicks
    function handleCategoryClick(event, category) {
        event.preventDefault();
        event.stopPropagation();
        
        // Update current category
        currentCategory = category.toLowerCase();
        
        // Update active button
        document.querySelectorAll('.category-btn, .category-2-btn, .category-3-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Get filtered projects for the selected category
        const filteredProjects = getFilteredProjects(currentCategory);
        
        if (filteredProjects.length > 0) {
            // Reset navigation state
            projectQueue = [];
            historyStack = [];
            
            // Set the first project as current
            currentProject = filteredProjects[0];
            
            // Add remaining projects to queue (shuffled)
            if (filteredProjects.length > 1) {
                projectQueue = [...filteredProjects.slice(1)];
                // Shuffle the queue
                for (let i = projectQueue.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [projectQueue[i], projectQueue[j]] = [projectQueue[j], projectQueue[i]];
                }
            }
            
            // Update the UI
            updateFeaturedProject(currentProject, true);
            updateOthersSection();
        }
    }
    
    // Add click event listeners to category buttons
    if (dataBtn) dataBtn.addEventListener('click', (e) => handleCategoryClick(e, 'Data'));
    if (graphicsBtn) graphicsBtn.addEventListener('click', (e) => handleCategoryClick(e, 'Graphics'));
    if (devBtn) devBtn.addEventListener('click', (e) => handleCategoryClick(e, 'Development'));

    // Set initial project if not already set
    if (!currentProjectId) {
        const initialProjects = getFilteredProjects(currentCategory || 'all');
        if (initialProjects.length > 0) {
            currentProject = initialProjects[0];
            updateFeaturedProject(initialProjects[0]);
            // Initialize queue with remaining projects
            projectQueue = initialProjects.slice(1);
            updateOthersSection(); // Initialize others section
        }
    } else {
        updateOthersSection(); // Initialize others section if already have a project
    }
});
