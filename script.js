document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const navBar = document.getElementById('navbar');
    const themeToggle = document.getElementById('theme-toggle');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksWrap = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    const toast = document.getElementById('toast');
    const greeting = document.getElementById('greeting');
    const projectSearch = document.getElementById('project-search');
    const filterGroup = document.getElementById('filter-group');
    const projectsGrid = document.getElementById('projects-grid');
    const emptyState = document.getElementById('empty-state');
    const skillMeters = document.querySelectorAll('.skill-meter');

    let allProjects = [];
    let activeFilter = 'all';
    let searchTerm = '';

    const iconMap = {
        security: 'fas fa-shield-halved',
        ai: 'fas fa-brain',
        web: 'fas fa-laptop-code',
        automation: 'fas fa-gears',
        data: 'fas fa-chart-line'
    };

    const showToast = message => {
        if (!toast) {
            return;
        }
        toast.textContent = message;
        toast.classList.add('show');
        window.clearTimeout(showToast.timeoutId);
        showToast.timeoutId = window.setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    };

    const setGreeting = () => {
        if (!greeting) {
            return;
        }
        const hour = new Date().getHours();
        if (hour < 12) {
            greeting.textContent = 'Good morning. Welcome to my digital workspace.';
        } else if (hour < 18) {
            greeting.textContent = 'Good afternoon. Here is a snapshot of how I build and think.';
        } else {
            greeting.textContent = 'Good evening. Thanks for exploring my work.';
        }
    };

    const setTheme = theme => {
        body.classList.toggle('theme-light', theme === 'light');
        body.classList.toggle('theme-dark', theme !== 'light');
        localStorage.setItem('portfolio-theme', theme);

        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            const label = themeToggle.querySelector('span');
            const isLight = theme === 'light';
            icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
            label.textContent = isLight ? 'Light Mode' : 'Dark Mode';
        }
    };

    const initTheme = () => {
        const savedTheme = localStorage.getItem('portfolio-theme');
        const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        setTheme(savedTheme || (systemLight ? 'light' : 'dark'));
    };

    const closeMobileMenu = () => {
        if (!navLinksWrap || !mobileToggle) {
            return;
        }
        navLinksWrap.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
    };

    const scrollToSection = targetSelector => {
        const target = document.querySelector(targetSelector);
        if (!target || !navBar) {
            return;
        }
        const navOffset = navBar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            scrollToSection(link.getAttribute('href'));
            closeMobileMenu();
        });
    });

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nextTheme = body.classList.contains('theme-light') ? 'dark' : 'light';
            setTheme(nextTheme);
        });
    }

    if (mobileToggle && navLinksWrap) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navLinksWrap.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    document.querySelectorAll('.float').forEach((element, index) => {
        let angle = index * 1.2;
        window.setInterval(() => {
            angle += 0.03;
            element.style.transform = `translateY(${Math.sin(angle) * 10}px)`;
        }, 20);
    });

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', event => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });

    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                entry.target.classList.toggle('active', entry.isIntersecting);

                if (entry.isIntersecting && entry.target.classList.contains('skill-card')) {
                    const meter = entry.target.querySelector('.skill-meter');
                    const fill = entry.target.querySelector('.skill-meter-fill');
                    if (meter && fill) {
                        fill.style.width = `${meter.dataset.level}%`;
                    }
                }
            });
        },
        { threshold: 0.18 }
    );

    document.querySelectorAll('.reveal').forEach(element => {
        revealObserver.observe(element);
    });

    const counterObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                }

                const counter = entry.target;
                const target = Number(counter.dataset.target || 0);
                let current = 0;
                const increment = Math.max(1, Math.ceil(target / 40));

                const tick = () => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = `${target}${target === 100 ? '%' : '+'}`;
                        return;
                    }
                    counter.textContent = current;
                    window.requestAnimationFrame(tick);
                };

                tick();
                counterObserver.unobserve(counter);
            });
        },
        { threshold: 0.5 }
    );

    document.querySelectorAll('.counter').forEach(counter => counterObserver.observe(counter));

    const updateActiveNav = () => {
        if (!navBar) {
            return;
        }

        const sections = document.querySelectorAll('main section');
        const offset = navBar.offsetHeight + 120;
        let currentId = 'home';

        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - offset) {
                currentId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
    };

    const updateScrollUI = () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }
        if (backToTop) {
            backToTop.classList.toggle('show', window.scrollY > 520);
        }
        updateActiveNav();
    };

    window.addEventListener('scroll', updateScrollUI);
    window.addEventListener('resize', updateScrollUI);

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const renderFilterButtons = categories => {
        if (!filterGroup) {
            return;
        }
        filterGroup.innerHTML = '<button class="filter-btn active" data-filter="all" type="button">All</button>';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.type = 'button';
            button.dataset.filter = category;
            button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            filterGroup.appendChild(button);
        });
    };

    const createProjectCard = project => {
        const article = document.createElement('article');
        article.className = `project-card card reveal portfolio-item ${project.category}`;
        article.dataset.category = project.category;

        const techTags = project.technologies
            .map(tech => `<span class="tech-tag">${tech}</span>`)
            .join('');

        const liveLink = project.live_url
            ? `<a href="${project.live_url}" class="project-link" target="_blank" rel="noreferrer"><i class="fas fa-arrow-up-right-from-square"></i> Live Preview</a>`
            : '';

        article.innerHTML = `
            <div class="project-visual">
                <div class="project-icon"><i class="${iconMap[project.category] || 'fas fa-code'}"></i></div>
                <span class="project-category">${project.category}</span>
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <div class="project-meta">
                    ${project.date ? `<span><i class="fas fa-calendar"></i> ${project.date}</span>` : ''}
                    ${project.associated_with ? `<span><i class="fas fa-building"></i> ${project.associated_with}</span>` : ''}
                </div>
                <p class="project-description">${project.description}</p>
                <div class="tech-tags">${techTags}</div>
                <div class="project-links">
                    <a href="${project.github_url}" class="project-link" target="_blank" rel="noreferrer"><i class="fab fa-github"></i> GitHub</a>
                    ${liveLink}
                </div>
            </div>
        `;
        return article;
    };

    const renderProjects = () => {
        if (!projectsGrid) {
            return;
        }

        const filteredProjects = allProjects.filter(project => {
            const inCategory = activeFilter === 'all' || project.category === activeFilter;
            const searchable = `${project.title} ${project.description} ${project.category} ${project.technologies.join(' ')}`.toLowerCase();
            return inCategory && searchable.includes(searchTerm);
        });

        projectsGrid.innerHTML = '';
        filteredProjects.forEach(project => {
            projectsGrid.appendChild(createProjectCard(project));
        });

        if (emptyState) {
            emptyState.classList.toggle('show', filteredProjects.length === 0);
        }

        document.querySelectorAll('#projects-grid .reveal').forEach(element => {
            revealObserver.observe(element);
        });
    };

    const initProjects = async () => {
        try {
            const response = await fetch('projects.updated.json');
            const data = await response.json();
            allProjects = data.projects || [];

            const categories = [...new Set(allProjects.map(project => project.category).filter(Boolean))];
            renderFilterButtons(categories);
            renderProjects();

            document.querySelectorAll('.filter-btn').forEach(button => {
                button.addEventListener('click', () => {
                    activeFilter = button.dataset.filter;
                    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    renderProjects();
                });
            });
        } catch (error) {
            console.error('Error loading projects:', error);
            if (emptyState) {
                emptyState.textContent = 'Projects could not be loaded right now.';
                emptyState.classList.add('show');
            }
        }
    };

    if (projectSearch) {
        projectSearch.addEventListener('input', event => {
            searchTerm = event.target.value.trim().toLowerCase();
            renderProjects();
        });
    }

    const copyText = async (value, successMessage) => {
        try {
            await navigator.clipboard.writeText(value);
            showToast(successMessage);
        } catch (error) {
            console.error('Clipboard copy failed:', error);
            showToast('Copy failed. Please try again.');
        }
    };

    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.copyTarget;
            const source = document.getElementById(targetId);
            if (!source) {
                return;
            }
            copyText(source.innerText.trim(), 'Code copied to clipboard');
        });
    });

    const copyEmailButton = document.getElementById('copy-email');
    if (copyEmailButton) {
        copyEmailButton.addEventListener('click', () => {
            copyText(copyEmailButton.dataset.email, 'Email copied to clipboard');
        });
    }

    const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const setFieldError = (field, message) => {
        const wrapper = field.closest('.form-group');
        const errorNode = wrapper ? wrapper.querySelector('.field-error') : null;
        if (errorNode) {
            errorNode.textContent = message;
        }
    };

    const clearFieldErrors = form => {
        form.querySelectorAll('.field-error').forEach(node => {
            node.textContent = '';
        });
    };

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', event => {
            clearFieldErrors(contactForm);

            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            let isValid = true;

            if (!nameField.value.trim() || nameField.value.trim().length < 2) {
                setFieldError(nameField, 'Please enter a valid name.');
                isValid = false;
            }

            if (!validateEmail(emailField.value.trim())) {
                setFieldError(emailField, 'Please enter a valid email address.');
                isValid = false;
            }

            if (!messageField.value.trim() || messageField.value.trim().length < 10) {
                setFieldError(messageField, 'Please write at least 10 characters.');
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault();
                showToast('Please check the form fields.');
            } else {
                showToast('Opening your message submission...');
            }
        });
    }

    if (skillMeters.length) {
        skillMeters.forEach(meter => {
            const fill = meter.querySelector('.skill-meter-fill');
            if (fill) {
                fill.style.width = '0';
            }
        });
    }

    const initParticles = () => {
        const canvas = document.getElementById('particles');
        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        const particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticles = () => {
            particles.length = 0;
            const count = Math.min(80, Math.floor(window.innerWidth / 18));
            for (let index = 0; index < count; index += 1) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2.2 + 0.8,
                    speedX: (Math.random() - 0.5) * 0.45,
                    speedY: (Math.random() - 0.5) * 0.45
                });
            }
        };

        const animate = () => {
            const isLight = body.classList.contains('theme-light');
            context.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.speedX *= -1;
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.speedY *= -1;
                }

                context.beginPath();
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                context.fillStyle = isLight ? 'rgba(15, 111, 255, 0.18)' : 'rgba(255, 255, 255, 0.55)';
                context.fill();
            });

            window.requestAnimationFrame(animate);
        };

        resize();
        createParticles();
        animate();

        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });
    };

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = String(new Date().getFullYear());
    }

    setGreeting();
    initTheme();
    initParticles();
    initProjects();
    updateScrollUI();
});
