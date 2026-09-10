const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.body;
const rootStyle = document.documentElement.style;
const themeIcon = themeToggleBtn.querySelector('i');

// Determine the effective starting theme from system preference (no theme forced by default).
const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
themeIcon.classList.remove('fa-moon', 'fa-sun');
themeIcon.classList.add(systemPrefersLight ? 'fa-sun' : 'fa-moon');

function randomAccentPalette() {
    // Pick a fully random hue each time dark mode is (re)entered, derive a coherent triad from it.
    const hue = Math.floor(Math.random() * 360);
    const accent = `hsl(${hue}, 82%, 62%)`;
    const light = `hsl(${hue}, 88%, 72%)`;
    const secondaryHue = (hue + 40) % 360;
    const secondary = `hsl(${secondaryHue}, 85%, 60%)`;
    const glow = `hsla(${hue}, 82%, 62%, 0.18)`;

    rootStyle.setProperty('--accent-blue', accent);
    rootStyle.setProperty('--accent-light', light);
    rootStyle.setProperty('--accent-secondary', secondary);
    rootStyle.setProperty('--accent-glow', glow);
    rootStyle.setProperty('--mesh-1', `radial-gradient(ellipse 900px 700px at 8% -10%, hsla(${hue}, 82%, 62%, 0.16), transparent 60%)`);
    rootStyle.setProperty('--mesh-2', `radial-gradient(ellipse 800px 800px at 95% 15%, hsla(${secondaryHue}, 85%, 60%, 0.12), transparent 55%)`);
    rootStyle.setProperty('--mesh-3', `radial-gradient(ellipse 1000px 900px at 50% 110%, hsla(${(hue + 260) % 360}, 70%, 60%, 0.14), transparent 60%)`);
}

function clearAccentOverrides() {
    ['--accent-blue', '--accent-light', '--accent-secondary', '--accent-glow', '--mesh-1', '--mesh-2', '--mesh-3']
        .forEach(prop => rootStyle.removeProperty(prop));
}

let effectiveTheme = systemPrefersLight ? 'light' : 'dark';

themeToggleBtn.addEventListener('click', () => {
    if (effectiveTheme === 'dark') {
        effectiveTheme = 'light';
        htmlElement.setAttribute('data-theme', 'light');
        clearAccentOverrides();
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        effectiveTheme = 'dark';
        htmlElement.setAttribute('data-theme', 'dark');
        randomAccentPalette();
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});


const mouseGlow = document.getElementById('mouse-glow');
const customCursor = document.getElementById('custom-cursor');

document.addEventListener('mousemove', (e) => {
    mouseGlow.style.left = e.clientX + 'px';
    mouseGlow.style.top = e.clientY + 'px';
    mouseGlow.style.opacity = '1';

    if (customCursor) {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    }
});

document.addEventListener('mouseleave', () => {
    mouseGlow.style.opacity = '0';
});

if (customCursor) {
    const interactiveSelector = 'a, button, .cert-card, .interactive-card, .spec-parent, .spec-child-content, input, textarea';
    document.querySelectorAll(interactiveSelector).forEach(el => {
        el.addEventListener('mouseenter', () => customCursor.classList.add('is-active'));
        el.addEventListener('mouseleave', () => customCursor.classList.remove('is-active'));
    });
}


const typingText = document.getElementById('typing-text');
const words = ['Brand Strategy', 'Consumer Insights', 'Digital Marketing', 'Market Research', 'Marketing Analytics'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    if (!typingText) return;

    const currentWord = words[wordIndex];

    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

setTimeout(type, 1000);


const counters = document.querySelectorAll('.counter');

const animateCounters = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseFloat(counter.getAttribute('data-target'));
            const hasDecimals = target % 1 !== 0;
            const duration = 2000;
            const steps = 60;
            const stepTime = Math.abs(Math.floor(duration / steps));
            let current = 0;
            const increment = target / steps;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.innerText = hasDecimals ? target.toFixed(2) : target;
                    clearInterval(timer);
                } else {
                    counter.innerText = hasDecimals ? current.toFixed(2) : Math.ceil(current);
                }
            }, stepTime);

            observer.unobserve(counter);
        }
    });
};

const counterObserver = new IntersectionObserver(animateCounters, {
    threshold: 0.5
});

counters.forEach(counter => {
    counterObserver.observe(counter);
});


const skillFills = document.querySelectorAll('.skill-fill');

const animateSkills = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skill = entry.target;
            const width = skill.getAttribute('data-width');
            skill.style.width = width;
            observer.unobserve(skill);
        }
    });
};

const skillObserver = new IntersectionObserver(animateSkills, {
    threshold: 0.5
});

skillFills.forEach(skill => {
    skillObserver.observe(skill);
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


const downloadBtn = document.getElementById('download-resume');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = 'https://github.com/Muruganarunachakamk/murugan-marketing-portfolio/blob/e7ccc14f8edce17c0ef232c0c6703d5b55bc506a/Murugan%20Arunachalam%20K_Marketing%20Resume.pdf';
        link.download = 'Murugan_Arunachalam_K_Marketing_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}


/* Magnetic "connect" button: subtly follows the cursor within its hover radius */
const magneticBtn = document.getElementById('magnetic-connect');
if (magneticBtn) {
    const inner = magneticBtn.querySelector('.magnetic-btn-inner');
    const strength = 18;

    magneticBtn.addEventListener('mousemove', (e) => {
        const rect = magneticBtn.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        inner.style.transform = `translate(${relX / rect.width * strength}px, ${relY / rect.height * strength}px)`;
    });

    magneticBtn.addEventListener('mouseleave', () => {
        inner.style.transform = 'translate(0, 0)';
    });

    magneticBtn.addEventListener('click', (e) => {
        if (e.target.closest('.magnetic-popup')) return;
        const email = 'muruganarunachalamk@gmail.com';
        const subject = encodeURIComponent("Let's connect");
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}`;
        const win = window.open(gmailUrl, '_blank', 'noopener');
        if (!win) {
            window.location.href = `mailto:${email}?subject=${subject}`;
        }
    });
}

/* Greeting popup: appears once after a short delay, auto-collapses, dismissible */
const magneticPopup = document.getElementById('magnetic-popup');
const magneticPopupClose = document.getElementById('magnetic-popup-close');
if (magneticPopup) {
    const showDelay = 1800;
    const autoHideAfter = 6500;
    let hideTimer;

    setTimeout(() => {
        magneticPopup.classList.add('is-visible');
        hideTimer = setTimeout(() => {
            magneticPopup.classList.remove('is-visible');
        }, autoHideAfter);
    }, showDelay);

    if (magneticPopupClose) {
        magneticPopupClose.addEventListener('click', (e) => {
            e.stopPropagation();
            clearTimeout(hideTimer);
            magneticPopup.classList.remove('is-visible');
        });
    }
}


/* Specialization hierarchy: expandable parent -> nested child certificates */
const specToggle = document.getElementById('spec-toggle');
if (specToggle) {
    const specBlock = specToggle.closest('.specialization-block');
    const specChildren = document.getElementById('spec-children');

    specToggle.addEventListener('click', () => {
        const isOpen = specBlock.classList.toggle('is-open');
        specToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
}


/* Respect reduced-motion preference for SVG SMIL particle animations */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.data-particle animateMotion').forEach(anim => {
        anim.setAttribute('repeatCount', '0');
    });
    document.querySelectorAll('.data-particle').forEach(p => p.style.opacity = '0');
    document.querySelectorAll('.floating-kpi-card animateTransform').forEach(anim => {
        anim.setAttribute('repeatCount', '0');
    });
}
const revealSections = document.querySelectorAll('.reveal-section');
if (revealSections.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealSections.forEach(section => revealObserver.observe(section));
}


/* Nav active-indicator: highlights the link matching the section in view */
const navLinks = document.querySelectorAll('.nav-link');
const navSections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

if (navLinks.length && navSections.length) {
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = '#' + entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('is-active', link.getAttribute('href') === id);
                });
            }
        });
    }, { threshold: 0.4, rootMargin: '-100px 0px -60% 0px' });

    navSections.forEach(section => navObserver.observe(section));
}


/* Download Resume: ripple click feedback + brief loading state */
const resumeBtn = document.getElementById('download-resume');
if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
        const rect = resumeBtn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        resumeBtn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);

        resumeBtn.classList.add('is-loading');
        setTimeout(() => resumeBtn.classList.remove('is-loading'), 900);
    });
}


/* ============================================================
   Marketing Concepts Universe
   ============================================================ */
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 900px)').matches;
    if (isSmallScreen) return;

    // Small inline mini-diagram builders (return an SVG string) — kept tiny & GPU-cheap.
    const viz = {
        funnel: () => `<svg viewBox="0 0 200 70"><path d="M20 8 L180 8 L130 34 L70 34 Z" fill="none" stroke="var(--accent-blue)" stroke-width="1.5"/><path d="M70 34 L130 34 L110 56 L90 56 Z" fill="none" stroke="var(--accent-light)" stroke-width="1.5"/><path d="M90 56 L110 56 L102 66 L98 66 Z" fill="var(--accent-secondary)" opacity="0.7"/></svg>`,
        grid2x2: () => `<svg viewBox="0 0 200 70"><line x1="100" y1="6" x2="100" y2="64" stroke="var(--glass-border)"/><line x1="20" y1="35" x2="180" y2="35" stroke="var(--glass-border)"/><circle cx="60" cy="18" r="5" fill="var(--accent-blue)"/><circle cx="140" cy="18" r="5" fill="var(--accent-light)"/><circle cx="60" cy="52" r="5" fill="var(--accent-secondary)"/><circle cx="140" cy="52" r="5" fill="var(--accent-blue)" opacity="0.5"/></svg>`,
        network: () => `<svg viewBox="0 0 200 70"><g stroke="var(--accent-blue)" stroke-width="1" opacity="0.6" stroke-dasharray="3 4"><line x1="100" y1="35" x2="40" y2="15"/><line x1="100" y1="35" x2="160" y2="15"/><line x1="100" y1="35" x2="40" y2="55"/><line x1="100" y1="35" x2="160" y2="55"/></g><circle cx="100" cy="35" r="7" fill="var(--accent-light)"/><g fill="var(--accent-blue)"><circle cx="40" cy="15" r="4"/><circle cx="160" cy="15" r="4"/><circle cx="40" cy="55" r="4"/><circle cx="160" cy="55" r="4"/></g></svg>`,
        chart: () => `<svg viewBox="0 0 200 70"><g fill="var(--accent-blue)"><rect x="20" y="40" width="16" height="24"/><rect x="50" y="28" width="16" height="36"/><rect x="80" y="16" width="16" height="48" fill="var(--accent-light)"/><rect x="110" y="34" width="16" height="30"/><rect x="140" y="8" width="16" height="56" fill="var(--accent-secondary)"/></g></svg>`,
        journey: () => `<svg viewBox="0 0 200 70"><path d="M15 55 Q60 10 100 40 T185 15" fill="none" stroke="var(--accent-blue)" stroke-width="1.5" stroke-dasharray="4 5"/><circle cx="15" cy="55" r="4" fill="var(--accent-light)"/><circle cx="100" cy="40" r="4" fill="var(--accent-secondary)"/><circle cx="185" cy="15" r="5" fill="var(--accent-blue)"/></svg>`,
        radar: () => `<svg viewBox="0 0 200 70"><circle cx="100" cy="35" r="28" fill="none" stroke="var(--glass-border)"/><circle cx="100" cy="35" r="16" fill="none" stroke="var(--glass-border)"/><path d="M100 35 L100 10 L120 22 L112 45 L88 45 L80 22 Z" fill="var(--accent-blue)" opacity="0.35" stroke="var(--accent-light)" stroke-width="1"/></svg>`,
        loop: () => `<svg viewBox="0 0 200 70"><path d="M40 35 A 30 30 0 1 1 39 36" fill="none" stroke="var(--accent-blue)" stroke-width="1.6" stroke-dasharray="4 5"/><circle cx="40" cy="35" r="4" fill="var(--accent-secondary)"/><path d="M150 35 A 30 30 0 1 1 149 36" fill="none" stroke="var(--accent-light)" stroke-width="1.6" stroke-dasharray="4 5"/><circle cx="150" cy="35" r="4" fill="var(--accent-blue)"/></svg>`,
        gauge: () => `<svg viewBox="0 0 200 70"><path d="M30 60 A 70 70 0 0 1 170 60" fill="none" stroke="var(--glass-border)" stroke-width="6"/><path d="M30 60 A 70 70 0 0 1 130 15" fill="none" stroke="var(--accent-blue)" stroke-width="6"/><circle cx="130" cy="15" r="5" fill="var(--accent-secondary)"/></svg>`
    };

    const concepts = [
        { key: 'STP', title: 'STP: Segmentation, Targeting, Positioning', desc: 'A three-step framework for dividing a market into segments, choosing target segments, and positioning the brand distinctly in customers\u2019 minds.', icon: 'fa-layer-group', viz: 'grid2x2' },
        { key: 'AIDA', title: 'AIDA Model', desc: 'Maps the customer\u2019s path through Attention, Interest, Desire, and Action \u2014 a foundational model for structuring marketing communications.', icon: 'fa-bullseye', viz: 'funnel' },
        { key: '4Ps', title: 'Marketing Mix: 4Ps', desc: 'Product, Price, Place, and Promotion \u2014 the core levers marketers combine to bring an offering to market.', icon: 'fa-cubes', viz: 'grid2x2' },
        { key: 'SWOT', title: 'SWOT Analysis', desc: 'A strategic framework examining Strengths, Weaknesses, Opportunities, and Threats to guide business and marketing decisions.', icon: 'fa-th-large', viz: 'grid2x2' },
        { key: "Porter's 5", title: "Porter's Five Forces", desc: 'Analyzes competitive intensity via rivalry, supplier power, buyer power, threat of substitutes, and threat of new entrants.', icon: 'fa-project-diagram', viz: 'radar' },
        { key: 'BCG Matrix', title: 'BCG Growth-Share Matrix', desc: 'Classifies a portfolio of products or business units as Stars, Cash Cows, Question Marks, or Dogs based on growth and market share.', icon: 'fa-th', viz: 'grid2x2' },
        { key: 'Brand Equity', title: 'Brand Equity', desc: 'The commercial value derived from consumer perception of a brand name, built through awareness, loyalty, and perceived quality.', icon: 'fa-gem', viz: 'gauge' },
        { key: 'Consumer Behaviour', title: 'Consumer Behaviour', desc: 'The study of how individuals decide to select, use, and dispose of products \u2014 central to my dissertation research on advertising media.', icon: 'fa-user-friends', viz: 'journey' },
        { key: 'Customer Journey', title: 'Customer Journey', desc: 'The end-to-end path a customer takes from awareness to purchase and beyond, mapped to identify key touchpoints.', icon: 'fa-route', viz: 'journey' },
        { key: 'CRM', title: 'CRM', desc: 'Customer Relationship Management \u2014 systems and strategies used to manage a company\u2019s interactions with current and prospective customers.', icon: 'fa-address-book', viz: 'network' },
        { key: 'Market Segmentation', title: 'Market Segmentation', desc: 'Dividing a broad market into distinct groups of buyers with shared needs, so marketing efforts can be tailored effectively.', icon: 'fa-object-group', viz: 'grid2x2' },
        { key: 'Digital Marketing', title: 'Digital Marketing', desc: 'Promoting products or brands through digital channels \u2014 search, social, email, and content \u2014 measurable at every step.', icon: 'fa-laptop-code', viz: 'network' },
        { key: 'SEO', title: 'SEO', desc: 'Search Engine Optimization \u2014 improving organic visibility in search results through content, technical, and authority signals.', icon: 'fa-search', viz: 'chart' },
        { key: 'Marketing Analytics', title: 'Marketing Analytics', desc: 'Measuring, managing, and analyzing marketing performance to maximize effectiveness and optimize return on investment.', icon: 'fa-chart-line', viz: 'chart' },
        { key: 'CLV', title: 'Customer Lifetime Value', desc: 'A prediction of the total value a business can expect from a single customer account throughout the relationship.', icon: 'fa-infinity', viz: 'loop' },
        { key: 'Blue Ocean', title: 'Blue Ocean Strategy', desc: 'A strategic approach that seeks to create uncontested market space, making competition irrelevant rather than fighting for share.', icon: 'fa-water', viz: 'radar' }
    ];

    const sectionMap = {
        hero: [0, 1],
        education: [2, 3],
        skills: [11, 12, 13],
        projects: [7, 8],
        certifications: [4, 5],
        leadership: [9, 15],
        'achievements-misc': [10],
        experience: [14, 6]
    };

    // Deterministic pseudo-random layout per node, biased toward edges/corners
    // so nodes sit in the margins rather than over central text content.
    function seededPos(seed, w, h) {
        const r1 = Math.abs((Math.sin(seed * 12.9898) * 43758.5453) % 1);
        const r2 = Math.abs((Math.sin(seed * 78.233) * 12543.123) % 1);
        const useRight = r1 > 0.5;
        const left = useRight
            ? w - 70 - (r1 * 40)
            : 10 + (r1 * 40);
        const top = 12 + r2 * Math.max(h - 70, 40);
        return { left, top };
    }

    const card = document.getElementById('concept-card');
    const cardBackdrop = document.getElementById('concept-card-backdrop');
    const cardClose = document.getElementById('concept-card-close');
    const cardIcon = document.getElementById('concept-card-icon');
    const cardTitle = document.getElementById('concept-card-title');
    const cardDesc = document.getElementById('concept-card-desc');
    const cardViz = document.getElementById('concept-card-viz');

    if (!card) return;

    function openCard(concept, node) {
        cardIcon.innerHTML = `<i class="fas ${concept.icon}"></i>`;
        cardTitle.textContent = concept.title;
        cardDesc.textContent = concept.desc;
        cardViz.innerHTML = viz[concept.viz] ? viz[concept.viz]() : '';
        card.classList.add('is-open');
        card.setAttribute('aria-hidden', 'false');
        cardBackdrop.classList.add('is-open');
        document.querySelectorAll('.concept-node.is-active').forEach(n => n.classList.remove('is-active'));
        if (node) node.classList.add('is-active');
    }

    function closeCard() {
        card.classList.remove('is-open');
        card.setAttribute('aria-hidden', 'true');
        cardBackdrop.classList.remove('is-open');
        document.querySelectorAll('.concept-node.is-active').forEach(n => n.classList.remove('is-active'));
    }

    cardClose.addEventListener('click', closeCard);
    cardBackdrop.addEventListener('click', closeCard);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCard();
    });

    // Build nodes per section with simple drag + spring-back
    Object.keys(sectionMap).forEach(sectionKey => {
        const layer = document.querySelector(`.concept-layer[data-section="${sectionKey}"]`);
        if (!layer) return;
        const parentSection = layer.closest('.dashboard-section');
        if (!parentSection) return;

        sectionMap[sectionKey].forEach((conceptIndex, i) => {
            const concept = concepts[conceptIndex];
            if (!concept) return;

            const node = document.createElement('div');
            node.className = 'concept-node';
            node.textContent = concept.key.length > 9 ? concept.key.slice(0, 8) + '\u2026' : concept.key;
            node.setAttribute('role', 'button');
            node.setAttribute('tabindex', '0');
            node.setAttribute('aria-label', concept.title);
            node.style.animationDelay = `-${(i * 1.7 + conceptIndex * 0.6).toFixed(2)}s`;

            layer.appendChild(node);

            requestAnimationFrame(() => {
                const w = layer.offsetWidth || 600;
                const h = layer.offsetHeight || 400;
                let pos = seededPos(conceptIndex * 7 + i * 3 + 1, w, h);
                if (sectionKey === 'hero') {
                    pos.left = Math.max(pos.left, w * 0.58);
                    pos.top = Math.min(pos.top, h * 0.82);
                }
                node.style.left = pos.left + 'px';
                node.style.top = pos.top + 'px';
            });

            node.addEventListener('click', (e) => {
                if (node.dataset.wasDragged === 'true') {
                    node.dataset.wasDragged = 'false';
                    return;
                }
                openCard(concept, node);
            });
            node.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openCard(concept, node);
                }
            });

            if (!reduceMotion) {
                let startX = 0, startY = 0, dragging = false;

                node.addEventListener('pointerdown', (e) => {
                    dragging = true;
                    node.dataset.wasDragged = 'false';
                    node.classList.add('is-dragging');
                    node.setPointerCapture(e.pointerId);
                    startX = e.clientX;
                    startY = e.clientY;
                });

                node.addEventListener('pointermove', (e) => {
                    if (!dragging) return;
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
                        node.dataset.wasDragged = 'true';
                    }
                    node.style.transform = `translate(${dx}px, ${dy}px)`;
                });

                function releaseNode() {
                    if (!dragging) return;
                    dragging = false;
                    node.classList.remove('is-dragging');
                    node.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    node.style.transform = 'translate(0px, 0px)';
                    setTimeout(() => { node.style.transition = ''; }, 650);
                }

                node.addEventListener('pointerup', releaseNode);
                node.addEventListener('pointercancel', releaseNode);
            }
        });
    });
})();
