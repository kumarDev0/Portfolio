/* ═══════════════════════════════════════════
   DEEPAK KUMAR — PORTFOLIO JS
═══════════════════════════════════════════ */
const isMobile = window.innerWidth <= 768;

// ─── CUSTOM CURSOR (desktop only) ───
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (!isMobile) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    // transform (not left/top) = GPU-composited, no layout reflow on every move
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();
}

// ─── PAUSE HERO ANIMATIONS WHEN OFF-SCREEN ───
// Stops continuously-repainting hero animations (orbs, morphing image frame)
// from costing paint time while the user scrolls through the rest of the page.
const heroEl = document.getElementById('hero');
if (heroEl) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      heroEl.classList.toggle('anim-paused', !entry.isIntersecting);
    });
  }, { threshold: 0 });
  heroObserver.observe(heroEl);
}

// ─── NAV SCROLL ───
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── TYPED TEXT ───
const phrases = [
  'scalable backend systems.',
  'AI-powered LLM applications.',
  'production-ready REST APIs.',
  'RAG pipelines & AI agents.',
  'workflow automation tools.',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed');

function typeLoop() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    charIdx++;
    typedEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
    setTimeout(typeLoop, 70);
  } else {
    charIdx--;
    typedEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 300);
      return;
    }
    setTimeout(typeLoop, 35);
  }
}
setTimeout(typeLoop, 1200);

// ─── SCROLL REVEAL ───
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ─── SKILL BARS ───
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('.skill-bar');
      bars.forEach(bar => {
        setTimeout(() => {
          bar.style.width = bar.dataset.w + '%';
        }, 300);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-grid').forEach(el => barObserver.observe(el));

// ─── COUNTER ANIMATION ───
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = Date.now();
  const tick = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  };
  tick();
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.dataset.target);
        animateCounter(el, target, '+');
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) counterObserver.observe(statsEl);

// ─── PARALLAX (desktop only) ───
let ticking = false;
window.addEventListener('scroll', () => {
  if (isMobile) return;
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const orbs = document.querySelectorAll('.hero-orb');
      orbs.forEach((orb, i) => {
        orb.style.transform = `translate(${i % 2 === 0 ? scrollY * 0.06 : -scrollY * 0.04}px, ${scrollY * (0.03 + i * 0.01)}px)`;
      });
      const aboutBg = document.querySelector('.about-parallax-bg');
      if (aboutBg) aboutBg.style.transform = `translateY(${scrollY * 0.02}px)`;
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ─── CONTACT FORM ───
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    try {
      const res = await fetch('https://formspree.io/f/xykopvdk', { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (res.ok) {
        successMsg.style.display = 'block';
        form.reset();
        setTimeout(() => successMsg.style.display = 'none', 5000);
      }
    } catch (err) {
      console.error('Form submission failed:', err);
    }
  });
}

// ─── HAMBURGER (MOBILE) ───
const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    if (links) {
      const isOpen = links.style.display === 'flex';
      links.style.display = isOpen ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '60px';
      links.style.left = '0'; links.style.right = '0';
      links.style.background = 'rgba(5,6,15,0.98)';
      links.style.padding = '1.5rem 2rem';
      links.style.borderBottom = '1px solid rgba(123,92,245,0.2)';
    }
  });
}

// ─── SMOOTH NAV LINKS ───
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ═══════════════════════════════════════════
// AI CHATBOT
// ═══════════════════════════════════════════

const chatFab = document.getElementById('chatFab');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

chatFab.addEventListener('click', () => {
  chatWindow.classList.toggle('open');
  if (chatWindow.classList.contains('open')) chatInput.focus();
});
chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));

// ─── Deepak's knowledge base (sourced from resume) ───
const DEEPAK_INFO = {
  name: "Deepak Kumar",
  email: "villainraaz92@gmail.com",
  phone: "+91 72589 40044",
  location: "Pune, India",
  github: "github.com/kumardev0",
  linkedin: "linkedin.com/in/kumardev0",
  education: [
    "B.Tech in Computer Science Engineering, IES College of Technology, Bhopal (2023–2026, CGPA 7.5/10)",
    "Diploma in Computer Science, Navsahyadri Institute of Technology, Pune (2020–2022, CGPA 8.1/10)"
  ],
  currentRole: "SDE-1 (Backend) Software Engineer at TravClan — Full-time, Remote / New Delhi (2025–2026)",
  experienceDetails: "Developed and maintains 20+ scalable backend services and RESTful APIs using Node.js, TypeScript and Express.js. Designed and optimized 10+ PostgreSQL database schemas. Integrated 5+ AWS services for scalable deployments. Improved backend performance by optimizing 50+ SQL queries and API endpoints. Built and integrated 15+ AI-powered features using LLMs and Generative AI frameworks.",
  projects: [
    "AI Sales Operating System — Lead Developer (Feb 2026–Present). A scalable AI-driven sales platform built with Python, FastAPI, LangChain, LangSmith, LangGraph, PostgreSQL, OpenAI API and React."
  ],
  freelanceProjects: [
    "Dentist Multi System — a premium multi-clinic SaaS website for dental practices with booking, WhatsApp integration and patient reviews. Live: dental-saas-ecru.vercel.app",
    "Interior Designer Multi System (AI-Integrated) — a luxury interior design studio platform with an AI assistant and consultation booking. Live: interier-designer-saas.vercel.app",
    "Zest & Ember Restaurant — a world-cuisine restaurant site with menu, specials and table reservation flow. Live: zest-ember-restaurant.vercel.app"
  ],
  skills: {
    languages: "SQL, JavaScript, TypeScript, Python",
    frameworks: "Next.js, React, Express.js, LangChain, LangSmith, LangGraph",
    tools: "Git, GitHub Actions, Postman, Linux, CI/CD, VS Code",
    databases: "PostgreSQL, Redis, MongoDB, MySQL, DynamoDB",
    ai: "LLMs, RAG, AI Agents, Model Context Protocol (MCP), OpenAI API",
    soft: "Communication, System Design, Debugging, Problem Solving, Decision Making",
    spoken: "English, Hindi"
  },
  remote: "Yes, Deepak is open to remote roles worldwide. He's currently working remotely as part of his role at TravClan.",
  availability: "Open to new opportunities, particularly international remote roles.",
  about: "A results-driven Backend Software Engineer (SDE-1) proficient in Node.js, TypeScript, JavaScript, Python, SQL and Express.js, with strong experience integrating Generative AI (LLMs, AI Agents, RAG, MCP) into production applications.",
  contact: "Best way to reach Deepak is via email: villainraaz92@gmail.com or phone: +91 72589 40044"
};

// ─── Smart response engine ───
function getResponse(msg) {
  const m = msg.toLowerCase().trim();

  if (m.match(/hi|hello|hey|namaste/)) {
    return `Hello! 👋 Great to meet you! I'm Deepak's portfolio assistant. I can tell you about his experience, skills, projects, and availability. What would you like to know?`;
  }
  if (m.match(/travclan|current role|current job|working now/)) {
    return `Deepak currently works as an **SDE-1 (Backend) Software Engineer at TravClan** (Full-time, Remote/New Delhi, 2025–2026).\n\nThere, he:\n⚙️ Built & maintains 20+ backend services and REST APIs (Node.js, TypeScript, Express.js)\n🗄️ Designed & optimized 10+ PostgreSQL schemas\n☁️ Integrated 5+ AWS services\n🤖 Built 15+ AI-powered features using LLMs`;
  }
  if (m.match(/project|ai sales|built|made/)) {
    return `Deepak's featured project is the **AI Sales Operating System** — he's the Lead Developer since Feb 2026.\n\nIt's a scalable AI-driven sales platform built with Python, FastAPI, LangChain, LangSmith, LangGraph, PostgreSQL, OpenAI API and React. Check it out on his GitHub!`;
  }
  if (m.match(/freelance|client work|dentist|dental|interior|restaurant|zest|ember/)) {
    return `Deepak has delivered 3 premium freelance projects for real clients:\n\n🦷 **Dentist Multi System** — Multi-clinic dental SaaS website with booking & WhatsApp integration\n🛋️ **Interior Designer Multi System** — Luxury interior design platform with AI assistant integration\n🍽️ **Zest & Ember Restaurant** — World-cuisine restaurant site with reservations\n\nAll are live and linked in the Freelance Projects section above!`;
  }
  if (m.match(/skill|tech|stack|node|react|typescript|javascript|ai|python/)) {
    return `Deepak's technical stack:\n\n⚙️ **Languages:** SQL, JavaScript, TypeScript, Python\n🎨 **Frameworks:** Next.js, React, Express.js, LangChain, LangGraph\n🤖 **AI:** LLMs, RAG, AI Agents, MCP, OpenAI API\n🗄️ **Databases:** PostgreSQL, Redis, MongoDB, MySQL, DynamoDB\n🛠️ **Tools:** Git, GitHub Actions, CI/CD, Linux\n\nHe's especially strong in Node.js + TypeScript backend engineering and Generative AI integration!`;
  }
  if (m.match(/salary|pay|compensation|ctc|package/)) {
    return `Deepak is open to discussing compensation based on the role, responsibilities, and location. Feel free to reach out directly at villainraaz92@gmail.com to talk specifics! 💼`;
  }
  if (m.match(/remote|work from|timezone|location|available/)) {
    return `Yes! Deepak is open to **remote roles worldwide** 🌐\n\nHe's currently based in Pune, India, working remotely as part of his current role at TravClan, and is open to new international opportunities.`;
  }
  if (m.match(/education|study|degree|btech|diploma|college|university/)) {
    return `Deepak's educational background:\n\n🎓 **B.Tech (Computer Science Engineering)** — IES College of Technology, Bhopal (2023–2026, CGPA 7.5/10)\n📜 **Diploma (Computer Science)** — Navsahyadri Institute of Technology, Pune (2020–2022, CGPA 8.1/10)`;
  }
  if (m.match(/experience|work history|job|client/)) {
    return `Deepak is currently an **SDE-1 (Backend) Software Engineer at TravClan** (2025–2026, Remote/New Delhi), building scalable backend services, REST APIs, and AI-powered features using Node.js, TypeScript and Generative AI frameworks.`;
  }
  if (m.match(/contact|email|reach|hire|linkedin|github|phone/)) {
    return `Here's how to reach Deepak:\n\n📧 **Email:** villainraaz92@gmail.com\n📞 **Phone:** +91 72589 40044\n💼 **LinkedIn:** linkedin.com/in/kumardev0\n🐙 **GitHub:** github.com/kumardev0\n📍 **Location:** Pune, India (Remote Worldwide)`;
  }
  if (m.match(/resume|cv|download/)) {
    return `You can download Deepak's resume directly from this portfolio! 📄\n\nClick the **"Download CV"** button in the navigation bar, or the **"Download Resume"** button in the Contact section.`;
  }
  if (m.match(/strength|best|strong|good at|expert/)) {
    return `Deepak's strongest suits are:\n\n⚙️ **Backend engineering** — Node.js, TypeScript, Express.js at production scale\n🤖 **Generative AI integration** — LLMs, RAG, AI Agents, MCP\n🗄️ **Database optimization** — PostgreSQL schema design & query tuning\n☁️ **Cloud infrastructure** — AWS service integration\n🧠 **Clean architecture** — writing maintainable, scalable code`;
  }
  if (m.match(/goal|plan|future|ambition/)) {
    return `Deepak is focused on growing as a backend engineer while deepening his expertise in Generative AI and scalable system design — ideally with an international remote team where he can take ownership and grow fast. 🚀`;
  }
  if (m.match(/thank|thanks|great|awesome|nice|wow/)) {
    return `Thank you! 😊 Deepak would love to connect with you. Feel free to reach out at villainraaz92@gmail.com or check out his GitHub at github.com/kumardev0. Any more questions?`;
  }

  // Default
  return `Good question! I can tell you about Deepak's:\n\n• 💼 **Current Role** — SDE-1 Backend Engineer at TravClan\n• 🚀 **Project** — AI Sales Operating System\n• 💻 **Skills** — Node.js, TypeScript, Python, Generative AI\n• 🎓 **Education** — B.Tech CSE (2026) + Diploma (2022)\n• 📧 **Contact** — villainraaz92@gmail.com\n\nJust ask me anything!`;
}

function addMessage(text, type) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${type}`;

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  // Handle newlines and bold (**text**)
  bubble.innerHTML = text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  msgDiv.appendChild(bubble);
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg bot';
  typingDiv.id = 'typingIndicator';
  typingDiv.innerHTML = `<div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

function handleSend(text) {
  const msg = (text || chatInput.value).trim();
  if (!msg) return;

  // Remove suggestions
  const suggestions = document.querySelector('.chat-suggestions');
  if (suggestions) suggestions.remove();

  addMessage(msg, 'user');
  chatInput.value = '';

  showTyping();
  const delay = 700 + Math.random() * 600;
  setTimeout(() => {
    removeTyping();
    addMessage(getResponse(msg), 'bot');
  }, delay);
}

chatSend.addEventListener('click', () => handleSend());
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

window.sendSuggestion = function (btn) {
  handleSend(btn.textContent);
};

// ─── PROJECT CARD TILT (desktop only) ───
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.project-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  });
}

// ─── PAGE LOAD ───
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 50);
});