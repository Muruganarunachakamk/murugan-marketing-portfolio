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
        const STORAGE_KEY = 'mak-theme-preference';

        // The blocking <head> script already applied the correct theme
        // before paint; read that state rather than re-deriving it.
        let current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

        applyTheme(current, false);

        function applyTheme(theme, persist) {
            current = theme;
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            toggle.setAttribute('aria-pressed', String(theme === 'dark'));
            if (persist) {
                try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
            }
        }

        toggle.addEventListener('click', () => {
            applyTheme(current === 'dark' ? 'light' : 'dark', true);
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
    /* ============================================================
       Marketing Journey progress thread — maps scroll position to
       the Consumer -> Research -> Insight -> Strategy -> Impact path.
       ============================================================ */
    function wireJourneyThread() {
        const thread = document.getElementById('journey-thread');
        const fill = document.getElementById('journey-fill');
        if (!thread || !fill) return;

        const stageOrder = ['consumer', 'research', 'insight', 'strategy', 'impact'];
        const stageEls = document.querySelectorAll('[data-journey-stage]');
        const items = thread.querySelectorAll('li');
        if (!stageEls.length) return;

        let ticking = false;

        function update() {
            ticking = false;
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
            fill.style.height = (progress * 100) + '%';

            // Find the furthest-reached stage whose section has entered the viewport
            let reachedIndex = 0;
            stageEls.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.6) {
                    const stage = el.getAttribute('data-journey-stage');
                    const idx = stageOrder.indexOf(stage);
                    if (idx > reachedIndex) reachedIndex = idx;
                }
            });

            items.forEach((li, i) => {
                li.classList.toggle('is-active', i === reachedIndex);
            });
        }

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        update();
    }

    /* ============================================================
       Creative Interactive Guide — minimal line-art figure.
       States: idle (default) -> noticing (cursor within radius) ->
       pointing (hovering the linked target) -> clicked (brief nod).
       Skipped entirely on touch/small screens and reduced-motion.
       ============================================================ */
    const GUIDE_SVG = `
        <svg viewBox="0 0 46 56" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g class="guide-body-group" fill="none" stroke="var(--accent-2)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="23" cy="12" r="7" />
                <path d="M23 19 L23 38" />
                <path class="guide-arm" d="M23 24 L34 30" />
                <path d="M23 24 L14 32" />
                <path d="M23 38 L15 54" />
                <path d="M23 38 L31 54" />
            </g>
        </svg>`;

    function wireCharacterGuide() {
        if (window.matchMedia('(max-width: 900px)').matches) return;

        const placements = [
            { mount: 'guide-mount-hero', target: 'hero-work-btn' },
            { mount: 'guide-mount-cert', target: 'cert-verify-link' },
            { mount: 'guide-mount-contact', target: 'contact-email-link' }
        ];

        const APPROACH_RADIUS = 90;

        placements.forEach(({ mount: mountId, target: targetId }) => {
            const mount = document.getElementById(mountId);
            const target = document.getElementById(targetId);
            if (!mount || !target) return;

            mount.innerHTML = GUIDE_SVG;
            const figure = mount.querySelector('svg').parentElement;
            figure.classList.add('guide-figure');

            if (reduceMotion) return; // static idle illustration only

            function distanceToMount(clientX, clientY) {
                const rect = mount.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                return Math.hypot(clientX - cx, clientY - cy);
            }

            document.addEventListener('mousemove', (e) => {
                const dist = distanceToMount(e.clientX, e.clientY);
                figure.classList.toggle('is-noticing', dist < APPROACH_RADIUS);
            }, { passive: true });

            target.addEventListener('mouseenter', () => figure.classList.add('is-pointing'));
            target.addEventListener('mouseleave', () => figure.classList.remove('is-pointing'));
            target.addEventListener('focus', () => figure.classList.add('is-pointing'));
            target.addEventListener('blur', () => figure.classList.remove('is-pointing'));

            target.addEventListener('click', () => {
                figure.classList.add('is-clicked');
                setTimeout(() => figure.classList.remove('is-clicked'), 420);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        wireResumeButtons();
        wireThemeToggle();
        wireNavToggle();
        wireNavActiveState();
        wireSpecializationDisclosure();
        wireScrollReveal();
        wireJourneyThread();
        wireMagneticButtons();
        wireCharacterGuide();
        wireAnchorLinks();
    });
})();
