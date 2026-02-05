document.addEventListener('DOMContentLoaded', function() {
    // Dynamic greeting based on time
    const hour = new Date().getHours();
    let greeting = "Welcome to my portfolio!";
    if (hour < 12) {
        greeting = "Good morning! Welcome to my portfolio!";
    } else if (hour < 18) {
        greeting = "Good afternoon! Welcome to my portfolio!";
    } else {
        greeting = "Good evening! Welcome to my portfolio!";
    }
    document.getElementById('greeting').textContent = greeting;

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navHeight = document.getElementById('navbar').offsetHeight;
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - navHeight - 100)) {
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

    // Load projects from projects.json
    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            const projectsGrid = document.getElementById('projects-grid');
            data.projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                
                let associatedHtml = '';
                if (project.associated_with) {
                    associatedHtml = `<p class="project-associated"><i class="fas fa-building"></i> Associated with ${project.associated_with}</p>`;
                }
                
                let dateHtml = '';
                if (project.date) {
                    dateHtml = `<p class="project-date"><i class="fas fa-calendar"></i> ${project.date}</p>`;
                }
                
                projectCard.innerHTML = `
                    <div class="project-header">
                        <i class="fas fa-code"></i>
                    </div>
                    <div class="project-content">
                        <h3>${project.title}</h3>
                        ${dateHtml}
                        ${associatedHtml}
                        <p class="project-description">${project.description}</p>
                        <div class="tech-tags">
                            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            <a href="${project.github_url}" class="project-link" target="_blank"><i class="fab fa-github"></i> GitHub</a>
                        </div>
                    </div>
                `;
                projectsGrid.appendChild(projectCard);
            });
        })
        .catch(error => console.error('Error loading projects:', error));

    // Form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            if (name.length < 2) {
                alert('Please enter a valid name');
                e.preventDefault();
                return false;
            }
            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                e.preventDefault();
                return false;
            }
            if (message.length < 10) {
                alert('Message must be at least 10 characters');
                e.preventDefault();
                return false;
            }
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Dynamic year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
