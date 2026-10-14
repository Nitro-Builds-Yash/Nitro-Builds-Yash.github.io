/* ==========================================================================
   Athota Yashwanth Portfolio - Core Interactive Engine
   Starfield Canvas, 8-Bit Audio Synth, Arcade Game, Skills Filter,
   Radical Interactive Mission Deck (Projects) & Contact Form
   ========================================================================== */

// --- 1. Web Audio API 8-Bit Sound Synthesizer ---
class SoundSynth {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playTone(freq, type = 'square', duration = 0.08, gainVal = 0.08) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted yet or failed
    }
  }

  click() {
    this.playTone(480, 'square', 0.05, 0.04);
  }

  coin() {
    this.playTone(987.77, 'sine', 0.08, 0.08);
    setTimeout(() => this.playTone(1318.51, 'sine', 0.18, 0.08), 80);
  }

  hit() {
    this.playTone(140, 'sawtooth', 0.15, 0.1);
  }

  powerup() {
    const freqs = [330, 392, 659, 523, 587, 784];
    freqs.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'square', 0.06, 0.05), i * 40);
    });
  }
}

const synth = new SoundSynth();

// --- 2. Custom Gamer Cursor ---
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect over clickable items
  document.querySelectorAll('a, button, input, select, textarea, .project-select-item, .skill-item').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      follower.style.transform = 'translate(-50%, -50%) scale(1.6)';
      follower.style.borderColor = 'var(--accent-gold)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.borderColor = 'rgba(255, 183, 3, 0.5)';
    });
  });
}

// --- 3. Dynamic Starfield / Amber Cyber Grid Canvas ---
function initBackgroundCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = [];
  const numStars = Math.min(Math.floor((width * height) / 9000), 120);

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.4,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.7 + 0.2
    });
  }

  function renderStars() {
    ctx.clearRect(0, 0, width, height);

    // Subtle Amber Grid lines
    ctx.strokeStyle = 'rgba(255, 183, 3, 0.025)';
    ctx.lineWidth = 1;
    const gridSize = 65;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.y += s.speedY;
      s.x += s.speedX;

      if (s.y > height) s.y = 0;
      if (s.x > width) s.x = 0;
      if (s.x < 0) s.x = width;

      ctx.fillStyle = `rgba(255, 183, 3, ${s.opacity})`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    }

    requestAnimationFrame(renderStars);
  }
  renderStars();
}

// --- 4. Hero Typewriter Effect ---
function initTypewriter() {
  const target = document.getElementById('termTypewriter');
  if (!target) return;

  const phrases = [
    'omnichunk --parse doc.pdf --retention 98%',
    'fastapi run microservices --latency 35ms',
    'rag.retrieve --hybrid bm25+faiss --recall +28%',
    'voxcode --ast-diff 50000loc in 1.8s',
    'docker compose up --status 99.8% uptime'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      charIdx--;
      target.textContent = current.substring(0, charIdx);
    } else {
      charIdx++;
      target.textContent = current.substring(0, charIdx);
    }

    let delay = isDeleting ? 30 : 60;

    if (!isDeleting && charIdx === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(typeLoop, delay);
  }

  typeLoop();
}

// --- 5. INTERACTIVE MISSION DECK (Radical Projects Showcase) ---
const projectsData = {
  omnichunk: {
    badge: 'FLAGSHIP AI PLATFORM',
    date: 'October 2026',
    title: 'OmniChunk',
    tagline: 'Universal Multi-Modal Chunking & Relational Structure Extraction Engine',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/OmniChunk',
    desc: 'Architected a parsing engine processing 100+ page complex PDFs with multi-column tables, achieving 98% structural text retention. Preserved contextual relationships across 25+ tabular sections per document, boosting downstream semantic search precision by 40%. Implemented a real-time web dashboard allowing boundary validation of 1,000+ extracted chunks per job.',
    metrics: [
      { val: '98%', lbl: 'Structural Text Retention' },
      { val: '100+ Pages', lbl: 'Complex PDF Support' },
      { val: '+40%', lbl: 'Search Precision Boost' }
    ],
    architecture: `[Input: Complex Multi-Column PDFs & Tables]
  ➔ [Gemini Vision API + Layout Segmenter]
  ➔ [Tabular Context Preservation Graph]
  ➔ [Dynamic Fast Microservices API (FastAPI)]
  ➔ [Real-Time WebSocket Chunk Boundary Validator]`,
    stack: ['Python', 'FastAPI', 'Gemini Vision API', 'Docker', 'WebSockets', 'Pydantic']
  },
  pulsus: {
    badge: 'DATA PLATFORM & CRAWLER',
    date: 'October 2026',
    title: 'Pulsus-MedScout',
    tagline: 'Biomedical Literature & Author Intelligence Platform across 34 Repositories',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/Pulsus-MedScout',
    desc: 'Engineered a discovery crawler across 34 journal repositories, aggregating metadata for 20,000+ academic publications. Extracted verified researcher contact records with 95% accuracy and automated scheduled exports into formatted Excel reports. Implemented exponential backoff retries and concurrent workers, boosting crawling throughput by 3x while preventing rate-limiting.',
    metrics: [
      { val: '34 Repos', lbl: 'Journals Crawled' },
      { val: '20,000+', lbl: 'Publications Aggregated' },
      { val: '3x Speed', lbl: 'Worker Concurrency Boost' }
    ],
    architecture: `[34 Scientific Journal Repositories]
  ➔ [Concurrent Async Crawlers + Exponential Backoff]
  ➔ [BeautifulSoup HTML AST & Metadata Extraction]
  ➔ [Automated Contact Verification Pipeline (95% Accuracy)]
  ➔ [Scheduled Excel Automation & Intelligence Reports]`,
    stack: ['Python', 'BeautifulSoup', 'Data Pipelines', 'Excel Automation', 'Async Workers']
  },
  halo: {
    badge: 'HYBRID RAG QA SYSTEM',
    date: 'August 2026',
    title: 'Halo',
    tagline: 'Question-Answering Document Search & Self-Corrective Multi-Doc Reasoning',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/halo',
    desc: 'Constructed a document QA platform processing 50+ concurrent PDF queries with citation confidence scores above 92%. Combined BM25 keyword matching with dense vector embeddings (FAISS), improving retrieval recall by 28% over pure semantic search. Automated unit tests and Docker image publishing via GitHub Actions, reducing deployment validation cycles from 15 to 3 minutes.',
    metrics: [
      { val: '92%+', lbl: 'Citation Confidence Score' },
      { val: '+28%', lbl: 'Recall vs Pure Semantic' },
      { val: '15m ➔ 3m', lbl: 'CI/CD Deployment Cycle' }
    ],
    architecture: `[Query + 50+ Concurrent Research PDFs]
  ➔ [Hybrid Indexing: BM25 Sparse + FAISS Dense Vector]
  ➔ [Verification Gates: Context Relevance & Faithfulness]
  ➔ [Citation Extraction & Confidence Scorer (>92%)]
  ➔ [Automated Docker & GitHub Actions CI/CD Pipeline]`,
    stack: ['Python', 'FAISS', 'BM25 Hybrid', 'Docker', 'GitHub Actions', 'REST APIs']
  },
  voxcode: {
    badge: 'AST DEVELOPER TOOLING',
    date: 'August 2026',
    title: 'VoxCode',
    tagline: 'Voice-Assisted AI Coding Agent & AST Code Navigator with Live Diffing',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/voxcode',
    desc: 'Created an AST-based static code analyzer parsing repositories with 50,000+ lines of Python code in under 1.8 seconds. Indexed symbols, method signatures, and class references to generate accurate multi-file diff patches with zero syntax breakages. Authored automated Shell scripts to run isolated test suites across 10+ target repositories simultaneously.',
    metrics: [
      { val: '<1.8s', lbl: '50k+ LOC AST Indexing' },
      { val: '0 Break', lbl: 'Syntax Diff Patch Accuracy' },
      { val: '10+ Repos', lbl: 'Parallel Test Suite Runner' }
    ],
    architecture: `[Voice Input / Dev Instruction] ➔ [STT & Intent Parser]
  ➔ [Python AST Syntax Tree Indexer (50k+ LOC in 1.8s)]
  ➔ [Symbol Cross-Reference & Multi-File Diff Generator]
  ➔ [Linux Subprocess Test Runner across 10+ Repositories]`,
    stack: ['Python', 'AST Analysis', 'Shell Scripting', 'Git', 'STT / TTS', 'Linux']
  },
  crypto: {
    badge: 'BACKEND SERVICES & MONGOOSE',
    date: 'GitHub Featured',
    title: 'Crypto-Currency-Simulation',
    tagline: 'High-Integrity Backend Model for Educational Cryptocurrency Applications',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/Crypto-Currency-Simulation-main',
    desc: 'A streamlined and secure backend model for an educational cryptocurrency application. Provides foundational APIs for user management, wallet balance reconciliation, and transaction tracking, demonstrating best practices in Mongoose schema design and data relationships.',
    metrics: [
      { val: 'REST API', lbl: 'High-Integrity Endpoints' },
      { val: '100%', lbl: 'Environment Secrets Isolation' },
      { val: 'ACID', lbl: 'Mongoose Relational Integrity' }
    ],
    architecture: `[Client Request] ➔ [Express.js Router & JWT Auth Middleware]
  ➔ [Mongoose Transaction Model & Balance Validator]
  ➔ [MongoDB Relational Schema & Indexed Query Store]`,
    stack: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'REST APIs', 'JWT']
  },
  agamemnon: {
    badge: 'SELF-HOSTED AI LAB',
    date: 'Active Workspace',
    title: 'Agamemnon',
    tagline: 'Self-Hosted AI Workspace for Private Ingestion & Agent Execution',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/agamemnon',
    desc: 'Private, self-hosted AI workspace environment tailored for confidential document ingestion, local RAG retrieval, and secure autonomous developer agent execution without external cloud data leaks.',
    metrics: [
      { val: 'Private', lbl: 'Air-Gapped Data Handling' },
      { val: 'Local RAG', lbl: 'Offline Vector Indexing' },
      { val: 'Docker', lbl: 'Self-Contained Deployment' }
    ],
    architecture: `[Private Code & Data] ➔ [Local Embedding Ingestion]
  ➔ [Self-Hosted Vector Store] ➔ [Offline Autonomous Agent Execution]`,
    stack: ['Python', 'Local LLM', 'Vector DB', 'Docker', 'Privacy Architecture']
  }
};

function renderProjectStage(key) {
  const stage = document.getElementById('projectShowcaseStage');
  const proj = projectsData[key];
  if (!stage || !proj) return;

  stage.innerHTML = `
    <div class="stage-top-bar">
      <div>
        <div class="stage-badge-group">
          <span class="stage-badge">${proj.badge}</span>
          <span class="stage-date"><i class="fa-regular fa-calendar-check"></i> ${proj.date}</span>
        </div>
        <h3 class="stage-title">${proj.title}</h3>
        <p class="stage-tagline">${proj.tagline}</p>
      </div>
      <a href="${proj.repoUrl}" target="_blank" rel="noopener noreferrer" class="stage-github-btn sound-click">
        <i class="fa-brands fa-github"></i> VIEW REPOSITORY
      </a>
    </div>

    <p class="stage-description">${proj.desc}</p>

    <!-- Metrics Benchmarks -->
    <div class="stage-metrics-grid">
      ${proj.metrics.map(m => `
        <div class="metric-box">
          <div class="metric-box-val">${m.val}</div>
          <div class="metric-box-lbl">${m.lbl}</div>
        </div>
      `).join('')}
    </div>

    <!-- Architecture Terminal Box -->
    <div class="stage-arch-box">
      <div class="arch-prompt">
        <i class="fa-solid fa-code-fork"></i> ARCHITECTURE &amp; EXECUTION PIPELINE
      </div>
      <pre style="margin: 0; font-family: var(--font-mono); white-space: pre-wrap;">${proj.architecture}</pre>
    </div>

    <!-- Tech Stack Pills -->
    <div class="stage-stack">
      ${proj.stack.map(s => `<span class="stage-pill">${s}</span>`).join('')}
    </div>
  `;

  // Attach sound click to new elements
  stage.querySelectorAll('.sound-click').forEach(b => {
    b.addEventListener('click', () => synth.click());
  });
}

function initProjectMissionDeck() {
  const items = document.querySelectorAll('.project-select-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      synth.click();
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const projKey = item.getAttribute('data-project');
      renderProjectStage(projKey);
    });
  });

  // Render initial default project
  renderProjectStage('omnichunk');
}

// --- 6. Skills Inventory Filter ---
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-filter-bar .filter-btn');
  const skillItems = document.querySelectorAll('.skills-grid .skill-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      synth.click();
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      skillItems.forEach((item) => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// --- 7. Retro Arcade Mini-Game: Neural Dodge ---
class NeuralDodgeGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.overlay = document.getElementById('gameOverlay');
    this.startBtn = document.getElementById('startGameBtn');
    this.scoreHud = document.getElementById('hudScore');
    this.livesHud = document.getElementById('hudLives');
    this.highScoreDisplay = document.getElementById('highScoreVal');
    this.lastScoreDisplay = document.getElementById('lastScoreVal');

    this.score = 0;
    this.lives = 3;
    this.highScore = parseInt(localStorage.getItem('neural_dodge_highscore') || '0', 10);
    this.highScoreDisplay.textContent = this.highScore;

    this.player = {
      x: 275,
      y: 330,
      width: 50,
      height: 24,
      speed: 7,
      movingLeft: false,
      movingRight: false
    };

    this.items = [];
    this.particles = [];
    this.gameRunning = false;
    this.spawnTimer = 0;
    this.animId = null;

    this.bindEvents();
  }

  bindEvents() {
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => {
        synth.powerup();
        this.startGame();
      });
    }

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.player.movingLeft = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.player.movingRight = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.player.movingLeft = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.player.movingRight = false;
      }
    });

    // Cabinet buttons
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    if (btnLeft && btnRight) {
      const startL = (e) => { e.preventDefault(); this.player.movingLeft = true; synth.click(); };
      const stopL = (e) => { e.preventDefault(); this.player.movingLeft = false; };
      btnLeft.addEventListener('mousedown', startL);
      btnLeft.addEventListener('mouseup', stopL);
      btnLeft.addEventListener('touchstart', startL);
      btnLeft.addEventListener('touchend', stopL);

      const startR = (e) => { e.preventDefault(); this.player.movingRight = true; synth.click(); };
      const stopR = (e) => { e.preventDefault(); this.player.movingRight = false; };
      btnRight.addEventListener('mousedown', startR);
      btnRight.addEventListener('mouseup', stopR);
      btnRight.addEventListener('touchstart', startR);
      btnRight.addEventListener('touchend', stopR);
    }

    const actionA = document.getElementById('btnActionA');
    if (actionA) {
      actionA.addEventListener('click', () => {
        if (!this.gameRunning) this.startGame();
      });
    }
  }

  startGame() {
    this.score = 0;
    this.lives = 3;
    this.items = [];
    this.particles = [];
    this.player.x = (this.canvas.width - this.player.width) / 2;
    this.gameRunning = true;
    this.updateHud();
    this.overlay.style.display = 'none';

    if (this.animId) cancelAnimationFrame(this.animId);
    this.loop();
  }

  gameOver() {
    this.gameRunning = false;
    synth.hit();

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('neural_dodge_highscore', this.highScore);
      this.highScoreDisplay.textContent = this.highScore;
    }

    this.lastScoreDisplay.textContent = this.score;
    const title = document.getElementById('gameTitle');
    const desc = document.getElementById('gameDesc');
    title.textContent = 'SYSTEM BREACHED!';
    title.style.color = 'var(--arcade-red)';
    desc.innerHTML = `Model collapsed! Final Score: <strong>${this.score} pts</strong>. Try again!`;
    this.startBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> INSERT COIN (RETRY)';
    this.overlay.style.display = 'flex';
  }

  updateHud() {
    if (this.scoreHud) this.scoreHud.textContent = this.score;
    if (this.livesHud) {
      let hearts = '';
      for (let i = 0; i < this.lives; i++) hearts += '♥';
      this.livesHud.textContent = hearts || 'DEAD';
    }
  }

  spawnItem() {
    const isGood = Math.random() > 0.38;
    this.items.push({
      x: Math.random() * (this.canvas.width - 30) + 15,
      y: -20,
      radius: isGood ? 10 : 12,
      speed: Math.random() * 2 + 2.5 + this.score * 0.015,
      isGood: isGood,
      label: isGood ? '+10' : 'BUG'
    });
  }

  explode(x, y, color) {
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1,
        color: color
      });
    }
  }

  loop() {
    if (!this.gameRunning) return;

    // Clear
    this.ctx.fillStyle = '#020204';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Movement
    if (this.player.movingLeft && this.player.x > 0) {
      this.player.x -= this.player.speed;
    }
    if (this.player.movingRight && this.player.x < this.canvas.width - this.player.width) {
      this.player.x += this.player.speed;
    }

    // Draw Player (AI Core Vessel with Amber Glow)
    this.ctx.fillStyle = '#ffb703';
    this.ctx.beginPath();
    this.ctx.roundRect(this.player.x, this.player.y, this.player.width, this.player.height, 6);
    this.ctx.fill();

    // Player Core Eye
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(this.player.x + this.player.width / 2 - 4, this.player.y + 6, 8, 8);

    // Spawning items
    this.spawnTimer++;
    if (this.spawnTimer > 35) {
      this.spawnItem();
      this.spawnTimer = 0;
    }

    // Update & draw items
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.y += it.speed;

      // Draw item
      this.ctx.fillStyle = it.isGood ? '#ffb703' : '#ff0055';
      this.ctx.beginPath();
      this.ctx.arc(it.x, it.y, it.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Shadow / Glow
      this.ctx.shadowColor = it.isGood ? '#ffb703' : '#ff0055';
      this.ctx.shadowBlur = 10;

      // Collision Check with player
      if (
        it.y + it.radius >= this.player.y &&
        it.y - it.radius <= this.player.y + this.player.height &&
        it.x + it.radius >= this.player.x &&
        it.x - it.radius <= this.player.x + this.player.width
      ) {
        if (it.isGood) {
          synth.coin();
          this.score += 10;
          this.explode(it.x, it.y, '#ffb703');
        } else {
          synth.hit();
          this.lives--;
          this.explode(it.x, it.y, '#ff0055');
          if (this.lives <= 0) {
            this.updateHud();
            this.gameOver();
            return;
          }
        }
        this.updateHud();
        this.items.splice(i, 1);
        continue;
      }

      // Offscreen
      if (it.y > this.canvas.height + 20) {
        this.items.splice(i, 1);
      }
    }

    this.ctx.shadowBlur = 0;

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.04;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life;
      this.ctx.fillRect(p.x, p.y, 3, 3);
      this.ctx.globalAlpha = 1;
    }

    this.animId = requestAnimationFrame(() => this.loop());
  }
}

// --- 8. Contact Form Handler (Transmit Packet) ---
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('formAlert');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    synth.coin();

    const name = document.getElementById('senderName').value;
    const email = document.getElementById('senderEmail').value;
    const subject = document.getElementById('msgSubject').value;
    const message = document.getElementById('msgContent').value;

    const mailto = `mailto:yashwanthathota@gmail.com?subject=${encodeURIComponent(
      `[Portfolio Signal] ${subject} from ${name}`
    )}&body=${encodeURIComponent(
      `Hi Yashwanth,\n\nName: ${name}\nEmail: ${email}\nMission Type: ${subject}\n\nMessage:\n${message}\n\nSent via Portfolio HUD`
    )}`;

    alertBox.style.display = 'flex';
    alertBox.className = 'form-alert success';
    alertBox.innerHTML = '<i class="fa-solid fa-satellite"></i> <span>Packet encoded! Launching your email client...</span>';

    setTimeout(() => {
      window.location.href = mailto;
    }, 600);
  });
}

// --- 9. Sound Click Event Listeners ---
function initSoundEffects() {
  document.querySelectorAll('.sound-click').forEach((btn) => {
    btn.addEventListener('click', () => synth.click());
  });

  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  if (soundToggle && soundIcon) {
    soundToggle.addEventListener('click', () => {
      synth.enabled = !synth.enabled;
      if (synth.enabled) {
        soundIcon.className = 'fa-solid fa-volume-high';
        soundToggle.style.borderColor = 'var(--accent-gold)';
        synth.coin();
      } else {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        soundToggle.style.borderColor = 'var(--border-subtle)';
      }
    });
  }
}

// --- 10. Mobile Menu & Resume Modal ---
function initUIModals() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      synth.click();
      mobileDrawer.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-drawer .m-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // Resume Modal
  const openResumeBtn = document.getElementById('openResumeBtn');
  const resumeModal = document.getElementById('resumeModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  if (openResumeBtn && resumeModal && closeModalBtn) {
    openResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      synth.click();
      resumeModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
      synth.click();
      resumeModal.classList.remove('active');
    });

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('active');
      }
    });

    if (printResumeBtn) {
      printResumeBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }
}

// --- Initialize All Systems on DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initBackgroundCanvas();
  initTypewriter();
  initProjectMissionDeck();
  initSkillsFilter();
  initContactForm();
  initSoundEffects();
  initUIModals();
  new NeuralDodgeGame();
});
