/* ═══════════════════════════════════════════
   DEEPAK KUMAR — PORTFOLIO JS
═══════════════════════════════════════════ */
const isMobile = window.innerWidth <= 768;
// ─── CUSTOM CURSOR ───
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// ─── NAV SCROLL ───
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── TYPED TEXT ───
const phrases = [
  'AI-powered tools.',
  'full-stack products.',
  'SaaS platforms.',
  'automation pipelines.',
  'scalable APIs.',
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
        const suffix = target >= 200 ? '+' : target === 5 ? '+' : '';
        animateCounter(el, target, suffix);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) counterObserver.observe(statsEl);

// ─── PARALLAX ───
// ─── PARALLAX ───
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
});

// ─── CONTACT FORM ───
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    const res = await fetch('https://formspree.io/f/xykopvdk', { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    if (res.ok) {
      successMsg.style.display = 'block';
      form.reset();
      setTimeout(() => successMsg.style.display = 'none', 5000);
    }
  });
}

// ─── HAMBURGER (MOBILE) ───
const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    if (links) {
      links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
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

// ─── Deepak's knowledge base ───
const DEEPAK_INFO = {
  name: "Deepak Kumar",
  email: "deepakkumarbsf123@gmail.com",
  location: "Pune, India",
  github: "github.com/kumardev0",
  linkedin: "linkedin.com/in/kumardev0",
  education: [
    "B.Tech in Computer Science from IES University, Bhopal (Expected June 2026)",
    "Diploma in Computer Science & Engineering (Completed 2022)"
  ],
  experience: "Freelance Software Engineer & AI Automation Consultant since January 2025",
  projects: [
    "Dental Business SaaS Platform — productized SaaS where only config changes per new client, live in production",
    "CRM System for Small Businesses — full-featured CRM with JWT auth, role-based access, live dashboard, 200+ GitHub commits",
    "Job Portal Platform — full-stack job portal with employer/candidate flows, search, filtering, REST API"
  ],
  skills: {
    backend: "Node.js, Express.js, REST API, JWT Authentication, TypeScript",
    frontend: "React.js, Next.js, HTML5, CSS3, Vercel",
    ai: "LLM APIs, Claude AI, AI Workflow Automation, Vibe Coding",
    devops: "Git, GitHub, Docker (basics), Vercel, npm",
    database: "MongoDB, PostgreSQL, Prisma ORM",
    languages: "JavaScript (ES6+), TypeScript, HTML5, CSS3, Bash"
  },
  salary: "₹1 Lakh per month (approximately $1,200 USD/month) for full-time remote roles. Open to negotiation for the right opportunity.",
  remote: "Yes! Deepak is 100% remote-ready. He works with async workflows, GitHub collaboration, and has managed remote client projects across different time zones.",
  availability: "Available immediately for remote roles worldwide, especially targeting international companies.",
  about: "Self-taught engineer who built all skills independently through hands-on projects and AI-assisted learning. Averages 6+ hours of daily focused practice. Shipped 3 live production projects in just 2 months.",
  contact: "Best way to reach Deepak is via email: deepakkumarbsf123@gmail.com or LinkedIn: linkedin.com/in/kumardev0"
};

// ─── Smart response engine ───
function getResponse(msg) {
  const m = msg.toLowerCase().trim();

  if (m.match(/hi|hello|hey|namaste/)) {
    return `Hello! 👋 Great to meet you! I'm Deepak's portfolio assistant. I can tell you everything about his skills, projects, experience, and availability. What would you like to know?`;
  }
  if (m.match(/project|built|made|crm|dental|job portal|saas/)) {
    return `Deepak has built 3 live production projects:\n\n🦷 **Dental Business SaaS** — Productized platform where only config changes per client. Onboards new clients in under 2 hours. Live in production!\n\n📊 **CRM System** — Full-featured CRM with JWT auth, role-based access, and live dashboards. 200+ GitHub commits.\n\n💼 **Job Portal** — Full-stack platform with employer & candidate flows, advanced search, and REST API backend.\n\nAll projects are deployed on Vercel and actively maintained!`;
  }
  if (m.match(/skill|tech|stack|node|react|typescript|javascript|ai/)) {
    return `Deepak's technical stack:\n\n⚙️ **Backend:** Node.js, Express.js, TypeScript, REST APIs, JWT Auth\n🎨 **Frontend:** React.js, Next.js, HTML5, CSS3\n🤖 **AI:** LLM APIs, Claude AI, AI Workflow Automation\n🗄️ **Database:** MongoDB, PostgreSQL, Prisma ORM\n🛠️ **DevOps:** Git, GitHub, Docker, Vercel\n\nHe's particularly strong in Node.js + TypeScript and AI integration!`;
  }
  if (m.match(/salary|pay|compensation|ctc|package|lakh|money/)) {
    return `Deepak's salary expectation is **₹1 Lakh per month** (~$1,200 USD/month) for a full-time remote position. He's targeting international companies for this. He's open to discussion for the right opportunity with growth potential! 💼`;
  }
  if (m.match(/remote|work from|timezone|location|available/)) {
    return `Yes! Deepak is **100% remote-ready** 🌐\n\nHe's based in Pune, India but works with international clients across time zones. He's comfortable with async communication, GitHub-based workflows, and remote project management. Available immediately for remote roles worldwide!`;
  }
  if (m.match(/education|study|degree|btech|diploma|college|university/)) {
    return `Deepak's educational background:\n\n🎓 **B.Tech (Computer Science)** — IES University, Bhopal (Expected June 2026)\n📜 **Diploma (CS & Engineering)** — Completed 2022\n\nBut his real education is hands-on — he built all his skills independently through focused self-study and real project building!`;
  }
  if (m.match(/experience|freelance|work|job|client/)) {
    return `Deepak has been a **Freelance Software Engineer & AI Automation Consultant** since January 2025.\n\nHe builds custom web solutions for local businesses, develops AI automation pipelines, and manages complete project lifecycles from requirements to deployment. He's currently solving real operational problems for multiple clients!`;
  }
  if (m.match(/contact|email|reach|hire|linkedin|github/)) {
    return `Here's how to reach Deepak:\n\n📧 **Email:** deepakkumarbsf123@gmail.com\n💼 **LinkedIn:** linkedin.com/in/kumardev0\n🐙 **GitHub:** github.com/kumardev0\n📍 **Location:** Pune, India (Remote Worldwide)\n\nHe typically responds within 24 hours!`;
  }
  if (m.match(/resume|cv|download/)) {
    return `You can download Deepak's resume directly from this portfolio! 📄\n\nClick the **"Download CV"** button in the navigation bar, or the **"Download Resume"** button in the Contact section. It's an ATS-optimized document highlighting all his skills and projects!`;
  }
  if (m.match(/strength|best|strong|good at|expert/)) {
    return `Deepak's strongest suits are:\n\n🚀 **Speed of delivery** — 3 live products in 2 months\n🤖 **AI integration** — Builds real AI-powered workflows\n⚙️ **Node.js + TypeScript** — His primary stack, used in all projects\n🧠 **Problem-solving** — Turns client pain points into working software\n📦 **SaaS architecture** — Productized systems that scale without rebuilding`;
  }
  if (m.match(/goal|plan|future|dream|ambition/)) {
    return `Deepak's goal is to join an international remote engineering team where he can take ownership, grow fast, and build products that impact real users at scale. Long term, he aims to become a senior full-stack AI engineer. His millionaire dream? Equity in the right startup! 🚀`;
  }
  if (m.match(/commit|github|code|version/)) {
    return `Deepak has maintained **200+ GitHub commits** across his projects! You can check his work at github.com/kumardev0. He follows structured version control with disciplined commit messages and iterative development. 🐙`;
  }
  if (m.match(/thank|thanks|great|awesome|nice|wow/)) {
    return `Thank you! 😊 Deepak would love to connect with you. Feel free to reach out at deepakkumarbsf123@gmail.com or check out his GitHub at github.com/kumardev0. Have any more questions?`;
  }

  // Default
  return `Good question! I can tell you about Deepak's:\n\n• 🚀 **Projects** — 3 live production apps\n• 💻 **Skills** — Node.js, TypeScript, AI, React\n• 🎓 **Education** — B.Tech CS (2026) + Diploma (2022)\n• 💼 **Experience** — Freelance engineer since Jan 2025\n• 💰 **Salary** — ₹1L/month for remote roles\n• 📧 **Contact** — deepakkumarbsf123@gmail.com\n\nJust ask me anything!`;
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
