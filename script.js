/* ==========================================================================
   Athota Yashwanth - Portfolio JavaScript Engine
   Terminal Simulator, Particle Canvas, Typewriter & Interactive Handlers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTypewriter();
  initProjectFilters();
  initTerminal();
  initNavScroll();
});

/* --------------------------------------------------------------------------
   1. Particle Canvas Background
   -------------------------------------------------------------------------- */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const numParticles = Math.min(width > 768 ? 60 : 30, 80);

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.8 + 0.8,
      color: Math.random() > 0.5 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(168, 85, 247, 0.35)'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* --------------------------------------------------------------------------
   2. Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'DevOps & Cloud Platforms',
    'Automated CI/CD Pipelines',
    'Resilient Docker Environments',
    'Agentic AI & Backend Systems',
    'Scalable Cloud Infrastructure'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. Project Filter Tabs
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. Interactive Developer Terminal Shell
   -------------------------------------------------------------------------- */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const history = document.getElementById('terminal-history');
  const clearBtn = document.getElementById('term-clear-btn');
  const quickCmds = document.querySelectorAll('.quick-cmd');
  const terminalBody = document.getElementById('terminal-body');

  if (!input || !history) return;

  const commands = {
    help: () => `
Available Commands:
  whoami         - Display short profile & background
  skills         - List key DevOps & Software Engineering skills
  projects       - Overview of featured production projects
  education      - Academic background & GPA
  certs          - Professional certifications
  contact        - Contact information & links
  cat resume     - View text summary & download link
  sudo hire yashwanth - Run the hiring deployment pipeline
  clear          - Clear terminal output
`,
    whoami: () => `
Athota Yashwanth
Role: Aspiring DevOps & Cloud Engineer | AI/ML Graduate
Location: Hyderabad, India (Open to Gurugram / Pan-India Relocation)
Education: B.Tech CSE (AI & ML) @ MLRITM (GPA: 8.20/10.0)
Specialization: Linux Systems, Docker, AWS/Azure, CI/CD Automation, Scripting
`,
    skills: () => `
[+] Operating Systems: Linux (Ubuntu/Debian, CentOS), Shell/Bash Scripting, Python, Java
[+] Cloud Infra:       AWS (EC2, S3, IAM, VPC, CloudWatch), Azure Solutions, Terraform (IaC)
[+] Containers & CI/CD: Docker, Docker Compose, GitHub Actions, Webhooks, Kubernetes (Basics)
[+] Networking:        TCP/IP, DNS, HTTP/HTTPS, SSH, REST APIs, Load Balancing
[+] Databases:         MySQL, MongoDB
`,
    projects: () => `
1. Halo (GitHub: Nitro-Builds-Yash/halo)
   - Production Agentic QA System with 4 Quality Gates
   - Dockerized multi-stage container deployment & GitHub Actions CI/CD.

2. VoxCode (GitHub: Nitro-Builds-Yash/voxcode)
   - Voice-Native Code Execution & Patch Engine
   - AST analysis, Bash automation scripts, and process isolation.

3. Smart AI Hotel Reservation Platform
   - Next.js + Node.js/Express + MongoDB + Docker + Gemini AI.

4. Crypto-Currency Backend Simulator
   - Secure REST API with MySQL, JWT, and secrets isolation.
`,
    education: () => `
[2022 - 2026] B.Tech CSE (AI & ML) - MLRITM | GPA: 8.20 / 10.0
[2020 - 2022] Intermediate (MPC) - Vignan Junior College | Marks: 836 / 1000
[2019 - 2020] SSC Board - Bhashyam High School | GPA: 10.0 / 10.0
`,
    certs: () => `
• Designing & Implementing Microsoft Azure AI Solutions (Infosys ICT Academy)
• Data Analytics Job Simulation (Deloitte)
• Salesforce Certified Agentforce Specialist (Salesforce)
• Introduction to Python for Development & Automation (DataCamp)
`,
    contact: () => `
Email:    yashwanthathota@gmail.com
Phone:    +91 7989987012
LinkedIn: https://linkedin.com/in/athota-yashwanth
GitHub:   https://github.com/Nitro-Builds-Yash
`,
    'cat resume': () => `
[✓] Resume PDF available for download!
Direct File: Athota_Yashwanth_Resume.pdf
Click the 'Download CV' button on top or use the download link in the navbar.
`,
    'sudo hire yashwanth': () => `
[sudo] password for visitor: **********
Authenticating hiring manager credentials... [OK]
Checking qualifications... [PASSED: Linux, Docker, AWS, CI/CD, Problem Solving]
Deploying offer letter... [READY]
Status: SUCCESS! Athota Yashwanth is an immediate joiner and ready to make an impact.
Contact at yashwanthathota@gmail.com / +91 7989987012
`
  };

  function executeCommand(cmdText) {
    const cleanCmd = cmdText.trim().toLowerCase();
    if (!cleanCmd) return;

    if (cleanCmd === 'clear') {
      history.innerHTML = '';
      return;
    }

    const outputDiv = document.createElement('div');
    outputDiv.className = 'term-output';

    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-output-cmd';
    cmdLine.innerHTML = `<span class="term-prompt"><span class="user">yashwanth</span>@<span class="host">cloud</span>:<span class="dir">~</span>$ </span>${escapeHtml(cmdText)}`;

    const textLine = document.createElement('div');
    textLine.className = 'term-output-text';

    if (commands[cleanCmd]) {
      textLine.textContent = commands[cleanCmd]();
    } else {
      textLine.innerHTML = `<span style="color: #ef4444;">command not found: ${escapeHtml(cleanCmd)}. Type <span style="color: #fbbf24;">'help'</span> for list of commands.</span>`;
    }

    outputDiv.appendChild(cmdLine);
    outputDiv.appendChild(textLine);
    history.appendChild(outputDiv);

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      executeCommand(val);
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      history.innerHTML = '';
    });
  }

  quickCmds.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* --------------------------------------------------------------------------
   5. Navigation & Mobile Menu Scroll
   -------------------------------------------------------------------------- */
function initNavScroll() {
  const toggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
      });
    });
  }

  // Active section tracking on scroll
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Utilities: Copy to Clipboard & Contact Form
   -------------------------------------------------------------------------- */
function copyToClipboard(text, message = 'Copied to clipboard!') {
  navigator.clipboard.writeText(text).then(() => {
    showToast(message);
  }).catch(() => {
    showToast('Failed to copy');
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('sender-name').value;
  const email = document.getElementById('sender-email').value;
  const subject = document.getElementById('sender-subject').value;
  const message = document.getElementById('sender-message').value;

  const mailtoLink = `mailto:yashwanthathota@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Yashwanth,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
  window.location.href = mailtoLink;

  showToast('Opening your email client to send message...');
  e.target.reset();
}
