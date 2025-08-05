// Import Firebase modules
import { auth, db, signOut, onAuthStateChanged, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, onSnapshot } from '../js/firebase-config.js';

// Confirmation Dialog Utility
const confirmDialog = {
    dialog: null,
    titleEl: null,
    messageEl: null,
    confirmBtn: null,
    cancelBtn: null,
    resolvePromise: null,
    
    init() {
        this.dialog = document.getElementById('confirmation-dialog');
        this.titleEl = document.getElementById('dialog-title');
        this.messageEl = document.getElementById('dialog-message');
        this.confirmBtn = document.getElementById('dialog-confirm');
        this.cancelBtn = document.getElementById('dialog-cancel');
        
        this.cancelBtn.addEventListener('click', () => {
            this.close(false);
        });
        
        this.confirmBtn.addEventListener('click', () => {
            this.close(true);
        });
    },
    
    show(title, message) {
        if (!this.dialog) this.init();
        
        this.titleEl.textContent = title;
        this.messageEl.textContent = message;
        this.dialog.style.display = 'block';
        
        return new Promise(resolve => {
            this.resolvePromise = resolve;
        });
    },
    
    close(result) {
        this.dialog.style.display = 'none';
        if (this.resolvePromise) {
            this.resolvePromise(result);
            this.resolvePromise = null;
        }
    }
};

// Function to clean up all Firestore listeners
function cleanupFirestoreListeners() {
    if (unsubscribeProjects) {
        unsubscribeProjects();
        unsubscribeProjects = null;
    }
    
    if (unsubscribeSkills) {
        unsubscribeSkills();
        unsubscribeSkills = null;
    }
    
    if (unsubscribeEducation) {
        unsubscribeEducation();
        unsubscribeEducation = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
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
    
    // Clean up listeners when page is unloaded
    window.addEventListener('beforeunload', cleanupFirestoreListeners);

    // Admin Panel Navigation
    const adminNavItems = document.querySelectorAll('.admin-nav-item');
    const adminPanels = document.querySelectorAll('.admin-panel');

    adminNavItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all nav items and panels
            adminNavItems.forEach(navItem => navItem.classList.remove('active'));
            adminPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding panel
            item.classList.add('active');
            const targetPanel = document.getElementById(item.dataset.target);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    
    // Check authentication state when the page loads
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.email);
            // Display user email in settings
            const adminEmailInput = document.getElementById('admin-email');
            if (adminEmailInput) {
                adminEmailInput.value = user.email;
            }
            // Initialize the dashboard
            initAdminDashboard();
        } else {
            // User is signed out, redirect to login
            console.log('User is signed out');
            window.location.href = 'login.html';
        }
    });

    // Initialize Firebase collections
    const projectsCollection = collection(db, 'projects');
    const skillsCollection = collection(db, 'skills');
    const educationCollection = collection(db, 'education');
    
    // Default data to use if Firestore collections are empty
    let projectsData = {
        '1': {
            title: 'AI Chatbot Assistant',
            description: 'A conversational AI assistant built with PyTorch and Transformer models that can answer questions, provide recommendations, and assist with various tasks.',
            fullDescription: `<p>This AI Chatbot Assistant is a sophisticated natural language processing system designed to provide human-like interactions and assistance across various domains. Built using state-of-the-art deep learning techniques, the chatbot can understand context, remember conversation history, and generate relevant, helpful responses.</p>
            <p>The system utilizes a transformer-based architecture similar to GPT models, with custom fine-tuning for specific use cases. It can be deployed as a web service, integrated into mobile applications, or used as an API for third-party integrations.</p>`,
            technologies: ['Python', 'PyTorch', 'Transformers', 'Flask', 'NLTK', 'SpaCy', 'Redis', 'Docker'],
            features: [
                'Natural language understanding with context awareness',
                'Multi-turn conversation memory',
                'Domain-specific knowledge integration',
                'Sentiment analysis for emotional intelligence',
                'Multi-language support',
                'Voice input/output capabilities',
                'Customizable personality and tone'
            ],
            challenges: [
                'Optimizing model size for real-time responses',
                'Handling ambiguous queries and clarification',
                'Ensuring factual accuracy and preventing hallucinations',
                'Implementing effective content filtering'
            ],
            images: ['project1-1.jpg', 'project1-2.jpg'],
            github: '#',
            demo: '#'
        },
        '2': {
            title: 'Health Tracker App',
            description: 'A mobile application that helps users track their fitness goals, nutrition intake, and overall health metrics with personalized recommendations.',
            fullDescription: `<p>The Health Tracker App is a comprehensive mobile solution designed to help users monitor and improve their overall health and wellness. The application combines fitness tracking, nutrition logging, sleep analysis, and personalized recommendations into a single, user-friendly interface.</p>
            <p>Built with Flutter for cross-platform compatibility, the app leverages Firebase for backend services and TensorFlow Lite for on-device machine learning capabilities. This architecture ensures data privacy while providing powerful insights and recommendations tailored to each user's unique health profile.</p>`,
            technologies: ['Flutter', 'Dart', 'Firebase', 'TensorFlow Lite', 'Cloud Functions', 'SQLite', 'Provider State Management'],
            features: [
                'Personalized workout plans based on user goals',
                'Nutrition tracking with barcode scanning',
                'Sleep quality analysis and recommendations',
                'Water intake monitoring',
                'Health metrics visualization with interactive charts',
                'Goal setting and progress tracking',
                'Social sharing and community challenges'
            ],
            challenges: [
                'Ensuring accurate calorie and nutrient calculations',
                'Optimizing battery usage for all-day tracking',
                'Creating intuitive UI for complex health data',
                'Implementing secure health data storage'
            ],
            images: ['project2-1.jpg', 'project2-2.jpg'],
            github: '#',
            demo: '#'
        },
        '3': {
            title: 'Smart Home Dashboard',
            description: 'A web-based dashboard for monitoring and controlling smart home devices with real-time data visualization and automated routines.',
            fullDescription: `<p>The Smart Home Dashboard is a comprehensive web application that serves as a central control hub for IoT devices throughout the home. It provides users with real-time monitoring, control capabilities, and automation tools for managing their smart home ecosystem.</p>
            <p>Built with React for the frontend and Node.js for the backend, the dashboard integrates with various IoT protocols (including MQTT, Zigbee, and Z-Wave) to communicate with a wide range of smart devices. The system uses MongoDB for data storage and includes advanced features like energy usage analytics, security monitoring, and customizable automation routines.</p>`,
            technologies: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'MQTT', 'WebSockets', 'Chart.js', 'Material-UI'],
            features: [
                'Unified control interface for multiple device types',
                'Real-time device status monitoring',
                'Energy usage tracking and optimization suggestions',
                'Customizable automation routines and schedules',
                'Voice control integration (Alexa, Google Assistant)',
                'Mobile-responsive design for on-the-go control',
                'Multi-user access with permission levels'
            ],
            challenges: [
                'Ensuring compatibility with diverse IoT protocols',
                'Implementing secure device authentication',
                'Optimizing real-time data processing',
                'Creating intuitive automation tools for non-technical users'
            ],
            images: ['project3-1.jpg', 'project3-2.jpg'],
            github: '#',
            demo: '#'
        },
        '4': {
            title: 'Image Recognition System',
            description: 'A deep learning-based image recognition system that can identify objects, scenes, and faces with high accuracy using convolutional neural networks.',
            fullDescription: `<p>This Image Recognition System is a sophisticated computer vision solution capable of identifying and classifying various elements within digital images. Powered by deep learning algorithms, particularly convolutional neural networks (CNNs), the system can recognize objects, scenes, faces, and text with high accuracy.</p>
            <p>The core of the system is built with TensorFlow and Keras, utilizing transfer learning from pre-trained models like ResNet and EfficientNet to achieve excellent performance even with limited training data. OpenCV is used for image preprocessing and augmentation, while a Python Flask API enables easy integration with other applications.</p>`,
            technologies: ['Python', 'TensorFlow', 'OpenCV', 'Keras', 'NumPy', 'Flask', 'Docker', 'CUDA'],
            features: [
                'Multi-class object detection and classification',
                'Facial recognition with emotion analysis',
                'Scene understanding and context recognition',
                'Optical character recognition (OCR)',
                'Real-time video processing capabilities',
                'Customizable model training for specific domains',
                'REST API for third-party integration'
            ],
            challenges: [
                'Optimizing model performance for real-time processing',
                'Handling varying lighting conditions and image quality',
                'Ensuring privacy compliance for facial recognition',
                'Reducing false positives in complex scenes'
            ],
            images: ['project4-1.jpg', 'project4-2.jpg'],
            github: '#',
            demo: '#'
        },
        '5': {
            title: 'E-Commerce Platform',
            description: 'A full-featured e-commerce platform with product listings, shopping cart, payment processing, and admin dashboard for managing inventory and orders.',
            fullDescription: `<p>This E-Commerce Platform is a comprehensive online shopping solution designed to provide businesses with everything they need to sell products online. The platform includes both customer-facing storefronts and administrative tools for managing the business operations.</p>
            <p>Built with React for the frontend and Node.js (Express) for the backend, the platform uses MongoDB for flexible data storage. It includes features like secure payment processing, inventory management, order tracking, and analytics dashboards. The system is designed to be scalable, secure, and customizable for different business needs.</p>`,
            technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux', 'Stripe API', 'AWS S3', 'JWT Authentication'],
            features: [
                'Responsive product catalog with advanced filtering',
                'Secure user authentication and profile management',
                'Shopping cart and wishlist functionality',
                'Multiple payment gateway integrations',
                'Order tracking and history',
                'Admin dashboard for inventory and order management',
                'Analytics and sales reporting',
                'Email notification system'
            ],
            challenges: [
                'Implementing secure payment processing',
                'Optimizing database queries for large product catalogs',
                'Creating a responsive design for all device types',
                'Ensuring PCI compliance and data security'
            ],
            images: ['project5-1.jpg', 'project5-2.jpg'],
            github: '#',
            demo: '#'
        },
        '6': {
            title: 'Augmented Reality App',
            description: 'An AR application that overlays digital information on the real world, allowing users to interact with virtual objects in their physical environment.',
            fullDescription: `<p>This Augmented Reality App creates an immersive experience by overlaying digital content onto the real world through a mobile device's camera. Users can interact with virtual objects, access contextual information, and engage with their environment in new and innovative ways.</p>
            <p>Developed using Unity and C#, the application leverages ARCore (Android) and ARKit (iOS) to provide cross-platform functionality. The app includes features like surface detection, image tracking, and 3D object placement, creating a seamless blend between the digital and physical worlds.</p>`,
            technologies: ['Unity', 'C#', 'ARCore', 'ARKit', 'Blender', 'Shader Graph', 'Firebase', 'REST APIs'],
            features: [
                'Real-time surface detection and mapping',
                'Image and marker tracking capabilities',
                'Interactive 3D object placement and manipulation',
                'Physics-based interactions with virtual objects',
                'Location-based AR experiences',
                'Social sharing of AR creations',
                'Offline functionality for core features'
            ],
            challenges: [
                'Ensuring consistent tracking across different devices',
                'Optimizing 3D rendering for mobile performance',
                'Creating intuitive interactions for AR objects',
                'Handling varying lighting conditions and environments'
            ],
            images: ['project6-1.jpg', 'project6-2.jpg'],
            github: '#',
            demo: '#'
        }
    };

    // Default skills data to use if no data exists in Firestore
    let skillsData = {
        'Programming Languages': ['Python', 'Java', 'C++', 'C', 'C#', 'Dart', 'HTML5', 'CSS3'],
        'Python Libraries': ['TensorFlow', 'PyTorch', 'NumPy', 'Pandas', 'scikit-learn', 'HuggingFace Transformers'],
        'Databases': ['MySQL', 'SQLite', 'Firebase', 'MongoDB'],
        'Tools & Platforms': ['Google Colab', 'Android Studio', 'Flutter', 'Git & GitHub', 'Visual Studio Code', 'Jupyter Notebook']
    };
    
    // Default education data to use if no data exists in Firestore
    let educationData = {
        '1': {
            degree: 'B.Sc. in Computer Science & Engineering',
            institution: 'International University of Business Agriculture and Technology (IUBAT)',
            location: 'Dhaka, Bangladesh',
            gpa: 'CGPA: 3.87 / 4.00',
            field: '',
            status: 'Currently pursuing',
            year: '2022 – Present'
        },
        '2': {
            degree: 'Higher Secondary Certificate (HSC)',
            institution: 'Shafiuddin Sarkar Academy & College',
            location: 'Gazipur, Bangladesh',
            gpa: 'GPA: 5.00 / 5.00',
            field: 'Group: Science',
            status: '',
            year: '2018 – 2020'
        }
    };

    // Function to save data to Firestore is no longer needed as we're using individual save functions for each collection

    // Function to populate project table
async function populateProjectTable() {
    const tableBody = document.getElementById('project-table-body');
    if (!tableBody) return;
    
    // Clear the table body before populating
    tableBody.innerHTML = '';
    
    try {
        // Use the cached projectsData instead of making a new query
        Object.entries(projectsData).forEach(([id, project]) => {
            const row = document.createElement('tr');
            
            const techList = project.technologies.slice(0, 3).join(', ') + 
                (project.technologies.length > 3 ? '...' : '');
            
            row.innerHTML = `
                <td>${id}</td>
                <td>${project.title}</td>
                <td>${techList}</td>
                <td>
                    <button class="edit-btn" data-id="${id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
            
            // Use event delegation for edit and delete buttons
            // Remove any existing event listener
            if (tableBody._hasProjectListeners) {
                tableBody.removeEventListener('click', tableBody._projectClickHandler);
            }
            
            // Define the click handler function
            tableBody._projectClickHandler = function(e) {
                const target = e.target.closest('.edit-btn, .delete-btn');
                if (!target) return;
                
                const id = target.dataset.id;
                
                if (target.classList.contains('edit-btn')) {
                    editProject(id);
                } else if (target.classList.contains('delete-btn')) {
                    confirmDialog.show('Delete Project', 'Are you sure you want to delete this project?').then(confirmed => {
                        if (confirmed) {
                            deleteProject(id);
                        }
                    });
                }
            };
            
            // Add the event listener to the table body
            tableBody.addEventListener('click', tableBody._projectClickHandler);
            tableBody._hasProjectListeners = true;
        } catch (error) {
            console.error('Error getting projects: ', error);
        }
    }

    // Function to populate skill categories
async function populateSkillCategories() {
    const categoriesList = document.getElementById('skill-categories-list');
    if (!categoriesList) return;
    
    // Clear the categories list before populating
    categoriesList.innerHTML = '';
    
    try {
        // Use the cached skillsData instead of making a new query
        const categories = Object.keys(skillsData);
        
        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category;
            li.addEventListener('click', () => selectSkillCategory(category));
            categoriesList.appendChild(li);
        });
        } catch (error) {
            console.error('Error getting skill categories:', error);
        }
    }

    // Function to populate skills for a category
async function populateSkills(category) {
    const skillsList = document.getElementById('skills-list');
    const currentCategory = document.getElementById('current-category');
    if (!skillsList || !currentCategory) return;
    
    currentCategory.textContent = category;
    
    // Clear the skills list before populating
    skillsList.innerHTML = '';
    
    try {
        // Use the cached skillsData instead of making a new query
        if (!skillsData[category]) {
            console.log(`No skills found for category: ${category}`);
            return;
        }
        
        const skills = skillsData[category] || [];
        
        // Find the document ID for this category (needed for delete operations)
        let docId = '';
        const q = query(skillsCollection, where("categoryName", "==", category));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            docId = doc.id;
        });
            
            skills.forEach(skill => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${skill}</span>
                    <button class="delete-skill-btn" data-category="${category}" data-skill="${skill}" data-docid="${docId}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                skillsList.appendChild(li);
            });
            
            // Use event delegation for delete buttons
            // Remove any existing event listener
            if (skillsList._hasSkillListeners) {
                skillsList.removeEventListener('click', skillsList._skillClickHandler);
            }
            
            // Define the click handler function
            skillsList._skillClickHandler = function(e) {
                const target = e.target.closest('.delete-skill-btn');
                if (!target) return;
                
                const category = target.dataset.category;
                const skill = target.dataset.skill;
                const docId = target.dataset.docid;
                
                confirmDialog.show('Delete Skill', `Are you sure you want to delete the skill "${skill}"?`).then(confirmed => {
                    if (confirmed) {
                        deleteSkill(category, skill, docId);
                    }
                });
            };
            
            // Add the event listener to the skills list
            skillsList.addEventListener('click', skillsList._skillClickHandler);
            skillsList._hasSkillListeners = true;
        } catch (error) {
            console.error('Error getting skills:', error);
        }
    }

    // Function to select a skill category
    function selectSkillCategory(category) {
        document.querySelectorAll('#skill-categories-list li').forEach(li => {
            li.classList.remove('active');
            if (li.textContent === category) {
                li.classList.add('active');
            }
        });
        
        populateSkills(category);
    }

    // Function to add a new skill category
    async function addSkillCategory() {
        const newCategoryInput = document.getElementById('new-category-name');
        if (!newCategoryInput) return;
        
        const categoryName = newCategoryInput.value.trim();
        if (!categoryName) return;
        
        try {
            // Check if category already exists
            const q = query(skillsCollection, where("categoryName", "==", categoryName));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                alert('Category already exists!');
                return;
            }
            
            // Add new category to Firestore
            await addDoc(skillsCollection, {
                categoryName,
                skillsList: [],
                createdAt: new Date()
            });
            
            await populateSkillCategories();
            selectSkillCategory(categoryName);
            newCategoryInput.value = '';
            
            // Show success message
            confirmDialog.show('Success', `Category "${categoryName}" has been successfully added.`);
        } catch (error) {
            console.error('Error adding category:', error);
            confirmDialog.show('Error', `Failed to add category: ${error.message}. Please try again.`);
        }
    }

    // Function to add a new skill to a category
    async function addSkill() {
        const newSkillInput = document.getElementById('new-skill-name');
        const currentCategory = document.getElementById('current-category');
        if (!newSkillInput || !currentCategory) return;
        
        const skillName = newSkillInput.value.trim();
        const category = currentCategory.textContent;
        
        if (!skillName || !category) return;
        
        try {
            // Get the document for this category
            const q = query(skillsCollection, where("categoryName", "==", category));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                // Create new category with this skill
                await addDoc(skillsCollection, {
                    categoryName: category,
                    skillsList: [skillName],
                    createdAt: new Date()
                });
            } else {
                // Update existing category
                let docId;
                let skills = [];
                
                querySnapshot.forEach(doc => {
                    docId = doc.id;
                    skills = doc.data().skillsList || [];
                });
                
                if (skills.includes(skillName)) {
                    confirmDialog.show('Error', `Skill "${skillName}" already exists in the ${category} category!`);
                    return;
                }
                
                skills.push(skillName);
                
                const docRef = doc(db, 'skills', docId);
                await updateDoc(docRef, {
                    skillsList: skills,
                    updatedAt: new Date()
                });
            }
            
            await populateSkills(category);
            newSkillInput.value = '';
            
            // Show success message
            confirmDialog.show('Success', `Skill "${skillName}" has been successfully added to ${category}.`);
        } catch (error) {
            console.error('Error adding skill:', error);
            confirmDialog.show('Error', `Failed to add skill: ${error.message}. Please try again.`);
        }
    }

    // Function to delete a skill from a category
    async function deleteSkill(category, skill, docId) {
        try {
            const docRef = doc(db, 'skills', docId);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                console.error('Document not found');
                confirmDialog.show('Error', 'Skill category not found. It may have been deleted already.');
                return;
            }
            
            const skills = docSnap.data().skillsList || [];
            const updatedSkills = skills.filter(s => s !== skill);
            
            await updateDoc(docRef, {
                skillsList: updatedSkills,
                updatedAt: new Date()
            });
            
            await populateSkills(category);
            
            // Show success message
            confirmDialog.show('Success', `Skill "${skill}" has been successfully deleted from ${category}.`);
        } catch (error) {
            console.error('Error deleting skill:', error);
            confirmDialog.show('Error', `Failed to delete skill: ${error.message}. Please try again.`);
        }
    }

    // Function to show the project form for adding a new project
    function showAddProjectForm() {
        const formContainer = document.getElementById('project-form-container');
        const formTitle = document.getElementById('project-form-title');
        const form = document.getElementById('project-form');
        
        if (!formContainer || !formTitle || !form) return;
        
        formTitle.textContent = 'Add New Project';
        form.reset();
        document.getElementById('project-id').value = '';
        
        // We don't need to generate an ID as Firestore will do this for us
        // when we add a new document
        
        formContainer.classList.remove('hidden');
    }

    // Function to edit an existing project
    async function editProject(projectId) {
        try {
            // Get the project from Firestore
            const projectDoc = doc(db, 'projects', projectId);
            const projectSnapshot = await getDoc(projectDoc);
            
            if (!projectSnapshot.exists()) {
                console.error('Project not found');
                return;
            }
            
            const project = projectSnapshot.data();
            
            const formContainer = document.getElementById('project-form-container');
            const formTitle = document.getElementById('project-form-title');
            const form = document.getElementById('project-form');
            
            if (!formContainer || !formTitle || !form) return;
            
            formTitle.textContent = 'Edit Project';
            
            // Fill the form with project data
            document.getElementById('project-id').value = projectId;
            document.getElementById('project-title').value = project.title;
            document.getElementById('project-description').value = project.description;
            document.getElementById('project-full-description').value = project.fullDescription;
            document.getElementById('project-technologies').value = project.technologies.join(', ');
            document.getElementById('project-features').value = project.features.join('\n');
            document.getElementById('project-challenges').value = project.challenges.join('\n');
            document.getElementById('project-github').value = project.github;
            document.getElementById('project-demo').value = project.demo;
            
            formContainer.classList.remove('hidden');
        } catch (error) {
            console.error('Error editing project:', error);
            alert('Error loading project data. Please try again.');
        }
    }

    // Function to save a project (add or update)
    async function saveProject(e) {
        e.preventDefault();
        
        try {
            const projectId = document.getElementById('project-id').value;
            const title = document.getElementById('project-title').value;
            const description = document.getElementById('project-description').value;
            const fullDescription = document.getElementById('project-full-description').value;
            const technologies = document.getElementById('project-technologies').value.split(',').map(tech => tech.trim());
            const features = document.getElementById('project-features').value.split('\n').filter(feature => feature.trim());
            const challenges = document.getElementById('project-challenges').value.split('\n').filter(challenge => challenge.trim());
            const github = document.getElementById('project-github').value;
            const demo = document.getElementById('project-demo').value;
            
            const projectData = {
                title,
                description,
                fullDescription,
                technologies,
                features,
                challenges,
                github,
                demo,
                updatedAt: new Date()
            };
            
            if (projectId) {
                // Update existing project
                const projectDoc = doc(db, 'projects', projectId);
                // Preserve the images array if it exists
                const snapshot = await getDoc(projectDoc);
                if (snapshot.exists()) {
                    projectData.images = snapshot.data().images || [`project-${projectId}.jpg`];
                } else {
                    projectData.images = [`project-${projectId}.jpg`];
                }
                await updateDoc(projectDoc, projectData);
            } else {
                // Add new project
                projectData.createdAt = new Date();
                projectData.images = ['project-default.jpg'];
                await addDoc(projectsCollection, projectData);
            }
            
            // Update the UI
            await populateProjectTable();
            
            // Hide the form
            document.getElementById('project-form-container').classList.add('hidden');
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error saving project. Please try again.');
        }
    }

    // Function to delete a project
    async function deleteProject(projectId) {
        try {
            const projectDoc = doc(db, 'projects', projectId);
            const projectSnapshot = await getDoc(projectDoc);
            
            if (!projectSnapshot.exists()) {
                console.error('Project not found');
                confirmDialog.show('Error', 'Project not found. It may have been deleted already.');
                return;
            }
            
            // Delete from Firestore
            await deleteDoc(projectDoc);
            
            // Update the UI
            await populateProjectTable();
            
            // Show success message
            const projectData = projectSnapshot.data();
            const projectTitle = projectData.title || 'Unknown';
            confirmDialog.show('Success', `Project "${projectTitle}" has been successfully deleted.`);
        } catch (error) {
            console.error('Error deleting project:', error);
            confirmDialog.show('Error', `Failed to delete project: ${error.message}. Please try again.`);
        }
    }

    // Function to save settings
    function saveSettings() {
        alert('Password changes are managed through Firebase Authentication. Please contact the administrator for password resets.');
    }
    
    // Function to logout
    async function logout() {
        try {
            await signOut(auth);
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminEmail');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Error signing out. Please try again.');
        }
    }

    // Function to populate education table
async function populateEducationTable() {
    const tableBody = document.getElementById('education-table-body');
    if (!tableBody) return;
    
    // Clear the table body before populating
    tableBody.innerHTML = '';
    
    try {
        // Use the cached educationData instead of making a new query
        Object.entries(educationData).forEach(([id, education]) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${id}</td>
                <td>${education.degree}</td>
                <td>${education.institution}</td>
                <td>
                    <button class="edit-education-btn" data-id="${id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-education-btn" data-id="${id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
            
            // Use event delegation for edit and delete buttons
            // Remove any existing event listener
            if (tableBody._hasEducationListeners) {
                tableBody.removeEventListener('click', tableBody._educationClickHandler);
            }
            
            // Define the click handler function
            tableBody._educationClickHandler = function(e) {
                const target = e.target.closest('.edit-education-btn, .delete-education-btn');
                if (!target) return;
                
                const id = target.dataset.id;
                
                if (target.classList.contains('edit-education-btn')) {
                    editEducation(id);
                } else if (target.classList.contains('delete-education-btn')) {
                    confirmDialog.show('Delete Education', 'Are you sure you want to delete this education entry?').then(confirmed => {
                        if (confirmed) {
                            deleteEducation(id);
                        }
                    });
                }
            };
            
            // Add the event listener to the table body
            tableBody.addEventListener('click', tableBody._educationClickHandler);
            tableBody._hasEducationListeners = true;
        } catch (error) {
            console.error('Error getting education data:', error);
        }
    }
    
    // Function to show the education form for adding a new education entry
    function showAddEducationForm() {
        const formContainer = document.getElementById('education-form-container');
        const formTitle = document.getElementById('education-form-title');
        const form = document.getElementById('education-form');
        
        if (!formContainer || !formTitle || !form) return;
        
        formTitle.textContent = 'Add New Education';
        form.reset();
        
        // Generate a new ID (max ID + 1)
        const ids = Object.keys(educationData).map(id => parseInt(id));
        const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
        document.getElementById('education-id').value = newId;
        
        formContainer.classList.remove('hidden');
    }
    
    // Function to edit an education entry
    async function editEducation(id) {
        const formContainer = document.getElementById('education-form-container');
        const formTitle = document.getElementById('education-form-title');
        const form = document.getElementById('education-form');
        
        if (!formContainer || !formTitle || !form) return;
        
        try {
            const educationDoc = doc(db, 'education', id);
            const educationSnapshot = await getDoc(educationDoc);
            
            if (!educationSnapshot.exists()) {
                console.error('Education document not found');
                return;
            }
            
            const education = educationSnapshot.data();
            formTitle.textContent = 'Edit Education';
            
            document.getElementById('education-id').value = id;
            document.getElementById('education-degree').value = education.degree;
            document.getElementById('education-institution').value = education.institution;
            document.getElementById('education-location').value = education.location;
            document.getElementById('education-gpa').value = education.gpa.replace(/^(CGPA|GPA): /, '');
            document.getElementById('education-field').value = education.field.replace(/^Group: /, '');
            document.getElementById('education-status').value = education.status;
            document.getElementById('education-year').value = education.year;
            
            formContainer.classList.remove('hidden');
        } catch (error) {
            console.error('Error editing education:', error);
            alert('Error loading education data. Please try again.');
        }
    }
    
    // Function to delete an education entry
    async function deleteEducation(id) {
        try {
            const educationDoc = doc(db, 'education', id);
            const educationSnapshot = await getDoc(educationDoc);
            
            if (!educationSnapshot.exists()) {
                console.error('Education entry not found');
                confirmDialog.show('Error', 'Education entry not found. It may have been deleted already.');
                return;
            }
            
            // Get education data for success message
            const educationData = educationSnapshot.data();
            const degreeName = educationData.degree || 'Unknown';
            const institutionName = educationData.institution || 'Unknown';
            
            // Delete from Firestore
            await deleteDoc(educationDoc);
            
            // Update the UI
            await populateEducationTable();
            
            // Show success message
            confirmDialog.show('Success', `Education entry "${degreeName} at ${institutionName}" has been successfully deleted.`);
        } catch (error) {
            console.error('Error deleting education:', error);
            confirmDialog.show('Error', `Failed to delete education entry: ${error.message}. Please try again.`);
        }
    }
    
    // Function to save an education entry (add or update)
    async function saveEducation(e) {
        e.preventDefault();
        
        try {
            const educationId = document.getElementById('education-id').value;
            const degree = document.getElementById('education-degree').value;
            const institution = document.getElementById('education-institution').value;
            const location = document.getElementById('education-location').value;
            const gpa = document.getElementById('education-gpa').value;
            const field = document.getElementById('education-field').value;
            const status = document.getElementById('education-status').value;
            const year = document.getElementById('education-year').value;
            
            const educationData = {
                degree,
                institution,
                location,
                gpa: gpa ? (gpa.includes('/') ? `${gpa.includes('CGPA') ? 'CGPA' : 'GPA'}: ${gpa}` : `${gpa.includes('CGPA') ? 'CGPA' : 'GPA'}: ${gpa}`) : '',
                field: field ? (field.includes('Group') ? field : `Group: ${field}`) : '',
                status,
                year,
                updatedAt: new Date()
            };
            
            if (educationId) {
                // Update existing education
                const educationDoc = doc(db, 'education', educationId);
                await updateDoc(educationDoc, educationData);
            } else {
                // Add new education
                educationData.createdAt = new Date();
                await addDoc(educationCollection, educationData);
            }
            
            // Update the UI
            await populateEducationTable();
            
            // Hide the form
            document.getElementById('education-form-container').classList.add('hidden');
        } catch (error) {
            console.error('Error saving education:', error);
            alert('Error saving education data. Please try again.');
        }
    }
    
    // Variables to store unsubscribe functions for onSnapshot listeners
let unsubscribeProjects = null;
let unsubscribeSkills = null;
let unsubscribeEducation = null;

// Initialize the admin dashboard
async function initAdminDashboard() {
    try {
        // Load data from Firestore with onSnapshot listeners
        // These will automatically update the UI when data changes
        await loadProjectsFromFirestore();
        await loadSkillsFromFirestore();
        await loadEducationFromFirestore();
        
        // Note: We don't need to call populate functions here
        // as they are now called by the onSnapshot listeners
            
            // Add event listeners
            document.getElementById('add-project-btn')?.addEventListener('click', showAddProjectForm);
            document.getElementById('cancel-project-btn')?.addEventListener('click', () => {
                document.getElementById('project-form-container').classList.add('hidden');
            });
            document.getElementById('project-form')?.addEventListener('submit', saveProject);
            document.getElementById('add-category-btn')?.addEventListener('click', addSkillCategory);
            document.getElementById('add-skill-btn')?.addEventListener('click', addSkill);
            document.getElementById('add-education-btn')?.addEventListener('click', showAddEducationForm);
            document.getElementById('cancel-education-btn')?.addEventListener('click', () => {
                document.getElementById('education-form-container').classList.add('hidden');
            });
            document.getElementById('education-form')?.addEventListener('submit', saveEducation);
            document.getElementById('save-settings-btn')?.addEventListener('click', saveSettings);
            document.getElementById('logout-btn')?.addEventListener('click', logout);
        } catch (error) {
            console.error('Error initializing dashboard:', error);
            alert('Error loading data. Please try again later.');
        }
    }
    
    // Function to load projects from Firestore
async function loadProjectsFromFirestore() {
    try {
        // Unsubscribe from previous listener if exists
        if (unsubscribeProjects) {
            unsubscribeProjects();
        }
        
        // Set up new onSnapshot listener
        unsubscribeProjects = onSnapshot(projectsCollection, (querySnapshot) => {
            projectsData = {};
            querySnapshot.forEach((doc) => {
                projectsData[doc.id] = doc.data();
            });
            
            // Update UI when data changes
            populateProjectTable();
        }, (error) => {
            console.error('Error in projects snapshot listener:', error);
        });
        
        // Initial load with getDocs for backward compatibility
        const querySnapshot = await getDocs(projectsCollection);
        if (querySnapshot.empty && Object.keys(projectsData).length > 0) {
            // If no projects in Firestore, initialize with default data
            for (const [id, project] of Object.entries(projectsData)) {
                await addDoc(projectsCollection, {
                    ...project
                    // Removed id field to prevent duplication
                });
            }
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        throw error;
    }
    }
    
    // Function to load skills from Firestore
async function loadSkillsFromFirestore() {
    try {
        // Unsubscribe from previous listener if exists
        if (unsubscribeSkills) {
            unsubscribeSkills();
        }
        
        // Set up new onSnapshot listener
        unsubscribeSkills = onSnapshot(skillsCollection, (querySnapshot) => {
            skillsData = {};
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                skillsData[data.categoryName] = data.skillsList;
            });
            
            // Update UI when data changes
            populateSkillCategories();
            const firstCategory = Object.keys(skillsData)[0];
            if (firstCategory) {
                selectSkillCategory(firstCategory);
            }
        }, (error) => {
            console.error('Error in skills snapshot listener:', error);
        });
        
        // Initial load with getDocs for backward compatibility
        const querySnapshot = await getDocs(skillsCollection);
        if (querySnapshot.empty && Object.keys(skillsData).length > 0) {
            // If no skills in Firestore, initialize with default data
            for (const [categoryName, skillsList] of Object.entries(skillsData)) {
                await addDoc(skillsCollection, {
                    categoryName,
                    skillsList
                });
            }
        }
    } catch (error) {
        console.error('Error loading skills:', error);
        throw error;
    }
    }
    
    // Function to load education from Firestore
async function loadEducationFromFirestore() {
    try {
        // Unsubscribe from previous listener if exists
        if (unsubscribeEducation) {
            unsubscribeEducation();
        }
        
        // Set up new onSnapshot listener
        unsubscribeEducation = onSnapshot(educationCollection, (querySnapshot) => {
            educationData = {};
            querySnapshot.forEach((doc) => {
                educationData[doc.id] = doc.data();
            });
            
            // Update UI when data changes
            populateEducationTable();
        }, (error) => {
            console.error('Error in education snapshot listener:', error);
        });
        
        // Initial load with getDocs for backward compatibility
        const querySnapshot = await getDocs(educationCollection);
        if (querySnapshot.empty && Object.keys(educationData).length > 0) {
            // If no education in Firestore, initialize with default data
            for (const [id, education] of Object.entries(educationData)) {
                await addDoc(educationCollection, {
                    ...education
                    // Removed id field to prevent duplication
                });
            }
        }
    } catch (error) {
        console.error('Error loading education:', error);
        throw error;
    }
    }

    // Check for admin password and redirect if not authenticated
    function checkAdminAccess() {
        // Check if user is logged in via session storage
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        
        if (isLoggedIn) {
            // User is authenticated, initialize the dashboard
            initAdminDashboard();
        } else {
            // User is not authenticated, redirect to login page
            window.location.href = 'login.html';
        }
    }

    // Start the admin dashboard
    checkAdminAccess();
});
