document.addEventListener('DOMContentLoaded', () => {
    // Get the project ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    // Load project data from localStorage if available, otherwise use default data
    const projectsData = JSON.parse(localStorage.getItem('projectsData')) || {
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
    
    // Get the project content container
    const projectContent = document.getElementById('project-content');
    
    // If project ID exists and is valid
    if (projectId && projectsData[projectId]) {
        const project = projectsData[projectId];
        
        // Create HTML content for the project details
        const content = `
            <h2 class="heading">${project.title} <span class="neon-glow">Details</span></h2>
            
            <div class="project-image">
                <img src="project-${projectId}.jpg" alt="${project.title}" class="neon-box-glow">
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
                <a href="index.html#projects" class="btn neon-glow">Back to Projects</a>
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