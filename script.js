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
    const contactForm = document.getElementById('contact-form');
    const copyEmailButton = document.getElementById('copy-email');

    let allProjects = [];
    let activeFilter = 'all';
    let searchTerm = '';

    // Toast notification
    const showToast = message => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        window.clearTimeout(showToast.timeoutId);
        showToast.timeoutId = window.setTimeout(() => {
            toast.classList.remove('show');
        }, 2600);
    };

    // Greeting according to time of day
    const setGreeting = () => {
        if (!greeting) return;
        const hour = new Date().getHours();
        if (hour < 12) {
            greeting.textContent = 'Good morning. Welcome to my engineering workspace.';
        } else if (hour < 18) {
            greeting.textContent = 'Good afternoon. Explore my production platforms and systems.';
        } else {
            greeting.textContent = 'Good evening. Thanks for reviewing my commercial builds.';
        }
    };

    // Dark / Light Theme
    const setTheme = theme => {
        body.classList.toggle('theme-light', theme === 'light');
        body.classList.toggle('theme-dark', theme !== 'light');
        localStorage.setItem('portfolio-theme', theme);

        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            const label = themeToggle.querySelector('span');
            const isLight = theme === 'light';
            if (icon) icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
            if (label) label.textContent = isLight ? 'Light Mode' : 'Dark Mode';
        }
    };

    const initTheme = () => {
        const savedTheme = localStorage.getItem('portfolio-theme');
        const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        setTheme(savedTheme || (systemLight ? 'light' : 'dark'));
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nextTheme = body.classList.contains('theme-light') ? 'dark' : 'light';
            setTheme(nextTheme);
        });
    }

    // Mobile Navigation Toggle
    const closeMobileMenu = () => {
        if (!navLinksWrap || !mobileToggle) return;
        navLinksWrap.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
    };

    if (mobileToggle && navLinksWrap) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navLinksWrap.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    // Smooth Scroll
    const scrollToSection = targetSelector => {
        const target = document.querySelector(targetSelector);
        if (!target || !navBar) return;
        const navOffset = navBar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault();
                scrollToSection(href);
                closeMobileMenu();
            }
        });
    });

    // Reveal on scroll
    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        },
        { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal').forEach(element => {
        revealObserver.observe(element);
    });

    // Stat Counters
    const counterObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const counter = entry.target;
                const target = Number(counter.dataset.target || 0);
                let current = 0;
                const step = Math.max(1, Math.ceil(target / 25));

                const tick = () => {
                    current += step;
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

    // Scroll UI (Progress bar, Back-to-top, Active Nav)
    const updateActiveNav = () => {
        const sections = document.querySelectorAll('main section');
        const offset = (navBar ? navBar.offsetHeight : 70) + 100;
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
            backToTop.classList.toggle('show', window.scrollY > 400);
        }
        updateActiveNav();
    };

    window.addEventListener('scroll', updateScrollUI, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Projects Loading & Filtering
    const formatCategoryName = category => {
        switch (category) {
            case 'erp': return 'ERP Systems';
            case 'systems': return 'Web Systems';
            case 'web': return 'Web Platforms';
            default: return category.charAt(0).toUpperCase() + category.slice(1);
        }
    };

    const renderFilterButtons = categories => {
        if (!filterGroup) return;
        filterGroup.innerHTML = '<button class="filter-btn active" data-filter="all" type="button">All Projects</button>';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.type = 'button';
            button.dataset.filter = category;
            button.textContent = formatCategoryName(category);
            filterGroup.appendChild(button);
        });
    };

    const createProjectCard = project => {
        const article = document.createElement('article');
        article.className = 'project-card card reveal';

        const techTags = (project.technologies || [])
            .map(tech => `<span class="tech-tag">${tech}</span>`)
            .join('');

        const liveLink = project.live_url
            ? `<a href="${project.live_url}" class="project-link primary" target="_blank" rel="noreferrer"><i class="fas fa-arrow-up-right-from-square"></i> Live System</a>`
            : '';

        const isRootProfile = !project.github_url || project.github_url.replace(/\/+$/, '') === 'https://github.com/randikanawarathne';

        const githubLink = !isRootProfile
            ? `<a href="${project.github_url}" class="project-link" target="_blank" rel="noreferrer"><i class="fab fa-github"></i> Repository</a>`
            : `<span class="project-link-muted" title="Commercial Client Production — Private Codebase"><i class="fas fa-lock"></i> Client Production</span>`;


        const badgeText = project.badge || (project.category ? project.category.toUpperCase() : 'PRODUCTION');

        article.innerHTML = `
            <div class="project-card-header">
                <span class="project-badge">${badgeText}</span>
                <span class="project-year">${project.date || ''}</span>
            </div>
            <h3>${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="tech-tags">${techTags}</div>
            <div class="project-links">
                ${liveLink}
                ${githubLink}
            </div>
        `;
        return article;
    };

    const renderProjects = () => {
        if (!projectsGrid) return;

        const filteredProjects = allProjects.filter(project => {
            const inCategory = activeFilter === 'all' || project.category === activeFilter;
            const searchPool = `${project.title} ${project.description} ${project.category} ${(project.technologies || []).join(' ')}`.toLowerCase();
            return inCategory && searchPool.includes(searchTerm);
        });

        projectsGrid.innerHTML = '';
        filteredProjects.forEach(project => {
            const card = createProjectCard(project);
            projectsGrid.appendChild(card);
            revealObserver.observe(card);
        });

        if (emptyState) {
            emptyState.classList.toggle('hidden', filteredProjects.length > 0);
        }
    };

    const initProjects = async () => {
        try {
            const response = await fetch('projects.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            allProjects = data.projects || [];

            const categories = [...new Set(allProjects.map(p => p.category).filter(Boolean))];
            renderFilterButtons(categories);
            renderProjects();

            if (filterGroup) {
                filterGroup.addEventListener('click', event => {
                    const btn = event.target.closest('.filter-btn');
                    if (!btn) return;
                    activeFilter = btn.dataset.filter;
                    filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    renderProjects();
                });
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            if (emptyState) {
                emptyState.textContent = 'Projects could not be loaded at the moment.';
                emptyState.classList.remove('hidden');
            }
        }
    };

    if (projectSearch) {
        projectSearch.addEventListener('input', event => {
            searchTerm = event.target.value.trim().toLowerCase();
            renderProjects();
        });
    }

    // Copy Email to Clipboard
    if (copyEmailButton) {
        copyEmailButton.addEventListener('click', async () => {
            const email = copyEmailButton.dataset.email || 'randikasl1234@gmail.com';
            try {
                await navigator.clipboard.writeText(email);
                showToast('Email address copied to clipboard!');
            } catch (err) {
                showToast(`Email: ${email}`);
            }
        });
    }

    // Form Validation & Seamless AJAX Submission
    const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const setFieldError = (field, message) => {
        const wrapper = field.closest('.form-group');
        const errorNode = wrapper ? wrapper.querySelector('.field-error') : null;
        if (errorNode) errorNode.textContent = message;
    };

    const clearFieldErrors = form => {
        form.querySelectorAll('.field-error').forEach(node => {
            node.textContent = '';
        });
    };

    if (contactForm) {
        contactForm.addEventListener('submit', async event => {
            event.preventDefault();
            clearFieldErrors(contactForm);

            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            const submitBtn = document.getElementById('submit-btn');
            let isValid = true;

            if (!nameField.value.trim() || nameField.value.trim().length < 2) {
                setFieldError(nameField, 'Please enter your name.');
                isValid = false;
            }

            if (!validateEmail(emailField.value.trim())) {
                setFieldError(emailField, 'Please enter a valid email address.');
                isValid = false;
            }

            if (!messageField.value.trim() || messageField.value.trim().length < 10) {
                setFieldError(messageField, 'Please provide a project description (at least 10 characters).');
                isValid = false;
            }

            if (!isValid) return;

            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showToast('Message sent successfully! I will reply shortly.');
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Contact submit error:', error);
                showToast('Failed to send message. Please email randikasl1234@gmail.com directly.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });
    }

    // Current Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = String(new Date().getFullYear());
    }

    // Initializations
    setGreeting();
    initTheme();
    initProjects();
    updateScrollUI();
});
