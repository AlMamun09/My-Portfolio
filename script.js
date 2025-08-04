// Mobile Navigation Toggle
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

// Scroll Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.1 });

// Observe all sections for scroll animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Projects Load More Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update projects from localStorage if available
    updateProjectsFromLocalStorage();
    
    const loadMoreBtn = document.getElementById('load-more-btn');
    const projectsContainer = document.querySelector('.projects-container');
    const hiddenProjects = document.querySelectorAll('.project-card[data-id="4"], .project-card[data-id="5"], .project-card[data-id="6"]');
    let projectsExpanded = false;
    
    console.log('DOM Content Loaded');
    console.log('Hidden projects found:', hiddenProjects.length);
    console.log('Load More button found:', loadMoreBtn);
    console.log('Projects container found:', projectsContainer);
    
    // Ensure projects are hidden initially but with proper styling
    hiddenProjects.forEach(project => {
        // Remove any inline styles first
        project.removeAttribute('style');
        // Then add the hidden class
        project.classList.add('hidden');
        console.log('Initially hiding project:', project.querySelector('h3').textContent);
    });
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            console.log('Load More button clicked, current state:', projectsExpanded);
            
            if (!projectsExpanded) {
                // Show hidden projects
                hiddenProjects.forEach(project => {
                    // First remove the hidden class
                    project.classList.remove('hidden');
                    // Add show class for animation
                    project.classList.add('show');
                    // Then set display style explicitly
                    project.style.display = 'flex';
                    project.style.flexDirection = 'column';
                    project.style.opacity = '1';
                    project.style.transform = 'translateY(0)';
                    console.log('Showing project:', project.querySelector('h3').textContent, 'Display:', project.style.display);
                });
                loadMoreBtn.textContent = 'Show Less';
                projectsExpanded = true;
            } else {
                // Hide projects
                hiddenProjects.forEach(project => {
                    // First set display to none
                    project.style.display = 'none';
                    // Remove show class and add hidden class
                    project.classList.remove('show');
                    project.classList.add('hidden');
                    console.log('Hiding project:', project.querySelector('h3').textContent, 'Display:', project.style.display);
                });
                loadMoreBtn.textContent = 'Load More';
                projectsExpanded = false;
                
                // Scroll back to projects section
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    window.scrollTo({
                        top: projectsSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
        
        // Trigger a click on load more button to check if it works
        console.log('Simulating a click on the Load More button');
        setTimeout(() => {
            loadMoreBtn.click();
            setTimeout(() => {
                loadMoreBtn.click();
            }, 1000);
        }, 1000);
    }
});


// Form Validation and Email Sending
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        // Reset previous error states
        if (nameInput && emailInput && subjectInput && messageInput) {
            [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                if (input) {
                    input.style.borderColor = 'var(--neon-blue)';
                    input.style.boxShadow = '0 0 5px var(--neon-blue)';
                }
            });
            
            // Validate name
            if (nameInput && nameInput.value.trim() === '') {
                nameInput.style.borderColor = '#ff0000';
                nameInput.style.boxShadow = '0 0 10px #ff0000';
                isValid = false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailRegex.test(emailInput.value.trim())) {
                emailInput.style.borderColor = '#ff0000';
                emailInput.style.boxShadow = '0 0 10px #ff0000';
                isValid = false;
            }
            
            // Validate subject
            if (subjectInput && subjectInput.value.trim() === '') {
                subjectInput.style.borderColor = '#ff0000';
                subjectInput.style.boxShadow = '0 0 10px #ff0000';
                isValid = false;
            }
            
            // Validate message
            if (messageInput && messageInput.value.trim() === '') {
                messageInput.style.borderColor = '#ff0000';
                messageInput.style.boxShadow = '0 0 10px #ff0000';
                isValid = false;
            }
            
            if (isValid) {
                // Disable submit button and show loading state
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                // Prepare template parameters for EmailJS
                const templateParams = {
                    from_name: nameInput.value.trim(),
                    from_email: emailInput.value.trim(),
                    subject: subjectInput.value.trim(),
                    message: messageInput.value.trim()
                };
                
                // Send email using EmailJS
                // Replace with your EmailJS service ID and template ID
                emailjs.send('service_id', 'template_id', templateParams)
                    .then(function(response) {
                        console.log('SUCCESS!', response.status, response.text);
                        
                        // Show success message
                        formMessage.textContent = 'Message sent successfully!';
                        formMessage.style.color = 'var(--neon-blue)';
                        formMessage.style.textShadow = '0 0 5px var(--neon-blue)';
                        
                        // Reset form
                        contactForm.reset();
                        
                        // Reset button
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send Message';
                        
                        // Remove success message after 5 seconds
                        setTimeout(() => {
                            formMessage.textContent = '';
                        }, 5000);
                    }, function(error) {
                        console.log('FAILED...', error);
                        
                        // Show error message
                        formMessage.textContent = 'Failed to send message. Please try again.';
                        formMessage.style.color = '#ff0000';
                        formMessage.style.textShadow = '0 0 5px #ff0000';
                        
                        // Reset button
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send Message';
                    });
            }
        }
    });
}

// Hover effects for skill items
const skillItems = document.querySelectorAll('.skills-content span');

if (skillItems.length > 0) {
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.1)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });
}

// Scroll to section when nav link is clicked
document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Add active class to nav links on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Sticky header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 100);
});

// Function to update projects from localStorage
function updateProjectsFromLocalStorage() {
    const storedProjects = JSON.parse(localStorage.getItem('projectsData'));
    if (!storedProjects) return;
    
    // Get all existing project cards
    const existingCards = document.querySelectorAll('.project-card');
    const projectsContainer = document.querySelector('.projects-container');
    if (!projectsContainer) return;
    
    // Create a set of project IDs from localStorage
    const storedProjectIds = new Set(Object.keys(storedProjects));
    
    // First, handle removal of deleted projects
    existingCards.forEach(card => {
        const cardId = card.getAttribute('data-id');
        // If this card's project is not in localStorage, remove it
        if (!storedProjectIds.has(cardId)) {
            card.remove();
            console.log(`Removed project card with ID: ${cardId} as it was deleted`);
        }
    });
    
    // Then update existing projects and add new ones
    Object.entries(storedProjects).forEach(([id, project]) => {
        const projectCard = document.querySelector(`.project-card[data-id="${id}"]`);
        
        if (projectCard) {
            // Update existing project card
            const titleElement = projectCard.querySelector('h3');
            const descriptionElement = projectCard.querySelector('p');
            const techContainer = projectCard.querySelector('.project-tech');
            const githubLink = projectCard.querySelector('.project-links a:first-child');
            const demoLink = projectCard.querySelector('.project-links a:last-child');
            
            if (titleElement) titleElement.textContent = project.title;
            if (descriptionElement) descriptionElement.textContent = project.description;
            
            if (techContainer) {
                techContainer.innerHTML = '';
                project.technologies.forEach(tech => {
                    const span = document.createElement('span');
                    span.textContent = tech;
                    techContainer.appendChild(span);
                });
            }
            
            if (githubLink && project.github) githubLink.href = project.github;
            if (demoLink && project.demo) demoLink.href = project.demo;
            
            console.log(`Updated existing project card: ${project.title}`);
        } else {
            // Create new project card for projects added via admin
            const newCard = document.createElement('div');
            newCard.className = 'project-card neon-box-glow';
            newCard.setAttribute('data-id', id);
            
            newCard.innerHTML = `
                <div class="project-header">
                    <h3>${project.title}</h3>
                    <a href="project-details.html?id=${id}" class="details-btn"><i class="fa-solid fa-circle-info"></i>&nbsp;Details</a>
                </div>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github || '#'}" class="${!project.github || project.github === '#' ? 'disabled-link' : ''}" onclick="${!project.github || project.github === '#' ? 'event.preventDefault(); alert(\'GitHub link not added yet\');' : ''}"><i class="fa-brands fa-github"></i> View Code</a>
                    <a href="${project.demo || '#'}" class="${!project.demo || project.demo === '#' ? 'disabled-link' : ''}" onclick="${!project.demo || project.demo === '#' ? 'event.preventDefault(); alert(\'Demo link not added yet\');' : ''}"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>
                </div>
            `;
            
            // Add the new card to the container
            projectsContainer.appendChild(newCard);
            
            // If it's beyond the first 3 projects, hide it initially
            if (parseInt(id) > 3) {
                newCard.classList.add('hidden');
                newCard.style.display = 'none';
            }
            
            console.log(`Created new project card: ${project.title} with ID: ${id}`);
        }
    });
    
    // Update skills from localStorage
    updateSkillsFromLocalStorage();
}

// Function to update skills from localStorage
function updateSkillsFromLocalStorage() {
    const storedSkills = JSON.parse(localStorage.getItem('skillsData'));
    if (!storedSkills) return;
    
    // Update skill boxes in the DOM
    Object.entries(storedSkills).forEach(([category, skills]) => {
        // Find the skill box with this category
        const skillBoxes = document.querySelectorAll('.skills-box');
        let categoryBox = null;
        
        skillBoxes.forEach(box => {
            const categoryTitle = box.querySelector('h3');
            if (categoryTitle && categoryTitle.textContent === category) {
                categoryBox = box;
            }
        });
        
        if (categoryBox) {
            // Update existing skill box
            const skillsContent = categoryBox.querySelector('.skills-content');
            if (skillsContent) {
                skillsContent.innerHTML = '';
                skills.forEach(skill => {
                    const span = document.createElement('span');
                    span.textContent = skill;
                    skillsContent.appendChild(span);
                });
            }
        } else {
            // Create new skill box for categories added via admin
            const skillsContainer = document.querySelector('.skills-container');
            if (skillsContainer) {
                const newBox = document.createElement('div');
                newBox.className = 'skills-box neon-box-glow';
                
                newBox.innerHTML = `
                    <i class="fas fa-tools"></i>
                    <h3>${category}</h3>
                    <div class="skills-content">
                        ${skills.map(skill => `<span>${skill}</span>`).join('')}
                    </div>
                `;
                
                // Add the new box to the container
                skillsContainer.appendChild(newBox);
            }
        }
    });
}