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

    // Load projects data from localStorage or use default data
    let projectsData = JSON.parse(localStorage.getItem('projectsData')) || {
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

    // Load skills data from localStorage or use default data
    let skillsData = JSON.parse(localStorage.getItem('skillsData')) || {
        'Programming Languages': ['Python', 'Java', 'C++', 'C', 'C#', 'Dart', 'HTML5', 'CSS3'],
        'Python Libraries': ['TensorFlow', 'PyTorch', 'NumPy', 'Pandas', 'scikit-learn', 'HuggingFace Transformers'],
        'Databases': ['MySQL', 'SQLite', 'Firebase', 'MongoDB'],
        'Tools & Platforms': ['Google Colab', 'Android Studio', 'Flutter', 'Git & GitHub', 'Visual Studio Code', 'Jupyter Notebook']
    };

    // Function to save data to localStorage
    function saveData() {
        localStorage.setItem('projectsData', JSON.stringify(projectsData));
        localStorage.setItem('skillsData', JSON.stringify(skillsData));
    }

    // Function to populate project table
    function populateProjectTable() {
        const tableBody = document.getElementById('project-table-body');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
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
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editProject(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteProject(btn.dataset.id));
        });
    }

    // Function to populate skill categories
    function populateSkillCategories() {
        const categoriesList = document.getElementById('skill-categories-list');
        if (!categoriesList) return;
        
        categoriesList.innerHTML = '';
        
        Object.keys(skillsData).forEach(category => {
            const li = document.createElement('li');
            li.textContent = category;
            li.addEventListener('click', () => selectSkillCategory(category));
            categoriesList.appendChild(li);
        });
    }

    // Function to populate skills for a category
    function populateSkills(category) {
        const skillsList = document.getElementById('skills-list');
        const currentCategory = document.getElementById('current-category');
        if (!skillsList || !currentCategory) return;
        
        currentCategory.textContent = category;
        skillsList.innerHTML = '';
        
        skillsData[category].forEach(skill => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${skill}</span>
                <button class="delete-skill-btn" data-category="${category}" data-skill="${skill}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            skillsList.appendChild(li);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-skill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteSkill(btn.dataset.category, btn.dataset.skill);
            });
        });
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
    function addSkillCategory() {
        const newCategoryInput = document.getElementById('new-category-name');
        if (!newCategoryInput) return;
        
        const categoryName = newCategoryInput.value.trim();
        if (categoryName && !skillsData[categoryName]) {
            skillsData[categoryName] = [];
            saveData();
            populateSkillCategories();
            selectSkillCategory(categoryName);
            newCategoryInput.value = '';
        }
    }

    // Function to add a new skill to a category
    function addSkill() {
        const newSkillInput = document.getElementById('new-skill-name');
        const currentCategory = document.getElementById('current-category');
        if (!newSkillInput || !currentCategory) return;
        
        const skillName = newSkillInput.value.trim();
        const category = currentCategory.textContent;
        
        if (skillName && category && !skillsData[category].includes(skillName)) {
            skillsData[category].push(skillName);
            saveData();
            populateSkills(category);
            newSkillInput.value = '';
        }
    }

    // Function to delete a skill from a category
    function deleteSkill(category, skill) {
        if (confirm(`Are you sure you want to delete the skill "${skill}"?`)) {
            skillsData[category] = skillsData[category].filter(s => s !== skill);
            saveData();
            populateSkills(category);
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
        
        // Generate a new project ID (max ID + 1)
        const projectIds = Object.keys(projectsData).map(id => parseInt(id));
        const newId = projectIds.length > 0 ? Math.max(...projectIds) + 1 : 1;
        document.getElementById('project-id').value = newId;
        
        formContainer.classList.remove('hidden');
    }

    // Function to edit an existing project
    function editProject(projectId) {
        const project = projectsData[projectId];
        if (!project) return;
        
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
    }

    // Function to save a project (add or update)
    function saveProject(e) {
        e.preventDefault();
        
        const projectId = document.getElementById('project-id').value;
        const title = document.getElementById('project-title').value;
        const description = document.getElementById('project-description').value;
        const fullDescription = document.getElementById('project-full-description').value;
        const technologies = document.getElementById('project-technologies').value.split(',').map(tech => tech.trim());
        const features = document.getElementById('project-features').value.split('\n').filter(feature => feature.trim());
        const challenges = document.getElementById('project-challenges').value.split('\n').filter(challenge => challenge.trim());
        const github = document.getElementById('project-github').value;
        const demo = document.getElementById('project-demo').value;
        
        // Create or update project
        projectsData[projectId] = {
            title,
            description,
            fullDescription,
            technologies,
            features,
            challenges,
            images: projectsData[projectId]?.images || [`project-${projectId}.jpg`],
            github,
            demo
        };
        
        saveData();
        populateProjectTable();
        
        // Hide the form
        document.getElementById('project-form-container').classList.add('hidden');
    }

    // Function to delete a project
    function deleteProject(projectId) {
        if (confirm(`Are you sure you want to delete the project "${projectsData[projectId].title}"?`)) {
            delete projectsData[projectId];
            saveData();
            populateProjectTable();
        }
    }

    // Function to save settings
    function saveSettings() {
        const password = document.getElementById('admin-password').value;
        if (password) {
            localStorage.setItem('adminPassword', password);
            alert('Settings saved successfully!');
            document.getElementById('admin-password').value = '';
        }
    }

    // Initialize the admin dashboard
    function initAdminDashboard() {
        // Populate project table
        populateProjectTable();
        
        // Populate skill categories and select the first one
        populateSkillCategories();
        const firstCategory = Object.keys(skillsData)[0];
        if (firstCategory) {
            selectSkillCategory(firstCategory);
        }
        
        // Add event listeners
        document.getElementById('add-project-btn')?.addEventListener('click', showAddProjectForm);
        document.getElementById('cancel-project-btn')?.addEventListener('click', () => {
            document.getElementById('project-form-container').classList.add('hidden');
        });
        document.getElementById('project-form')?.addEventListener('submit', saveProject);
        document.getElementById('add-category-btn')?.addEventListener('click', addSkillCategory);
        document.getElementById('add-skill-btn')?.addEventListener('click', addSkill);
        document.getElementById('save-settings-btn')?.addEventListener('click', saveSettings);
    }

    // Check for admin password
    function checkAdminAccess() {
        const storedPassword = localStorage.getItem('adminPassword');
        
        if (!storedPassword) {
            // First time setup - set a default password
            const defaultPassword = 'admin123';
            localStorage.setItem('adminPassword', defaultPassword);
            alert(`Welcome to the Admin Dashboard!\nYour default password is: ${defaultPassword}\nPlease change it in the Settings panel.`);
            initAdminDashboard();
        } else {
            // Prompt for password
            const enteredPassword = prompt('Enter admin password:');
            if (enteredPassword === storedPassword) {
                initAdminDashboard();
            } else {
                alert('Incorrect password!');
                window.location.href = 'index.html';
            }
        }
    }

    // Start the admin dashboard
    checkAdminAccess();
});