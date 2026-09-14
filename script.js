(() => {
  'use strict';
  const body = document.body;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menu = document.querySelector('.site-menu');
  const menuButton = document.querySelector('.menu-toggle');
  const themeButton = document.querySelector('#theme-toggle');
  const orb = document.querySelector('.cursor-orb');
  const message = document.querySelector('.guide-message');
  const projectData = {
    gravity: { type:'MBA MARKETING PROJECT · 2026', title:'Gravity Shift', summary:'A market research, segmentation and positioning strategy for a load-reducing smart backpack.', challenge:'Make a functional innovation feel personally valuable.', move:'Needs-based segments for students, professionals and trekkers.', tags:['Exploratory research','Segmentation','Positioning'] },
    media: { type:'UG DISSERTATION · 2023', title:'Media & Behaviour', summary:'A primary research study on how advertising media shapes consumer buying behaviour.', challenge:'Understand which media touchpoints move purchase decisions.', move:'Structured survey of 100+ respondents with Chi-Square and ANOVA testing.', tags:['Survey methodology','Consumer behaviour','Excel analysis'] },
    pragati: { type:'LIVE OUTREACH · 2026', title:'Pragati Outreach', summary:'A relationship-building and event promotion programme through the Public Relations Committee.', challenge:'Turn a campus event into a reason for people to show up.', move:'College outreach, coordinator communication and institutional representation.', tags:['Cold outreach','Coordination','Public relations'] }
  };
  const showMessage = text => { message.textContent = text; message.classList.add('is-visible'); clearTimeout(showMessage.timer); showMessage.timer = setTimeout(() => message.classList.remove('is-visible'), 2200); };
  menuButton?.addEventListener('click', () => { const open = menu.classList.toggle('is-open'); menuButton.setAttribute('aria-expanded', open); });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.classList.remove('is-open')));
  themeButton?.addEventListener('click', () => { body.classList.toggle('is-dark'); themeButton.querySelector('i').className = body.classList.contains('is-dark') ? 'fas fa-sun' : 'fas fa-moon'; localStorage.setItem('mak-theme', body.classList.contains('is-dark') ? 'dark' : 'light'); });
  if (localStorage.getItem('mak-theme') === 'dark') { body.classList.add('is-dark'); themeButton.querySelector('i').className = 'fas fa-sun'; }
  document.querySelectorAll('.project-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.project-tab').forEach(item => { item.classList.remove('is-active'); item.setAttribute('aria-selected','false'); }); tab.classList.add('is-active'); tab.setAttribute('aria-selected','true');
    const data = projectData[tab.dataset.project];
    ['type','title','summary','challenge','move'].forEach(key => document.querySelector(`#project-${key}`).textContent = data[key]);
    document.querySelector('#project-tags').innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join('');
    document.querySelector('#project-stage').animate([{opacity:.35,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}], {duration:450,easing:'cubic-bezier(.16,1,.3,1)'});
  }));
  document.querySelectorAll('.art-hotspot').forEach(hotspot => hotspot.addEventListener('click', () => showMessage(hotspot.dataset.message)));
  const pathExamples = {
    question: 'In the UG dissertation, this meant a structured survey of 100+ respondents to test what actually moves purchase decisions — not what people say moves them.',
    connect: 'Through Pragati, this meant reaching out to colleges directly, coordinating with student and faculty teams, and representing the institution face to face.',
    move: 'On Gravity Shift, this meant translating segmentation into a clear positioning and go-to-market direction for students, professionals and trekkers.'
  };
  const pathDetail = document.querySelector('#path-detail');
  document.querySelectorAll('.path-trigger').forEach(trigger => trigger.addEventListener('click', () => {
    document.querySelectorAll('.path-trigger').forEach(item => { item.classList.remove('is-active'); item.setAttribute('aria-expanded','false'); });
    trigger.classList.add('is-active');
    trigger.setAttribute('aria-expanded','true');
    if (pathDetail) pathDetail.textContent = pathExamples[trigger.dataset.node] || '';
  }));
  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
    document.addEventListener('pointermove', event => { orb.style.left = `${event.clientX}px`; orb.style.top = `${event.clientY}px`; orb.style.opacity = '1'; });
    document.addEventListener('pointerleave', () => { orb.style.opacity = '0'; });

    document.querySelectorAll('.tool-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-10px) rotate(${relX * 3}deg) perspective(600px) rotateX(${relY * -4}deg)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold:.14});
  document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) document.querySelectorAll('.site-menu a').forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id || 'top'}`)); }), {rootMargin:'-40% 0px -50% 0px'});
  document.querySelectorAll('main section[id], #top').forEach(section => navObserver.observe(section));
})();
