// Import Firebase modules
import { db, doc, getDoc, collection } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Get the project ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    // No default project data - all data will be fetched from Firestore
    
    // Get the project content container
    const projectContent = document.getElementById('project-content');
    
    try {
        let project;
        
        // Try to fetch project data from Firestore
        if (projectId) {
            const projectRef = doc(db, 'projects', projectId);
            const projectSnapshot = await getDoc(projectRef);
            
            if (projectSnapshot.exists()) {
                project = projectSnapshot.data();
            }
            // No fallback to default data anymore - all projects must be in Firestore
        }
        
        // If project ID exists and is valid
        if (projectId && project) {
        
        // Create HTML content for the project details
        const content = `
            <h2 class="heading">${project.title} <span class="neon-glow">Details</span></h2>
            
            <div class="project-image">
                <img src="../assets/project-${projectId}.jpg" alt="${project.title}" class="neon-box-glow">
            </div>
            
            <div class="project-details-content">
                <div class="project-overview">
                    ${project.fullDescription}
                </div>
                
                <div class="project-details-section">
                    <h3>Technologies Used</h3>
                    <div class="project-tech details-tech">
                        ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                </div>
                
                <div class="project-details-section">
                    <h3>Key Features</h3>
                    <ul class="features-list">
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="project-details-section">
                    <h3>Challenges & Solutions</h3>
                    <ul class="challenges-list">
                        ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="project-links details-links">
                    ${project.github && project.github !== '#' ? 
                    `<a href="${project.github}" class="btn neon-glow"><i class="fa-brands fa-github"></i> View Code</a>` : 
                    `<button class="btn neon-glow disabled-btn" onclick="alert('GitHub link not added yet')"><i class="fa-brands fa-github"></i> View Code</button>`}
                    ${project.demo && project.demo !== '#' ? 
                    `<a href="${project.demo}" class="btn neon-glow"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>` : 
                    `<button class="btn neon-glow disabled-btn" onclick="alert('Demo link not added yet')"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</button>`}
                </div>
            </div>
        `;
        
        // Update the project content
        projectContent.innerHTML = content;
    } else {
        // If project ID is invalid or not provided
        projectContent.innerHTML = `
            <div class="error-message">
                <h2 class="heading">Project <span class="neon-glow">Not Found</span></h2>
                <p>Sorry, the project you're looking for doesn't exist or has been removed.</p>
                <a href="../index.html#projects" class="btn neon-glow">Back to Projects</a>
            </div>
        `;
    }
    } catch (error) {
        console.error('Error fetching project details:', error);
        projectContent.innerHTML = `
            <div class="error-message">
                <h2 class="heading">Error <span class="neon-glow">Loading Project</span></h2>
                <p>Sorry, there was an error loading the project details. Please try again later.</p>
                <a href="../index.html#projects" class="btn neon-glow">Back to Projects</a>
            </div>
        `;
    }
    
    // Mobile Navigation Toggle (copied from main script.js)
    const menuBtn = document.querySelector('.menu-btn');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar a');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navbar.classList.remove('active');
        });
    });
});