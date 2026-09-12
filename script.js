(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const RESUME_PATH = './Murugan%20Arunachalam%20K_Marketing%20Resume.pdf';

    /* ============================================================
       Resume download — single source of truth, no duplicate listeners.
       Same-origin relative path so it works correctly on GitHub Pages.
       ============================================================ */
    function wireResumeButtons() {
        const buttons = [
            document.getElementById('nav-resume-btn'),
            document.getElementById('hero-resume-btn')
        ].filter(Boolean);

        const toast = document.getElementById('download-toast');
        let toastTimer;

        function showToast(message) {
            if (!toast) return;
            toast.textContent = message;
            toast.classList.add('is-visible');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
        }

        buttons.forEach(btn => {
            btn.setAttribute('href', RESUME_PATH);
            btn.setAttribute('download', 'Murugan Arunachalam K_Marketing Resume.pdf');
            btn.addEventListener('click', () => {
                showToast('Opening resume…');
            });
        });
    }

    /* ============================================================
       Theme toggle — controlled brand palette only (light/dark),
       no random accent generation.
       ============================================================ */
    function wireThemeToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) return;
        const icon = toggle.querySelector('i');

        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let current = systemPrefersDark ? 'dark' : 'light';
        icon.className = current === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        toggle.setAttribute('aria-pressed', String(current === 'dark'));

        toggle.addEventListener('click', () => {
            current = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', current);
            icon.className = current === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            toggle.setAttribute('aria-pressed', String(current === 'dark'));
        });
    }

    /* ============================================================
       Mobile nav toggle
       ============================================================ */
    function wireNavToggle() {
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('nav-menu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ============================================================
       Nav active-section indicator
       ============================================================ */
    function wireNavActiveState() {
        const links = document.querySelectorAll('.nav-link');
        const sections = Array.from(links)
            .map(link => document.querySelector(link.getAttribute('href')))
            .filter(Boolean);

        if (!links.length || !sections.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = '#' + entry.target.id;
                    links.forEach(link => {
                        link.classList.toggle('is-active', link.getAttribute('href') === id);
                    });
                }
            });
        }, { threshold: 0.35, rootMargin: '-100px 0px -55% 0px' });

        sections.forEach(section => observer.observe(section));
    }

    /* ============================================================
       Certification specialization disclosure — accessible,
       no nested interactive elements (button controls a sibling panel).
       ============================================================ */
    function wireSpecializationDisclosure() {
        const toggle = document.getElementById('spec-toggle');
        const panel = document.getElementById('spec-courses');
        if (!toggle || !panel) return;

        toggle.addEventListener('click', () => {
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!isOpen));
            panel.hidden = isOpen;
            toggle.querySelector('span').textContent = isOpen ? 'Show 4 courses' : 'Hide courses';
        });
    }

    /* ============================================================
       Scroll reveal
       ============================================================ */
    function wireScrollReveal() {
        const targets = document.querySelectorAll('.reveal');
        if (!targets.length) return;

        if (reduceMotion) {
            targets.forEach(t => t.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        targets.forEach(t => observer.observe(t));
    }

    /* ============================================================
       Magnetic buttons — subtle cursor-follow within hover radius
       ============================================================ */
    function wireMagneticButtons() {
        if (reduceMotion) return;
        const buttons = document.querySelectorAll('.magnetic');
        const strength = 8;

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const relX = e.clientX - (rect.left + rect.width / 2);
                const relY = e.clientY - (rect.top + rect.height / 2);
                btn.style.transform = `translate(${(relX / rect.width) * strength}px, ${(relY / rect.height) * strength}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    /* ============================================================
       Smooth in-page anchor scrolling (progressive enhancement;
       CSS scroll-behavior already covers most browsers)
       ============================================================ */
    function wireAnchorLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (!href || href === '#') return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
            });
        });
    }

    /* ============================================================
       Init
       ============================================================ */
    document.addEventListener('DOMContentLoaded', () => {
        wireResumeButtons();
        wireThemeToggle();
        wireNavToggle();
        wireNavActiveState();
        wireSpecializationDisclosure();
        wireScrollReveal();
        wireMagneticButtons();
        wireAnchorLinks();
    });
})();
