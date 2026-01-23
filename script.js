// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks) {
                navLinks.classList.remove('active');
                if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
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
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Load Projects Dynamically
    async function loadProjects() {
        try {
            const container = document.getElementById('projects-container');
            if (!container) return;
            
            // Default projects
            const defaultProjects = [
                {
                    id: 1,
                    title: "Portfolio Website",
                    description: "Responsive portfolio website built with HTML, CSS, and JavaScript.",
                    technologies: ["HTML5", "CSS3", "JavaScript", "Git"],
                    github: "https://github.com/randikanawarathne/randikanawarathne.github.io",
                    live: "https://randikanawarathne.github.io"
                },
                {
                    id: 2,
                    title: "E-commerce Platform",
                    description: "Full-featured online store with PHP and MySQL.",
                    technologies: ["PHP", "MySQL", "JavaScript", "Bootstrap"],
                    github: "#",
                    live: "#"
                }
            ];
            
            // Display projects
            container.innerHTML = '';
            
            defaultProjects.forEach(project => {
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
            
        } catch (error) {
            console.log('Error loading projects:', error);
        }
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
    
    // Initialize everything
    loadProjects();
    initCodeTabs();
});