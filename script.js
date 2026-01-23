// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update Footer Year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Active Nav Link on Scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
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
    
    // Load Projects Dynamically
    async function loadProjects() {
        try {
            // Try to load from projects.json
            const response = await fetch('projects.json');
            const data = await response.json();
            displayProjects(data.projects);
        } catch (error) {
            console.log('Using default projects');
            // Default projects if JSON file doesn't exist
            const defaultProjects = [
                {
                    id: 1,
                    title: "Portfolio Website",
                    description: "Responsive portfolio website built with HTML, CSS, and JavaScript. Features dynamic content loading and smooth animations.",
                    technologies: ["HTML5", "CSS3", "JavaScript", "Git"],
                    github: "https://github.com/randikanwarathne/randikanwarathne.github.io",
                    live: "https://randikanwarathne.github.io",
                    image: "project1"
                },
                {
                    id: 2,
                    title: "E-commerce Platform",
                    description: "Full-featured online store with shopping cart and payment integration using PHP and MySQL.",
                    technologies: ["PHP", "MySQL", "JavaScript", "Bootstrap"],
                    github: "#",
                    live: "#",
                    image: "project2"
                },
                {
                    id: 3,
                    title: "Weather Dashboard",
                    description: "Real-time weather application using OpenWeather API with interactive charts and location detection.",
                    technologies: ["JavaScript", "API", "Chart.js", "CSS3"],
                    github: "#",
                    live: "#",
                    image: "project3"
                }
            ];
            displayProjects(defaultProjects);
        }
    }
    
    function displayProjects(projects) {
        const container = document.getElementById('projects-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <i class="fas fa-code"></i>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => 
                            `<span>${tech}</span>`
                        ).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.github}" target="_blank" class="btn">GitHub</a>
                        <a href="${project.live}" target="_blank" class="btn secondary">Live Demo</a>
                    </div>
                </div>
            `;
            
            container.appendChild(projectCard);
        });
    }
    
    // Code Tabs Functionality
    function initCodeTabs() {
        const tabs = document.querySelectorAll('.code-tab');
        const examples = document.querySelectorAll('.code-example');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and examples
                tabs.forEach(t => t.classList.remove('active'));
                examples.forEach(e => e.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding example
                const language = tab.getAttribute('data-language');
                const targetExample = document.querySelector(`.code-example[data-language="${language}"]`);
                
                if (targetExample) {
                    targetExample.classList.add('active');
                }
            });
        });
    }
    
    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                alert(`Thank you for subscribing with: ${email}`);
                this.reset();
            }
        });
    }
    
    // Form Validation
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const message = this.querySelector('textarea[name="message"]').value;
            
            if (!name || !email || !message) {
                e.preventDefault();
                alert('Please fill in all fields');
                return false;
            }
            
            if (!validateEmail(email)) {
                e.preventDefault();
                alert('Please enter a valid email address');
                return false;
            }
        });
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Initialize everything
    loadProjects();
    initCodeTabs();
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});