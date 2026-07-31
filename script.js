const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.body;
const themeIcon = themeToggleBtn.querySelector('i');

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});


const mouseGlow = document.getElementById('mouse-glow');

document.addEventListener('mousemove', (e) => {
    mouseGlow.style.left = e.clientX + 'px';
    mouseGlow.style.top = e.clientY + 'px';
    mouseGlow.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    mouseGlow.style.opacity = '0';
});


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
