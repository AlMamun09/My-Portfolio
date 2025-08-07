// Import Firebase modules
import { db, doc, getDoc, collection } from './firebase-config.js';

// Function to handle carousel functionality
function initializeCarousel() {
    const carousel = document.querySelector('.project-image-carousel');
    if (!carousel) return;
    
    const carouselInner = carousel.querySelector('.carousel-inner');
    const items = carousel.querySelectorAll('.carousel-item');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    const prevBtn = carousel.querySelector('.carousel-control.prev');
    const nextBtn = carousel.querySelector('.carousel-control.next');
    
    if (items.length <= 1) return; // No need for carousel with only one image
    
    let currentIndex = 0;
    
    // Function to show a specific slide
    function showSlide(index) {
        // Handle index bounds
        if (index < 0) index = items.length - 1;
        if (index >= items.length) index = 0;
        
        // Update current index
        currentIndex = index;
        
        // Update active class on items
        items.forEach((item, i) => {
            item.classList.toggle('active', i === currentIndex);
        });
        
        // Update active class on indicators
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Event listeners for controls
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentIndex - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentIndex + 1);
        });
    }
    
    // Event listeners for indicators
    indicators.forEach((indicator, i) => {
        indicator.addEventListener('click', () => {
            showSlide(i);
        });
    });
    
    // Optional: Auto-advance slides every 5 seconds
    let intervalId = setInterval(() => {
        showSlide(currentIndex + 1);
    }, 5000);
    
    // Pause auto-advance on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(intervalId);
    });
    
    carousel.addEventListener('mouseleave', () => {
        intervalId = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 5000);
    });
}

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
            
            <div class="project-images">
                <div class="project-image-carousel">
                    ${(() => {
                        // Determine which images to use
                        let imagesToUse = [];
                        
                        if (project.imageUrls && project.imageUrls.length > 0) {
                            // Use the new imageUrls array
                            imagesToUse = project.imageUrls;
                        } else if (project.imageUrl) {
                            // Fallback to single imageUrl
                            imagesToUse = [project.imageUrl];
                        } else if (project.images && project.images.length > 0) {
                            // Fallback to legacy images array
                            imagesToUse = project.images.map(img => `../images/${img}`);
                        } else {
                            // Last resort fallback
                            imagesToUse = [`../images/project-${projectId}.jpg`];
                        }
                        
                        // Generate HTML for images
                        if (imagesToUse.length === 1) {
                            // Single image - no carousel needed
                            return `<div class="carousel-item active">
                                <img src="${imagesToUse[0]}" alt="${project.title}" class="neon-box-glow">
                            </div>`;
                        } else {
                            // Multiple images - create carousel
                            let carouselItems = '';
                            let indicators = '';
                            
                            imagesToUse.forEach((img, index) => {
                                carouselItems += `
                                <div class="carousel-item${index === 0 ? ' active' : ''}">
                                    <img src="${img}" alt="${project.title} - Image ${index + 1}" class="neon-box-glow">
                                </div>`;
                                
                                indicators += `
                                <span class="carousel-indicator${index === 0 ? ' active' : ''}" data-index="${index}"></span>`;
                            });
                            
                            return `
                                <div class="carousel-inner">
                                    ${carouselItems}
                                </div>
                                <div class="carousel-controls">
                                    <button class="carousel-control prev"><i class="fas fa-chevron-left"></i></button>
                                    <div class="carousel-indicators">
                                        ${indicators}
                                    </div>
                                    <button class="carousel-control next"><i class="fas fa-chevron-right"></i></button>
                                </div>`;
                        }
                    })()} 
                </div>
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
        
        // Initialize carousel if there are multiple images
        initializeCarousel();
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