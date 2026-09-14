/* ==========================================================================
   Athota Yashwanth - Portfolio JavaScript Engine v2.5
   Terminal Simulator, Matrix Canvas, CI/CD Engine, Modals & 3D Tilt
   ========================================================================== */

let matrixMode = false;
let matrixInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  initThemes();
  initParticles();
  initTypewriter();
  initProjectFilters();
  initTerminal();
  initNavScroll();
  initPipeline();
  initTilt();
  initCursorGlow();
  fetchGitHubStats();
});

/* --------------------------------------------------------------------------
   0. Theme Switcher Engine
   -------------------------------------------------------------------------- */
function initThemes() {
  const savedTheme = localStorage.getItem('portfolio-theme') || 'cyan';
  setTheme(savedTheme);

  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeMenu = document.getElementById('theme-menu');

  if (themeBtn && themeMenu) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      themeMenu.classList.remove('show');
    });

    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        setTheme(theme);
        themeMenu.classList.remove('show');
      });
    });
  }
}

function setTheme(themeName) {
  document.body.setAttribute('data-theme', themeName);
  localStorage.setItem('portfolio-theme', themeName);

  document.querySelectorAll('.theme-option').forEach(btn => {
    if (btn.getAttribute('data-theme') === themeName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   1. Particle Canvas Background & Matrix Easter Egg
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
    if (matrixMode) return;

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

function toggleMatrixMode() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  matrixMode = !matrixMode;

  if (matrixMode) {
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const chars = '0123456789ABCDEF0101010101XYZ';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    matrixInterval = setInterval(() => {
      ctx.fillStyle = 'rgba(10, 14, 23, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#10b981';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 45);

    showToast('Matrix Rain Mode Activated! Type "matrix" again to exit.');
  } else {
    clearInterval(matrixInterval);
    initParticles();
    showToast('Returned to Particle Mode');
  }
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
/* --------------------------------------------------------------------------
   4. Interactive Developer Terminal Shell v2.5
   -------------------------------------------------------------------------- */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const history = document.getElementById('terminal-history');
  const clearBtn = document.getElementById('term-clear-btn');
  const quickCmds = document.querySelectorAll('.quick-cmd');
  const terminalBody = document.getElementById('terminal-body');

  if (!input || !history) return;

  const cmdHistoryList = [];
  let cmdHistoryIndex = -1;

  const commands = {
    help: () => `
Available Commands:
  whoami              - Display short profile & background
  skills              - List key DevOps & Software Engineering skills
  projects            - Overview of featured production projects
  education           - Academic background & GPA
  certs               - Professional certifications
  docker ps           - List simulated active Docker containers
  kubectl get pods    - List Kubernetes pod cluster state
  git log             - View recent Git commit history
  matrix              - Toggle Cyberpunk Matrix digital rain
  theme <name>        - Switch theme (cyan | violet | emerald | amber)
  pipeline            - Trigger live CI/CD pipeline simulation
  contact             - Contact information & links
  cat resume          - View text summary & open resume viewer
  sudo hire yashwanth - Run the hiring deployment pipeline
  clear               - Clear terminal output
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
[+] Networking:        TCP/IP, DNS, HTTP/HTTPS, SSH, REST APIs, Reverse Proxy, Load Balancing
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
    'docker ps': () => `
CONTAINER ID   IMAGE                COMMAND                  CREATED         STATUS         PORTS                    NAMES
8f9e12a4b0c1   yash/halo-qa:v2.1    "uvicorn main:app"       2 hours ago     Up 2 hours     0.0.0.0:8000->8000/tcp   halo-production
7c3a91b2e4f0   yash/voxcode:latest  "python worker.py"       5 hours ago     Up 5 hours     0.0.0.0:5050->5050/tcp   voxcode-daemon
4d2e88a1f7c3   mysql:8.0-debian     "docker-entrypoint.s…"   1 day ago       Up 1 day       0.0.0.0:3306->3306/tcp   prod-mysql-cluster
1a0f55c8e2b9   nginx:alpine         "/docker-entrypoint…"    1 day ago       Up 1 day       0.0.0.0:80->80/tcp       reverse-proxy-gateway
`,
    'kubectl get pods': () => `
NAME                                READY   STATUS    RESTARTS   AGE     IP             NODE
halo-backend-deployment-7f89c-4x9z   1/1     Running   0          4h12m   10.244.1.18    worker-node-01
voxcode-patcher-64bc98df-8k2l1       1/1     Running   0          6h45m   10.244.2.09    worker-node-02
auth-service-599fd878-9p4mq          1/1     Running   0          12h     10.244.1.25    worker-node-01
redis-cache-master-0                 1/1     Running   0          24h     10.244.3.04    worker-node-03
`,
    'git log': () => `
commit 88f9138a65a8454238f2090cbbda774c53871753 (HEAD -> main, origin/main)
Author: Athota Yashwanth <yashwanthathota@gmail.com>
Date:   Mon Sep 14 2026

    feat: supercharge portfolio with live CI/CD simulator and deep-dive modals
    
commit a4c29188f6e4312b988f01ac554a98e100fca889
Author: Athota Yashwanth <yashwanthathota@gmail.com>
Date:   Mon Sep 14 2026

    feat: add glassmorphic dark theme, terminal emulator, and project architecture
`,
    matrix: () => {
      toggleMatrixMode();
      return matrixMode ? 'Initializing Matrix digital rain protocol...' : 'Restoring standard particle field...';
    },
    pipeline: () => {
      triggerPipeline();
      return 'Triggering Live CI/CD Pipeline Simulator above...';
    },
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
    'cat resume': () => {
      setTimeout(() => openResumeModal(), 500);
      return `[✓] Opening in-browser resume viewer modal...
Direct PDF: Athota_Yashwanth_Resume.pdf`;
    },
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
    const cleanCmd = cmdText.trim();
    if (!cleanCmd) return;

    cmdHistoryList.push(cleanCmd);
    cmdHistoryIndex = cmdHistoryList.length;

    if (cleanCmd.toLowerCase() === 'clear') {
      history.innerHTML = '';
      return;
    }

    const outputDiv = document.createElement('div');
    outputDiv.className = 'term-output';

    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-output-cmd';
    cmdLine.innerHTML = `<span class="term-prompt"><span class="user">yashwanth</span>@<span class="host">cloud</span>:<span class="dir">~</span>$ </span>${escapeHtml(cleanCmd)}`;

    const textLine = document.createElement('div');
    textLine.className = 'term-output-text';

    const lowerCmd = cleanCmd.toLowerCase();

    if (lowerCmd.startsWith('theme ')) {
      const themeName = lowerCmd.split(' ')[1];
      if (['cyan', 'violet', 'emerald', 'amber'].includes(themeName)) {
        setTheme(themeName);
        textLine.textContent = `[✓] Switched theme to '${themeName}'`;
      } else {
        textLine.innerHTML = `<span style="color: #ef4444;">Unknown theme: '${themeName}'. Choose: cyan, violet, emerald, amber.</span>`;
      }
    } else if (commands[lowerCmd]) {
      textLine.textContent = commands[lowerCmd]();
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
    } else if (e.key === 'ArrowUp') {
      if (cmdHistoryList.length > 0 && cmdHistoryIndex > 0) {
        cmdHistoryIndex--;
        input.value = cmdHistoryList[cmdHistoryIndex];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (cmdHistoryIndex < cmdHistoryList.length - 1) {
        cmdHistoryIndex++;
        input.value = cmdHistoryList[cmdHistoryIndex];
      } else {
        cmdHistoryIndex = cmdHistoryList.length;
        input.value = '';
      }
      e.preventDefault();
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
   5. Interactive CI/CD Pipeline Simulator
   -------------------------------------------------------------------------- */
let isPipelineRunning = false;

function initPipeline() {
  const triggerBtn = document.getElementById('trigger-pipeline-btn');
  const resetBtn = document.getElementById('reset-pipeline-btn');

  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      triggerPipeline();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetPipeline();
    });
  }
}

function appendLog(msg, type = 'normal') {
  const consoleBody = document.getElementById('pipeline-logs');
  const consoleTime = document.getElementById('console-time');
  if (!consoleBody) return;

  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  if (consoleTime) consoleTime.textContent = timeStr;

  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  line.textContent = `[${timeStr}] ${msg}`;
  consoleBody.appendChild(line);
  consoleBody.scrollTop = consoleBody.scrollHeight;
}

function triggerPipeline() {
  if (isPipelineRunning) {
    showToast('Pipeline is already running!');
    return;
  }

  isPipelineRunning = true;
  resetPipeline(false);

  const statusBadge = document.getElementById('pipeline-status-badge');
  const statusText = document.getElementById('pipeline-status-text');
  const dot = statusBadge ? statusBadge.querySelector('.pipeline-dot') : null;

  if (dot) {
    dot.className = 'pipeline-dot running';
  }
  if (statusText) {
    statusText.textContent = 'Pipeline Status: RUNNING (Stage 1/5)';
  }

  appendLog('▶ Workflow Trigger: push to branch main by @Nitro-Builds-Yash', 'info');

  // Stage 1: Git Commit
  setNodeState(1, 'active', 'Committed');
  appendLog('git commit -m "feat(halo): optimize quality gate latency"', 'normal');

  setTimeout(() => {
    setNodeState(1, 'success', 'Passed');
    energizeConnector(1);
    setNodeState(2, 'active', 'Running...');
    if (statusText) statusText.textContent = 'Pipeline Status: RUNNING (Stage 2/5)';
    appendLog('pytest tests/ --cov=app --cov-report=term-missing', 'normal');
    appendLog('✓ 42 unit tests passed in 1.48s | Code Coverage: 98.4%', 'success');
    appendLog('ruff check . && ruff format --check (0 errors)', 'success');
  }, 1200);

  // Stage 3: Docker Build
  setTimeout(() => {
    setNodeState(2, 'success', 'Passed');
    energizeConnector(2);
    setNodeState(3, 'active', 'Building...');
    if (statusText) statusText.textContent = 'Pipeline Status: RUNNING (Stage 3/5)';
    appendLog('docker build --target production -t nitro-halo:v2.1 .', 'normal');
    appendLog('✓ Layer caching optimized: Multi-stage image size 184MB', 'info');
    appendLog('✓ Pushed image to Amazon ECR registry (digest: sha256:88f9...)', 'success');
  }, 2600);

  // Stage 4: Cloud Deploy
  setTimeout(() => {
    setNodeState(3, 'success', 'Passed');
    energizeConnector(3);
    setNodeState(4, 'active', 'Deploying...');
    if (statusText) statusText.textContent = 'Pipeline Status: RUNNING (Stage 4/5)';
    appendLog('aws ecs update-service --cluster yashwanth-cloud-cluster --service halo-svc', 'normal');
    appendLog('✓ Rolling update deployed across 2 availability zones (ap-south-1)', 'success');
  }, 4000);

  // Stage 5: Health Check
  setTimeout(() => {
    setNodeState(4, 'success', 'Passed');
    energizeConnector(4);
    setNodeState(5, 'active', 'Probing...');
    if (statusText) statusText.textContent = 'Pipeline Status: RUNNING (Stage 5/5)';
    appendLog('curl -f https://halo.api/healthz (HTTP 200 OK | latency 14ms)', 'normal');
  }, 5200);

  // Completion
  setTimeout(() => {
    setNodeState(5, 'success', 'Healthy');
    if (dot) dot.className = 'pipeline-dot success';
    if (statusText) statusText.textContent = 'Pipeline Status: ALL CHECKS PASSED (100% Uptime)';
    appendLog('★ Continuous Deployment Workflow Completed Successfully! (Total: 6.2s)', 'success');
    isPipelineRunning = false;
    showToast('CI/CD Pipeline Run Completed: All Quality Gates Passed!');
  }, 6400);
}

function setNodeState(nodeNum, state, badgeText) {
  const node = document.getElementById(`node-${nodeNum}`);
  if (!node) return;
  node.className = `pipe-node ${state}`;
  const badge = node.querySelector('.node-badge');
  if (badge && badgeText) badge.textContent = badgeText;
}

function energizeConnector(connNum) {
  const conn = document.getElementById(`conn-${connNum}`);
  if (conn) conn.classList.add('energized');
}

function resetPipeline(clearLogs = true) {
  for (let i = 1; i <= 5; i++) {
    const node = document.getElementById(`node-${i}`);
    if (node) {
      node.className = 'pipe-node';
      const badge = node.querySelector('.node-badge');
      if (badge) badge.textContent = 'Pending';
    }
  }

  for (let i = 1; i <= 4; i++) {
    const conn = document.getElementById(`conn-${i}`);
    if (conn) conn.classList.remove('energized');
  }

  const statusBadge = document.getElementById('pipeline-status-badge');
  const statusText = document.getElementById('pipeline-status-text');
  const dot = statusBadge ? statusBadge.querySelector('.pipeline-dot') : null;
  if (dot) dot.className = 'pipeline-dot idle';
  if (statusText) statusText.textContent = 'Pipeline Status: IDLE / READY';

  if (clearLogs) {
    const consoleBody = document.getElementById('pipeline-logs');
    if (consoleBody) {
      consoleBody.innerHTML = '<div class="log-line text-muted">Ready to simulate pipeline. Click \'Trigger Pipeline Run\' to start continuous deployment workflow.</div>';
    }
  }
}

/* --------------------------------------------------------------------------
   6. Modals (Resume Viewer & Project Deep Dive)
   -------------------------------------------------------------------------- */
function openResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) modal.classList.add('show');
}

function closeResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) modal.classList.remove('show');
}

const projectDetailsData = {
  halo: {
    title: 'Halo – Production Agentic QA System',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/halo',
    content: `
      <div class="proj-detail-grid">
        <p><strong>Halo</strong> is an enterprise RAG QA platform designed to prevent LLM hallucinations using 4 automated verification gates.</p>
        
        <div class="proj-metrics-row">
          <div class="proj-m-card">
            <div class="proj-m-val">4 Gates</div>
            <div class="proj-m-lbl">Quality Checks</div>
          </div>
          <div class="proj-m-card">
            <div class="proj-m-val">100%</div>
            <div class="proj-m-lbl">Dockerized</div>
          </div>
          <div class="proj-m-card">
            <div class="proj-m-val">&lt;800ms</div>
            <div class="proj-m-lbl">Latency Engine</div>
          </div>
        </div>

        <div class="proj-arch-box">
          <span style="color: var(--accent-cyan); font-weight:700;"># Architecture & DevOps Pipeline</span><br>
          [PDF Document Input] ➔ [Chunking & Hybrid Indexing (BM25 + ChromaDB)]<br>
          ➔ [Gate 1: Context Relevance] ➔ [Gate 2: Citation Accuracy]<br>
          ➔ [Gate 3: Faithfulness Metric] ➔ [Gate 4: Fallback & Retry Logic]<br>
          ➔ [Dockerized Multi-Stage Container] ➔ [GitHub Actions CI/CD Pipeline]
        </div>

        <div>
          <h4>Key DevOps & Engineering Implementations:</h4>
          <ul style="padding-left: 1.2rem; color: var(--text-secondary); margin-top: 0.5rem; line-height: 1.7;">
            <li>Built isolated container environments with multi-stage Dockerfiles reducing image size by 65%.</li>
            <li>Implemented automated GitHub Actions workflows with linting, unit testing, and test coverage checks.</li>
            <li>Structured health check endpoints (<code>/healthz</code>) for live monitoring and high uptime.</li>
          </ul>
        </div>
      </div>
    `
  },
  voxcode: {
    title: 'VoxCode – Voice-Native Code Patch Engine',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/voxcode',
    content: `
      <div class="proj-detail-grid">
        <p><strong>VoxCode</strong> parses multi-file codebase AST syntax trees, interprets voice-driven engineering instructions, and executes verified real-time patches.</p>
        
        <div class="proj-metrics-row">
          <div class="proj-m-card">
            <div class="proj-m-val">AST Native</div>
            <div class="proj-m-lbl">Syntax Tree</div>
          </div>
          <div class="proj-m-card">
            <div class="proj-m-val">100%</div>
            <div class="proj-m-lbl">Bash Automated</div>
          </div>
          <div class="proj-m-card">
            <div class="proj-m-val">Zero-Drift</div>
            <div class="proj-m-lbl">Patch Engine</div>
          </div>
        </div>

        <div class="proj-arch-box">
          <span style="color: var(--accent-cyan); font-weight:700;"># Process Execution Flow</span><br>
          [Voice Audio / Command] ➔ [Speech-to-Text AST Parser]<br>
          ➔ [Linux Subprocess Worker] ➔ [Git Diff Preview & Test Suite Execution]<br>
          ➔ [Automated Release Pipeline with Semantic Version Tagging]
        </div>

        <div>
          <h4>Key Systems & Automation Highlights:</h4>
          <ul style="padding-left: 1.2rem; color: var(--text-secondary); margin-top: 0.5rem; line-height: 1.7;">
            <li>Created robust Bash shell scripts for environment dependency isolation and automated testing.</li>
            <li>Configured GitHub release pipelines with automated version tagging and cross-platform verification.</li>
            <li>Engineered Linux subprocess management routines to safely execute code modifications.</li>
          </ul>
        </div>
      </div>
    `
  },
  hotel: {
    title: 'Smart AI Hotel Reservation Platform',
    repoUrl: 'https://github.com/Nitro-Builds-Yash',
    content: `
      <div class="proj-detail-grid">
        <p>Full-stack containerized hotel reservation platform with live room availability, JWT authentication, Gemini AI recommendations, and real-time management dashboard.</p>
        
        <div class="proj-metrics-row">
          <div class="proj-m-card">
            <div class="proj-m-val">Full-Stack</div>
            <div class="proj-m-lbl">Next.js + Node</div>
          </div>
          <div class="proj-m-card">
            <div class="proj-m-val">JWT &amp; RBAC</div>
            <div class="proj-m-lbl">Security Auth</div>
          </div>
          <div class="proj-m-card">
            <div class="proj-m-val">MongoDB</div>
            <div class="proj-m-lbl">Indexed Database</div>
          </div>
        </div>

        <div>
          <h4>Key Features & Architecture:</h4>
          <ul style="padding-left: 1.2rem; color: var(--text-secondary); margin-top: 0.5rem; line-height: 1.7;">
            <li>Dockerized backend microservices with volume mounts for continuous local staging and cloud parity.</li>
            <li>Role-based access control (Admin / Guest) with JWT cookie secrets protection.</li>
            <li>Integrated Google Gemini AI for smart room recommendations and conversational booking assistance.</li>
          </ul>
        </div>
      </div>
    `
  },
  crypto: {
    title: 'Crypto-Currency API & Backend Simulator',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/Crypto-Currency-Simulation-main',
    content: `
      <div class="proj-detail-grid">
        <p>High-security RESTful API simulating cryptocurrency transactions, ledger integrity, wallet management, and user authentication with isolated environment configurations.</p>
        
        <div class="proj-metrics-row">
          <div class="proj-m-card">
            <div class="proj-m-val">REST API</div>
            <div class="proj-m-lbl">Express.js</div>
          </div>
          <div class="proj-m-card">
            <div class="proj-m-val">MySQL</div>
            <div class="proj-m-lbl">Relational Schema</div>
          </div>
          <div class="proj-m-card">
            <div class="proj-m-val">Secrets Isolation</div>
            <div class="proj-m-lbl">.env Guarding</div>
          </div>
        </div>

        <div>
          <h4>Key Engineering Highlights:</h4>
          <ul style="padding-left: 1.2rem; color: var(--text-secondary); margin-top: 0.5rem; line-height: 1.7;">
            <li>Strict <code>.env</code> secrets isolation and environment decoupling.</li>
            <li>Optimized relational database queries and transactional consistency using MySQL.</li>
            <li>Comprehensive API endpoint documentation with structured HTTP response standards.</li>
          </ul>
        </div>
      </div>
    `
  }
};

function openProjectModal(projKey) {
  const data = projectDetailsData[projKey];
  if (!data) return;

  const modal = document.getElementById('project-modal');
  const titleEl = document.getElementById('proj-modal-title');
  const linkEl = document.getElementById('proj-modal-gh-link');
  const contentEl = document.getElementById('proj-modal-content');

  if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-cube"></i> <span>${data.title}</span>`;
  if (linkEl) linkEl.href = data.repoUrl;
  if (contentEl) contentEl.innerHTML = data.content;

  if (modal) modal.classList.add('show');
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) modal.classList.remove('show');
}

function handleModalBackdropClick(e, modalId) {
  if (e.target.id === modalId) {
    if (modalId === 'resume-modal') closeResumeModal();
    if (modalId === 'project-modal') closeProjectModal();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeResumeModal();
    closeProjectModal();
  }
});

/* --------------------------------------------------------------------------
   7. 3D Card Tilt & Cursor Follower Glow
   -------------------------------------------------------------------------- */
function initTilt() {
  if (window.innerWidth <= 768) return;

  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || window.innerWidth <= 768) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

/* --------------------------------------------------------------------------
   8. Live GitHub Stats Fetcher
   -------------------------------------------------------------------------- */
async function fetchGitHubStats() {
  try {
    const res = await fetch('https://api.github.com/users/Nitro-Builds-Yash');
    if (res.ok) {
      const data = await res.json();
      const reposCountEl = document.getElementById('gh-repos-count');
      if (reposCountEl && data.public_repos) {
        reposCountEl.textContent = `${data.public_repos}+`;
      }
    }
  } catch (err) {
    // Graceful fallback to static numbers
  }
}

/* --------------------------------------------------------------------------
   9. Navigation, Mobile Menu & Utilities
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
