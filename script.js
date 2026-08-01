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
