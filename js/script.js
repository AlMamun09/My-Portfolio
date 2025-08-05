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

// Handle Admin link visibility and click based on authentication status
const adminLink = document.getElementById('admin-link');
if (adminLink) {
    // Check if user is logged in via session storage
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        // Show admin link and set click handler to go directly to admin dashboard
        adminLink.style.display = 'inline-block';
        adminLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'pages/admin.html';
        });
    } else {
        // Hide admin link when not logged in
        adminLink.style.display = 'none';
        
        // Add a hidden route for admin to access login page
        // Listen for '/admin' in the URL
        if (window.location.pathname.endsWith('/admin')) {
            window.location.href = 'pages/login.html';
        }
    }
}

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

// Import Firebase modules
import { db, collection, getDocs, query, onSnapshot, orderBy, limit } from './firebase-config.js';

// Projects Load More Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update projects and education from Firestore
    console.log('DOMContentLoaded: About to call updateProjectsFromFirestore');
    
    // Add visible indicator that JavaScript is working
    const testProjectsContainer = document.querySelector('.projects-container');
    if (testProjectsContainer) {
        testProjectsContainer.innerHTML = '<div style="color: red; font-size: 20px; text-align: center; padding: 20px;">JavaScript is executing! Attempting to load projects...</div>';
    }
    
    // Add a small delay to ensure Firebase is fully initialized
    setTimeout(() => {
        console.log('Calling updateProjectsFromFirestore after delay');
        
        // Test Firebase connection first
        if (testFirebaseConnection()) {
            setupProjectsListener();
            updateSkillsFromFirestore();
            updateEducationFromFirestore();
        } else {
            // Display clear error message if Firebase connection fails
            const projectsContainer = document.querySelector('.projects-container');
            if (projectsContainer) {
                projectsContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: #ff6b6b;">
                        <h3>Error Loading Projects</h3>
                        <p>Firebase connection failed. Please check your internet connection and try again.</p>
                        <button id="retry-connection" class="btn neon-glow">Retry Connection</button>
                    </div>
                `;
                
                // Add retry button functionality
                const retryBtn = document.getElementById('retry-connection');
                if (retryBtn) {
                    retryBtn.addEventListener('click', () => {
                        projectsContainer.innerHTML = '<div style="color: red; font-size: 20px; text-align: center; padding: 20px;">Retrying connection...</div>';
                        setTimeout(() => {
                            if (testFirebaseConnection()) {
                                setupProjectsListener();
                                updateSkillsFromFirestore();
                                updateEducationFromFirestore();
                            }
                        }, 1000);
                    });
                }
            }
        }
    }, 1000);
    
    const loadMoreBtn = document.getElementById('load-more-btn');
    const projectsContainer = document.querySelector('.projects-container');
    let projectsExpanded = false;
    let allProjects = [];
    
    console.log('DOM Content Loaded');
    console.log('Load More button found:', loadMoreBtn);
    console.log('Projects container found:', projectsContainer);
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            console.log('Load More button clicked, current state:', projectsExpanded);
            
            if (!projectsExpanded) {
                renderProjects(allProjects.length);
                loadMoreBtn.textContent = 'Show Less';
                projectsExpanded = true;
            } else {
                renderProjects(3);
                loadMoreBtn.textContent = 'Load More';
                projectsExpanded = false;

                // Scroll back to the projects section
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    window.scrollTo({
                        top: projectsSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
            updateButtonVisibility();
        });
    }

    function setupProjectsListener() {
        const projectsCollection = collection(db, 'projects');
        const q = query(projectsCollection);

        onSnapshot(q, (projectsSnapshot) => {
            allProjects = [];
            projectsSnapshot.forEach(doc => {
                allProjects.push({ id: doc.id, ...doc.data() });
            });

            // Sort projects by createdAt desc, falling back to updatedAt if createdAt is missing
            allProjects.sort((a, b) => {
                const dateA = a.createdAt ? a.createdAt.toMillis() : (a.updatedAt ? a.updatedAt.toMillis() : 0);
                const dateB = b.createdAt ? b.createdAt.toMillis() : (b.updatedAt ? b.updatedAt.toMillis() : 0);
                return dateB - dateA;
            });

            renderProjects(projectsExpanded ? allProjects.length : 3);
            updateButtonVisibility();
        });
    }

    function renderProjects(limitCount) {
        const loadingIndicator = document.getElementById('projects-loading');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }

        const projectsContainer = document.querySelector('.projects-container');
        if (!projectsContainer) return;

        // Clear existing projects
        projectsContainer.innerHTML = '';

        // Take only the first limitCount projects after sorting
        const displayedProjects = allProjects.slice(0, limitCount);

        // Create and append project cards
        displayedProjects.forEach((project, index) => {
            try {
                const newCard = createProjectCard(project, project.id, index);
                projectsContainer.appendChild(newCard);
                console.log(`Added project card: ${project.title || 'Untitled Project'}`);
            } catch (err) {
                console.error('Error creating project card:', err, 'Project:', project);
            }
        });
    }

    function updateButtonVisibility() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = (allProjects.length > 3) ? 'inline-block' : 'none';
        }
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
                // Using the configured service ID and template ID
                emailjs.send('service_mamun', 'template_portfolio', templateParams)
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
                    })
                    .catch(function(error) {
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

// Function to load sample projects as fallback
function loadSampleProjects(container) {
    const loadingElement = document.getElementById('projects-loading');
    if (loadingElement) loadingElement.style.display = 'none';
    
    // Clear container
    container.innerHTML = '';
    
    // Add a message indicating these are sample projects
    const messageDiv = document.createElement('div');
    messageDiv.className = 'sample-projects-message';
    messageDiv.innerHTML = `
        <div style="text-align: center; padding: 10px; margin-bottom: 20px; color: #ff6b6b;">
            <p>Unable to connect to the database. Showing sample projects instead.</p>
            <button id="retry-connection" class="btn neon-glow">Retry Connection</button>
        </div>
    `;
    container.appendChild(messageDiv);
    
    // Add sample projects
    sampleProjects.forEach((project, index) => {
        const card = createProjectCard(project, project.id, index);
        container.appendChild(card);
    });
    
    // Add retry button functionality
    const retryBtn = document.getElementById('retry-connection');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            if (loadingElement) loadingElement.style.display = 'block';
            container.innerHTML = '';
            container.appendChild(loadingElement);
            setTimeout(() => {
                updateProjectsFromFirestore(3);
            }, 1000);
        });
    }
    
    // Hide load more button since we're showing sample data
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}

// Test Firebase connection and collection access
function testFirebaseConnection() {
    try {
        console.log('Testing Firebase connection...');
        console.log('Database instance available:', !!db);
        
        if (!db) {
            console.error('Database instance is null or undefined');
            const projectsContainer = document.querySelector('.projects-container');
            
            if (projectsContainer) {
                console.log('Loading sample projects as fallback...');
                loadSampleProjects(projectsContainer);
            }
            return false;
        }
        
        // Test basic collection access
        const testCollection = collection(db, 'projects');
        console.log('Collection reference created:', !!testCollection);
        
        return true;
        
    } catch (error) {
        console.error('Firebase connection test failed:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        return false;
    }
}

// Sample projects data as fallback
const sampleProjects = [
    {
        id: 'sample1',
        title: 'Portfolio Website',
        description: 'A personal portfolio website built with HTML, CSS, and JavaScript.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Firebase'],
        github: 'https://github.com/almamun-cse/portfolio',
        demo: 'https://portfolio-almamun.web.app'
    },
    {
        id: 'sample2',
        title: 'E-commerce App',
        description: 'A full-featured e-commerce application with product listings and cart functionality.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        github: 'https://github.com/almamun-cse/ecommerce-app',
        demo: '#'
    },
    {
        id: 'sample3',
        title: 'Weather Dashboard',
        description: 'A weather dashboard that shows current and forecasted weather data.',
        technologies: ['JavaScript', 'API', 'Bootstrap', 'HTML/CSS'],
        github: 'https://github.com/almamun-cse/weather-app',
        demo: '#'
    }
];

// Function to load sample projects as fallback
// (keeping loadSampleProjects as is)

// Note: updateProjectsFromFirestore is replaced by setupProjectsListener and renderProjects

// Function to create a project card element
function createProjectCard(project, id, index = 0) {
    try {
        if (!project) {
            console.error('Project data is undefined or null');
            return document.createElement('div'); // Return empty div to avoid errors
        }
        
        const card = document.createElement('div');
        card.className = 'project-card neon-box-glow';
        card.setAttribute('data-id', id || 'unknown');

        // Log project data for debugging
        console.log('Creating project card:', {
            id: id,
            title: project.title,
            techCount: Array.isArray(project.technologies) ? project.technologies.length : 0
        });

        card.innerHTML = `
            <div class="project-header">
                <h3>${project.title || 'Untitled Project'}</h3>
                <a href="pages/project-details.html?id=${id}" class="details-btn"><i class="fa-solid fa-circle-info"></i>&nbsp;Details</a>
            </div>
            <p>${project.description || 'No description available'}</p>
            <div class="project-tech">
                ${Array.isArray(project.technologies) ? project.technologies.map(tech => `<span>${tech}</span>`).join('') : ''}
            </div>
            <div class="project-links">
                <a href="${project.github || '#'}" class="${!project.github || project.github === '#' ? 'disabled-link' : ''}" ${!project.github || project.github === '#' ? 'onclick="event.preventDefault(); alert(\'GitHub link not added yet\');"' : ''}><i class="fa-brands fa-github"></i> View Code</a>
                <a href="${project.demo || '#'}" class="${!project.demo || project.demo === '#' ? 'disabled-link' : ''}" ${!project.demo || project.demo === '#' ? 'onclick="event.preventDefault(); alert(\'Demo link not added yet\');"' : ''}><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>
            </div>
        `;

        return card;
    } catch (error) {
        console.error('Error creating project card:', error);
        const errorCard = document.createElement('div');
        errorCard.className = 'project-card neon-box-glow error-card';
        errorCard.innerHTML = `
            <div class="project-header">
                <h3>Error Loading Project</h3>
            </div>
            <p>There was an error loading this project. Please try refreshing the page.</p>
        `;
        return errorCard;
    }
}

// Function to update a project card with new data
function updateProjectCard(card, project) {
    const titleElement = card.querySelector('h3');
    const descriptionElement = card.querySelector('p');
    const techContainer = card.querySelector('.project-tech');
    const githubLink = card.querySelector('.project-links a:first-child');
    const demoLink = card.querySelector('.project-links a:last-child');

    if (titleElement) titleElement.textContent = project.title || 'Untitled Project';
    if (descriptionElement) descriptionElement.textContent = project.description || 'No description available';

    if (techContainer) {
        techContainer.innerHTML = '';
        if (Array.isArray(project.technologies)) {
            project.technologies.forEach(tech => {
                const span = document.createElement('span');
                span.textContent = tech;
                techContainer.appendChild(span);
            });
        }
    }

    if (githubLink) {
        githubLink.href = project.github || '#';
        if (!project.github || project.github === '#') {
            githubLink.classList.add('disabled-link');
            githubLink.setAttribute('onclick', "event.preventDefault(); alert('GitHub link not added yet');");
        } else {
            githubLink.classList.remove('disabled-link');
            githubLink.removeAttribute('onclick');
        }
    }

    if (demoLink) {
        demoLink.href = project.demo || '#';
        if (!project.demo || project.demo === '#') {
            demoLink.classList.add('disabled-link');
            demoLink.setAttribute('onclick', "event.preventDefault(); alert('Demo link not added yet');");
        } else {
            demoLink.classList.remove('disabled-link');
            demoLink.removeAttribute('onclick');
        }
    }
}

// Sample skills data as fallback
const sampleSkills = [
    { categoryName: 'Programming Languages', skillsList: ['Python', 'Java', 'C++', 'C', 'C#', 'Dart', 'HTML5', 'CSS3'] },
    { categoryName: 'Python Libraries', skillsList: ['TensorFlow', 'PyTorch', 'NumPy', 'Pandas', 'scikit-learn', 'HuggingFace Transformers'] },
    { categoryName: 'Databases', skillsList: ['MySQL', 'SQLite', 'Firebase', 'MongoDB'] },
    { categoryName: 'Tools & Platforms', skillsList: ['Google Colab', 'Android Studio', 'Flutter', 'Git & GitHub', 'Visual Studio Code', 'Jupyter Notebook'] }
];

// Function to load sample skills as fallback
function loadSampleSkills() {
    const skillsContainer = document.querySelector('.skills-container');
    if (!skillsContainer) return;
    
    skillsContainer.innerHTML = '';
    
    sampleSkills.forEach(categoryData => {
        const newBox = document.createElement('div');
        newBox.className = 'skills-box neon-box-glow';
        newBox.innerHTML = `
            <i class="fas fa-tools"></i>
            <h3>${categoryData.categoryName}</h3>
            <div class="skills-content">
                ${categoryData.skillsList.map(skill => `<span>${skill}</span>`).join('')}
            </div>
        `;
        skillsContainer.appendChild(newBox);
    });
}

// Function to update skills from Firestore
async function updateSkillsFromFirestore(maxItems = 10) {
    try {
        console.log('Attempting to fetch skills from Firestore...');
        const skillsCollection = collection(db, 'skills');
        console.log('Skills collection reference created');
        const q = query(skillsCollection, maxItems ? limit(maxItems) : limit(100));
        console.log('Skills query created');
        const skillsSnapshot = await getDocs(q);
        console.log('Skills snapshot received, doc count:', skillsSnapshot.size);
        
        if (skillsSnapshot.empty) {
            console.log('No skills found in Firestore, loading sample skills');
            loadSampleSkills();
            return;
        }
        
        const skillsByCategory = new Map();
        skillsSnapshot.forEach(doc => {
            const skillData = doc.data();
            if (skillData.categoryName && skillData.skillsList) {
                skillsByCategory.set(skillData.categoryName, skillData.skillsList);
            }
        });
        
        const skillsContainer = document.querySelector('.skills-container');
        if (skillsContainer) skillsContainer.innerHTML = '';
        
        skillsByCategory.forEach((skills, category) => {
            const newBox = document.createElement('div');
            newBox.className = 'skills-box neon-box-glow';
            newBox.innerHTML = `
                <i class="fas fa-tools"></i>
                <h3>${category}</h3>
                <div class="skills-content">
                    ${skills.map(skill => `<span>${skill}</span>`).join('')}
                </div>
            `;
            skillsContainer.appendChild(newBox);
        });
    } catch (error) {
        console.error('Error updating skills from Firestore:', error);
        loadSampleSkills();
    }
    // Update education from Firestore
    updateEducationFromFirestore();
}

// Sample education data as fallback
const sampleEducation = [
    { degree: 'B.Sc. in Computer Science & Engineering', institution: 'International University of Business Agriculture and Technology (IUBAT)', location: 'Dhaka, Bangladesh', gpa: 'CGPA: 3.87 / 4.00', status: 'Currently pursuing', year: '2022 – Present' },
    { degree: 'Higher Secondary Certificate (HSC)', institution: 'Shafiuddin Sarkar Academy & College', location: 'Gazipur, Bangladesh', gpa: 'GPA: 5.00 / 5.00', field: 'Group: Science', status: 'Completed', year: '2018 – 2020' }
];

// Function to load sample education as fallback
function loadSampleEducation() {
    const educationContainer = document.querySelector('.education-container');
    if (!educationContainer) return;
    
    educationContainer.innerHTML = '';
    
    sampleEducation.forEach((edu, index) => {
        const educationBox = document.createElement('div');
        educationBox.className = 'education-box neon-box-glow';
        educationBox.innerHTML = `
            <h3>${edu.degree}</h3>
            <h4>${edu.institution}</h4>
            <h5>${edu.location}</h5>
            ${edu.gpa ? `<p>${edu.gpa}</p>` : ''}
            ${edu.field ? `<p>${edu.field}</p>` : ''}
            ${edu.status ? `<p>${edu.status}</p>` : ''}
            <div class="year">${edu.year}</div>
        `;
        educationContainer.appendChild(educationBox);
        
        educationBox.style.animation = `fadeInUp 0.8s forwards ${0.2 + (index * 0.2)}s`;
    });
}

// Function to update education from Firestore
async function updateEducationFromFirestore(maxItems = 10) {
    try {
        console.log('Attempting to fetch education from Firestore...');
        const educationCollection = collection(db, 'education');
        console.log('Education collection reference created');
        const q = query(educationCollection, orderBy('year', 'desc'), maxItems ? limit(maxItems) : limit(100));
        console.log('Education query created');
        const educationSnapshot = await getDocs(q);
        console.log('Education snapshot received, doc count:', educationSnapshot.size);
        
        if (educationSnapshot.empty) {
            console.log('No education entries found in Firestore, loading sample education');
            loadSampleEducation();
            return;
        }
        
        const educationContainer = document.querySelector('.education-container');
        if (!educationContainer) return;
        
        educationContainer.innerHTML = '';
        
        educationSnapshot.forEach(doc => {
            const education = doc.data();
            const id = doc.id;
            
            const educationBox = document.createElement('div');
            educationBox.className = 'education-box neon-box-glow';
            educationBox.setAttribute('data-id', id);
            educationBox.innerHTML = `
                <h3>${education.degree}</h3>
                <h4>${education.institution}</h4>
                <h5>${education.location}</h5>
                ${education.gpa ? `<p>${education.gpa}</p>` : ''}
                ${education.field ? `<p>${education.field}</p>` : ''}
                ${education.status ? `<p>${education.status}</p>` : ''}
                <div class="year">${education.year}</div>
            `;
            educationContainer.appendChild(educationBox);
        });
        
        const educationBoxes = document.querySelectorAll('.education-box');
        educationBoxes.forEach((box, index) => {
            box.style.animation = `fadeInUp 0.8s forwards ${0.2 + (index * 0.2)}s`;
        });
    } catch (error) {
        console.error('Error updating education from Firestore:', error);
        loadSampleEducation();
    }
}