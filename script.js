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
    this.playTone(110, 'sawtooth', 0.18, 0.12);
  }

  laser() {
    // Pitch-shifted descending space cannon
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch(e) {}
  }

  odysseyHorn() {
    // Cinematic ominous brass/synthesizer drone chord (Pitch tone of The Odyssey)
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      [65.41, 98.00, 130.81, 196.00].forEach((f) => { // C2 / G2 cinematic pitch
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.2);
      });
    } catch(e) {}
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
      follower.style.borderColor = 'var(--neon-cyan)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.borderColor = 'rgba(0, 240, 255, 0.4)';
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

    // Subtle Lite Blue Grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.025)';
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

      ctx.fillStyle = `rgba(56, 189, 248, ${s.opacity})`;
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
    badge: 'LEGENDARY ARTIFACT &bull; TIER 5 AI ENGINE',
    date: 'October 2026',
    title: 'OmniChunk',
    tagline: 'Universal Multi-Modal Chunking & Relational Structure Extraction Engine',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/OmniChunk',
    desc: 'Forged an extraction engine capable of devouring 100+ page complex PDFs with multi-column tables, achieving 98% structural text retention. Preserved contextual relationships across 25+ tabular dungeons per scroll, boosting downstream semantic search precision by 40%. Implemented a real-time command dashboard allowing boundary validation of 1,000+ extracted chunks per raid.',
    metrics: [
      { val: '98%', lbl: 'Critical Text Retention' },
      { val: '100+ Pages', lbl: 'Raid Dungeon Depth' },
      { val: '+40%', lbl: 'Search Accuracy Buff' }
    ],
    architecture: `[Input: Complex Multi-Column PDFs & Tables]
  ➔ [Gemini Vision API + Layout Segmenter]
  ➔ [Tabular Context Preservation Graph]
  ➔ [Dynamic Fast Microservices API (FastAPI)]
  ➔ [Real-Time WebSocket Chunk Boundary Validator]`,
    stack: ['Python', 'FastAPI', 'Gemini Vision API', 'Docker', 'WebSockets', 'Pydantic']
  },
  omniscout: {
    badge: 'GUILD INTEL CRAWLER &bull; 55 REPOSITORIES',
    date: 'October 2026',
    title: 'OmniScout // OMICS International',
    tagline: 'Biomedical Literature & Author Intelligence Platform across 55 Repositories',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/OmniScout',
    desc: 'Engineered an enterprise biomedical literature and researcher discovery platform for OMICS International. Crawls and aggregates metadata across 55 journal repositories (Europe PMC, PubMed, Crossref, PLOS, arXiv, bioRxiv/medRxiv). Enforces a strict Zero-Gmail policy for high-deliverability academic outreach, 3-field completeness guarantee (Paper Title, Author Name, Email ID), and auto-routed multi-LLM entity extraction (Gemini & OpenRouter).',
    metrics: [
      { val: '55 Repos', lbl: 'Active Sources Indexed' },
      { val: '0% Gmail', lbl: 'Institutional Verified' },
      { val: '5 Concurrent', lbl: 'Parallel Extraction Jobs' }
    ],
    architecture: `[User Topic Query & Filters (Country, Year Range)]
  ➔ [Parallel Multi-Engine Search across 10-55 Sources]
  ➔ [DOI Normalization & Open PDF Fetch (pdfplumber)]
  ➔ [AI Router: Gemini / OpenRouter Free-Model Failover]
  ➔ [Strict 3-Field Contract + DNS MX & SMTP Handshake Check]
  ➔ [Formatted Excel (.xlsx) Export & Real-Time Flask UI]`,
    stack: ['Python 3.10+', 'Flask 3.0', 'Gemini API', 'OpenRouter', 'pdfplumber', 'Tailwind', 'Excel Automation']
  },
  mimicmail: {
    badge: 'STEALTH BROWSER ENGINE &bull; PLAYWRIGHT',
    date: 'October 2026',
    title: 'MimicMail',
    tagline: 'Humanized Outreach Automation Platform with Browser Session Persistence',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/MimicMail',
    desc: 'Architected a clinical-grade, stealth outreach automation platform for Zoho Mail. Bypasses rigid SMTP bulk-sender penalties by orchestrating authentic browser interactions via Playwright with persistent session cookies, anti-bot behavioral jitter (±15-35s), and 5-slot randomized HTML template rotation to eliminate spam fingerprinting.',
    metrics: [
      { val: '0% SMTP Trap', lbl: 'Genuine Browser Dispatch' },
      { val: '5 Slots', lbl: 'Randomized Template Pool' },
      { val: 'Dual Window', lbl: 'Multi-Instance Concurrency' }
    ],
    architecture: `[Recipients Excel (.xlsx)] ➔ [Tkinter Mission Control GUI]
  ➔ [Playwright Chromium Engine (Persistent Zoho Session)]
  ➔ [5-Slot Randomized Template Selector + Variable Ingestion]
  ➔ [Anti-Bot Behavioral Jitter Delay (1.0-5.0m ±15-35s)]
  ➔ [Real-Time Deliverability Ratio Breakdown Canvas & Disk Sync]`,
    stack: ['Python 3.10+', 'Playwright', 'Chromium Automation', 'Tkinter Modern GUI', 'OpenPyXL', 'Asyncio']
  },
  halo: {
    badge: 'ORACLE RAG QA &bull; SAGE CLASS',
    date: 'August 2026',
    title: 'Halo',
    tagline: 'Question-Answering Document Search & Self-Corrective Multi-Doc Reasoning',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/halo',
    desc: 'Summoned a document QA oracle processing 50+ concurrent queries with citation confidence scores above 92%. Combined BM25 keyword matching with dense vector embeddings (FAISS), improving retrieval recall by 28% over pure semantic search. Automated unit tests and Docker image publishing via GitHub Actions, reducing deployment validation cycles from 15 to 3 minutes.',
    metrics: [
      { val: '92%+', lbl: 'Citation Faithfulness' },
      { val: '+28%', lbl: 'Recall vs Pure Semantic' },
      { val: '15m ➔ 3m', lbl: 'Deployment Velocity' }
    ],
    architecture: `[Query + 50+ Concurrent Research PDFs]
  ➔ [Hybrid Indexing: BM25 Sparse + FAISS Dense Vector]
  ➔ [Verification Gates: Context Relevance & Faithfulness]
  ➔ [Citation Extraction & Confidence Scorer (>92%)]
  ➔ [Automated Docker & GitHub Actions CI/CD Pipeline]`,
    stack: ['Python', 'FAISS', 'BM25 Hybrid', 'Docker', 'GitHub Actions', 'REST APIs']
  },
  voxcode: {
    badge: 'VOICE AST ASSISTANT &bull; CYBER SPELLBOOK',
    date: 'August 2026',
    title: 'VoxCode',
    tagline: 'Voice-Assisted AI Coding Agent & AST Code Navigator with Live Diffing',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/voxcode',
    desc: 'Created an AST static code analyzer parsing repositories with 50,000+ lines of Python code in under 1.8 seconds. Indexed symbols, method signatures, and class references to generate accurate multi-file diff patches with zero syntax breakages. Authored automated Shell scripts to run isolated test suites across 10+ target repositories simultaneously.',
    metrics: [
      { val: '<1.8s', lbl: '50k+ LOC Cast Speed' },
      { val: '0 Break', lbl: 'Syntax Patch Accuracy' },
      { val: '10+ Arenas', lbl: 'Parallel Test Suite Runner' }
    ],
    architecture: `[Voice Input / Dev Instruction] ➔ [STT & Intent Parser]
  ➔ [Python AST Syntax Tree Indexer (50k+ LOC in 1.8s)]
  ➔ [Symbol Cross-Reference & Multi-File Diff Generator]
  ➔ [Linux Subprocess Test Runner across 10+ Repositories]`,
    stack: ['Python', 'AST Analysis', 'Shell Scripting', 'Git', 'STT / TTS', 'Linux']
  },
  crypto: {
    badge: 'VAULT INFRASTRUCTURE &bull; SECURITY CLASS',
    date: 'GitHub Featured',
    title: 'Crypto-Currency-Simulation',
    tagline: 'High-Integrity Backend Model for Educational Cryptocurrency Applications',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/Crypto-Currency-Simulation-main',
    desc: 'Fortified backend model for an educational cryptocurrency vault. Provides foundational APIs for user management, wallet balance reconciliation, and transaction tracking, demonstrating best practices in Mongoose schema design and transaction atomicity.',
    metrics: [
      { val: 'REST API', lbl: 'Fortified Endpoints' },
      { val: '100%', lbl: 'Secret Vault Isolation' },
      { val: 'ACID', lbl: 'Mongoose Integrity' }
    ],
    architecture: `[Client Request] ➔ [Express.js Router & JWT Auth Middleware]
  ➔ [Mongoose Transaction Model & Balance Validator]
  ➔ [MongoDB Relational Schema & Indexed Query Store]`,
    stack: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'REST APIs', 'JWT']
  },
  agamemnon: {
    badge: 'AIR-GAPPED CITADEL &bull; SHADOW LAB',
    date: 'Active Workspace',
    title: 'Agamemnon',
    tagline: 'Self-Hosted AI Workspace for Private Ingestion & Agent Execution',
    repoUrl: 'https://github.com/Nitro-Builds-Yash/agamemnon',
    desc: 'Private, self-hosted AI citadel tailored for confidential document ingestion, local RAG retrieval, and secure autonomous developer agent execution without external cloud leaks.',
    metrics: [
      { val: 'Air-Gapped', lbl: 'Citadel Isolation' },
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

// --- 7. The Grand Odyssey Multi-Game Arcade Engine ---
class OdysseyArcadeManager {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.overlay = document.getElementById('gameOverlay');
    this.startBtn = document.getElementById('startGameBtn');
    this.titleEl = document.getElementById('gameTitle');
    this.descEl = document.getElementById('gameDesc');
    this.instructionsEl = document.getElementById('gameInstructions');
    this.marqueeEl = document.getElementById('marqueeText');

    this.scoreHud = document.getElementById('hudScore');
    this.livesHud = document.getElementById('hudLives');
    this.highScoreDisplay = document.getElementById('highScoreVal');
    this.lastScoreDisplay = document.getElementById('lastScoreVal');

    this.currentGame = 'dodge'; // 'dodge' | 'cyclops' | 'tapestry'
    this.score = 0;
    this.lives = 3;
    this.gameRunning = false;
    this.animId = null;

    // Game 1 & 2: Ship / Player state
    this.player = {
      x: 275,
      y: 330,
      width: 48,
      height: 22,
      speed: 7,
      movingLeft: false,
      movingRight: false
    };

    // Shared Entities
    this.items = [];
    this.lasers = [];
    this.enemies = [];
    this.particles = [];
    this.spawnTimer = 0;

    // Game 3: Odysseus' Great Bow (12 Axes Challenge)
    this.bowGame = {
      bowY: 190,
      bowAngle: 0,
      reticleY: 190,
      reticleSpeed: 4.5,
      reticleDir: 1,
      arrow: null,
      axes: [],
      passedCount: 0,
      shotsLeft: 5,
      wind: 0
    };

    // Game 4: Ithaca Tapestry Matrix State
    this.tapestry = {
      sequence: [],
      playerSequence: [],
      level: 1,
      animating: false,
      grid: [
        { id: 0, x: 170, y: 80, size: 70, color: '#00f0ff', label: 'ITHACA', active: false },
        { id: 1, x: 260, y: 80, size: 70, color: '#38bdf8', label: 'AEAEA', active: false },
        { id: 2, x: 350, y: 80, size: 70, color: '#6366f1', label: 'TROY', active: false },
        { id: 3, x: 170, y: 170, size: 70, color: '#10b981', label: 'OGYGIA', active: false },
        { id: 4, x: 260, y: 170, size: 70, color: '#f43f5e', label: 'CYCLOPS', active: false },
        { id: 5, x: 350, y: 170, size: 70, color: '#e0e7ff', label: 'SIRENS', active: false }
      ]
    };

    this.loadHighScores();
    this.bindEvents();
    this.setGameMode('dodge');
  }

  loadHighScores() {
    const key = `odyssey_high_${this.currentGame}`;
    this.highScore = parseInt(localStorage.getItem(key) || '0', 10);
    if (this.highScoreDisplay) this.highScoreDisplay.textContent = this.highScore;
  }

  setGameMode(mode) {
    this.currentGame = mode;
    this.gameRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    this.loadHighScores();

    // Update Tab Buttons
    document.querySelectorAll('.arcade-tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-game') === mode);
    });

    if (mode === 'dodge') {
      this.titleEl.textContent = 'NEURAL ODYSSEY';
      this.descEl.innerHTML = 'Guide Odysseus\' Star-Vessel past Scylla & Charybdis! Collect <span class="green-text">Golden Ambrosia Chunks (+10 pts)</span> and dodge <span class="red-text">Siren Glitches</span>.';
      this.instructionsEl.innerHTML = '<span>[ &larr; / A ] Port</span> &bull; <span>[ &rarr; / D ] Starboard</span> &bull; <span>[ Touch / Mouse ] Steer</span>';
      this.marqueeEl.innerHTML = '<i class="fa-solid fa-anchor"></i> VOYAGE I: NEURAL ODYSSEY &bull; DODGE THE SIRENS &bull; SAFE PASSAGE TO ITHACA';
      this.startBtn.innerHTML = '<i class="fa-solid fa-play"></i> LAUNCH VOYAGE';
    } else if (mode === 'cyclops') {
      this.titleEl.textContent = 'CYCLOPS DEFENSE';
      this.descEl.innerHTML = 'Deep Space Polyphemus & Cyclops Drones are targeting your fleet! Use [SPACE] or Button [A] to fire <span class="green-text">Disruptor Cannons</span> before they breach your hull.';
      this.instructionsEl.innerHTML = '<span>[ &larr; / &rarr; ] Move Ship</span> &bull; <span>[ SPACE / A Button ] Fire Cannon</span>';
      this.marqueeEl.innerHTML = '<i class="fa-solid fa-eye"></i> VOYAGE II: CYCLOPS DEFENSE &bull; QUANTUM DISRUPTORS READY &bull; REPEL SPACE GIANTS';
      this.startBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> COMMENCE BATTLE';
    } else if (mode === 'bow') {
      this.titleEl.textContent = 'ODYSSEUS\' GREAT BOW';
      this.descEl.innerHTML = 'String the great bow of King Odysseus! Time your release when the oscillating reticle aligns with the 12 bronze axes. Thread the arrow clean through all ring sockets!';
      this.instructionsEl.innerHTML = '<span>[ SPACE / A Button / Click ] Release Arrow when Aligned</span> &bull; <span>[ 5 Quiver Arrows ]</span>';
      this.marqueeEl.innerHTML = '<i class="fa-solid fa-crosshairs"></i> VOYAGE III: THE 12 AXE HEADS &bull; ONLY ODYSSEUS CAN STRING THE SACRED BOW';
      this.startBtn.innerHTML = '<i class="fa-solid fa-bullseye"></i> STRING THE BOW';
    } else if (mode === 'tapestry') {
      this.titleEl.textContent = 'ITHACA TAPESTRY MATRIX';
      this.descEl.innerHTML = 'Decode Penelope\'s warp pattern! Watch the celestial navigation glyphs light up in sequence, then click or press the nodes in the exact Odyssey memory order.';
      this.instructionsEl.innerHTML = '<span>[ Click / Tap Glyphs ] Follow Celestial Star Sequence</span>';
      this.marqueeEl.innerHTML = '<i class="fa-solid fa-puzzle-piece"></i> VOYAGE IV: ITHACA MATRIX &bull; PENELOPE\'S TAPESTRY &bull; RECALL STAR COORDINATES';
      this.startBtn.innerHTML = '<i class="fa-solid fa-brain"></i> BEGIN RECONSTRUCTION';
    }

    this.overlay.style.display = 'flex';
    this.renderIdlePreview();
  }

  bindEvents() {
    // Mode Switcher Tabs
    document.querySelectorAll('.arcade-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        synth.click();
        const mode = btn.getAttribute('data-game');
        this.setGameMode(mode);
      });
    });

    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => {
        synth.odysseyHorn();
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
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (this.currentGame === 'cyclops' && this.gameRunning) {
          this.fireLaser();
        } else if (this.currentGame === 'bow' && this.gameRunning) {
          this.releaseBowArrow();
        }
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
        if (this.currentGame === 'cyclops' && this.gameRunning) {
          this.fireLaser();
        } else if (this.currentGame === 'bow' && this.gameRunning) {
          this.releaseBowArrow();
        } else if (!this.gameRunning) {
          this.startGame();
        }
      });
    }

    const actionB = document.getElementById('btnActionB');
    if (actionB) {
      actionB.addEventListener('click', () => {
        if (!this.gameRunning) this.startGame();
      });
    }

    // Tapestry canvas click handler / Bow release
    this.canvas.addEventListener('click', (e) => {
      if (!this.gameRunning) return;
      if (this.currentGame === 'bow') {
        this.releaseBowArrow();
        return;
      }
      if (this.currentGame !== 'tapestry' || this.tapestry.animating) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      this.tapestry.grid.forEach((node) => {
        if (
          clickX >= node.x && clickX <= node.x + node.size &&
          clickY >= node.y && clickY <= node.y + node.size
        ) {
          this.handleTapestryInput(node.id);
        }
      });
    });
  }

  fireLaser() {
    synth.laser();
    this.lasers.push({
      x: this.player.x + this.player.width / 2 - 2,
      y: this.player.y - 4,
      width: 4,
      height: 14,
      speed: 9
    });
  }

  startGame() {
    this.score = 0;
    this.lives = 3;
    this.items = [];
    this.lasers = [];
    this.enemies = [];
    this.particles = [];
    this.player.x = (this.canvas.width - this.player.width) / 2;
    this.gameRunning = true;
    this.overlay.style.display = 'none';

    if (this.currentGame === 'bow') {
      this.initBowRound();
    } else if (this.currentGame === 'tapestry') {
      this.initTapestryRound();
    }

    this.updateHud();

    if (this.animId) cancelAnimationFrame(this.animId);
    this.loop();
  }

  gameOver(customMsg) {
    this.gameRunning = false;
    synth.hit();

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(`odyssey_high_${this.currentGame}`, this.highScore);
      if (this.highScoreDisplay) this.highScoreDisplay.textContent = this.highScore;
    }

    if (this.lastScoreDisplay) this.lastScoreDisplay.textContent = this.score;
    this.titleEl.textContent = 'HULL BREACHED!';
    this.titleEl.style.color = 'var(--arcade-red)';
    this.descEl.innerHTML = customMsg || `Vessel lost in the cosmic ocean! Voyage Score: <strong>${this.score} pts</strong>. Try again!`;
    this.startBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> RE-ENTER THE VOYAGE';
    this.overlay.style.display = 'flex';
  }

  victory(customMsg) {
    this.gameRunning = false;
    synth.powerup();

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(`odyssey_high_${this.currentGame}`, this.highScore);
      if (this.highScoreDisplay) this.highScoreDisplay.textContent = this.highScore;
    }

    if (this.lastScoreDisplay) this.lastScoreDisplay.textContent = this.score;
    this.titleEl.textContent = 'KINGDOM RECLAIMED!';
    this.titleEl.style.color = 'var(--neon-cyan)';
    this.descEl.innerHTML = customMsg || `Odysseus has threaded the 12 bronze axes! Score: <strong>${this.score} pts</strong>. Ithaca honors its true king!`;
    this.startBtn.innerHTML = '<i class="fa-solid fa-trophy"></i> CLAIM VICTORY';
    this.overlay.style.display = 'flex';
  }

  updateHud() {
    if (this.scoreHud) this.scoreHud.textContent = this.score;
    if (this.livesHud) {
      if (this.currentGame === 'tapestry') {
        this.livesHud.textContent = `L-${this.tapestry.level}`;
      } else if (this.currentGame === 'bow') {
        this.livesHud.textContent = `${this.bowGame.shotsLeft} ARROWS`;
      } else {
        let hearts = '';
        for (let i = 0; i < this.lives; i++) hearts += '♥';
        this.livesHud.textContent = hearts || 'EMPTY';
      }
    }
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

  renderIdlePreview() {
    this.ctx.fillStyle = '#020610';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Stars
    this.ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
    for (let i = 0; i < 35; i++) {
      this.ctx.fillRect((i * 37) % 600, (i * 29) % 380, 2, 2);
    }
  }

  // --- Odysseus Bow Game Methods ---
  initBowRound() {
    this.bowGame.reticleY = 190;
    this.bowGame.reticleDir = 1;
    this.bowGame.reticleSpeed = 4.0;
    this.bowGame.arrow = null;
    this.bowGame.shotsLeft = 5;
    this.bowGame.passedCount = 0;
    this.bowGame.axes = [];

    // Setup 12 Axe Heads in a row from left to right
    const startX = 160;
    const spacing = 32;
    for (let i = 0; i < 12; i++) {
      this.bowGame.axes.push({
        x: startX + i * spacing,
        targetY: 190 + Math.sin(i * 0.4) * 8, // slight wave
        ringRadius: 10,
        cleared: false
      });
    }
  }

  releaseBowArrow() {
    if (this.bowGame.arrow || this.bowGame.shotsLeft <= 0) return;
    synth.laser();
    this.bowGame.shotsLeft--;
    this.updateHud();

    // Aim based on oscillating reticle
    const angle = (this.bowGame.reticleY - 190) * 0.005;
    this.bowGame.arrow = {
      x: 70,
      y: 190,
      vx: 12,
      vy: (this.bowGame.reticleY - 190) * 0.08,
      inFlight: true,
      ringsPierced: 0
    };
  }

  updateBowGame() {
    const bg = this.bowGame;

    // Draw Great Bow on Left
    this.ctx.strokeStyle = '#38bdf8';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(45, 190, 48, -Math.PI / 2.6, Math.PI / 2.6, false);
    this.ctx.stroke();

    // Bowstring
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(60, 150);
    if (!bg.arrow) {
      this.ctx.lineTo(bg.reticleY > 190 ? 45 : 48, 190);
    } else {
      this.ctx.lineTo(60, 190);
    }
    this.ctx.lineTo(60, 230);
    this.ctx.stroke();

    // Draw the 12 Axe Heads with rings
    bg.axes.forEach((axe, index) => {
      // Axe shaft
      this.ctx.strokeStyle = '#475569';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(axe.x, axe.targetY - 26);
      this.ctx.lineTo(axe.x, axe.targetY + 45);
      this.ctx.stroke();

      // Axe Blade
      this.ctx.fillStyle = axe.cleared ? '#00f0ff' : '#64748b';
      this.ctx.beginPath();
      this.ctx.moveTo(axe.x - 6, axe.targetY - 18);
      this.ctx.lineTo(axe.x + 8, axe.targetY - 24);
      this.ctx.lineTo(axe.x + 8, axe.targetY - 6);
      this.ctx.closePath();
      this.ctx.fill();

      // Iron Ring Socket (Hole to shoot through)
      this.ctx.strokeStyle = axe.cleared ? '#00f0ff' : '#94a3b8';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(axe.x, axe.targetY, axe.ringRadius, 0, Math.PI * 2);
      this.ctx.stroke();

      // Ring index marker
      this.ctx.fillStyle = axe.cleared ? '#00f0ff' : '#64748b';
      this.ctx.font = '7px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`${index + 1}`, axe.x, axe.targetY + 34);
    });

    // Reticle Oscillating movement when aiming
    if (!bg.arrow) {
      bg.reticleY += bg.reticleSpeed * bg.reticleDir;
      if (bg.reticleY > 260) {
        bg.reticleY = 260;
        bg.reticleDir = -1;
      } else if (bg.reticleY < 120) {
        bg.reticleY = 120;
        bg.reticleDir = 1;
      }

      // Draw Aiming Reticle
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(160, bg.reticleY, 14, 0, Math.PI * 2);
      this.ctx.moveTo(140, bg.reticleY);
      this.ctx.lineTo(180, bg.reticleY);
      this.ctx.moveTo(160, bg.reticleY - 20);
      this.ctx.lineTo(160, bg.reticleY + 20);
      this.ctx.stroke();

      // Aim Laser guideline
      this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.moveTo(60, 190);
      this.ctx.lineTo(550, bg.reticleY + (bg.reticleY - 190) * 2.8);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // Arrow Flight Simulation
    if (bg.arrow && bg.arrow.inFlight) {
      const arr = bg.arrow;
      arr.x += arr.vx;
      arr.y += arr.vy;

      // Draw Gold/Cyan Sacred Arrow
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(arr.x - 22, arr.y);
      this.ctx.lineTo(arr.x, arr.y);
      this.ctx.stroke();

      // Arrow tip
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.moveTo(arr.x + 6, arr.y);
      this.ctx.lineTo(arr.x, arr.y - 4);
      this.ctx.lineTo(arr.x, arr.y + 4);
      this.ctx.closePath();
      this.ctx.fill();

      // Arrow feathers
      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(arr.x - 22, arr.y - 4);
      this.ctx.lineTo(arr.x - 16, arr.y);
      this.ctx.lineTo(arr.x - 22, arr.y + 4);
      this.ctx.stroke();

      // Check collision with Axes
      bg.axes.forEach((axe) => {
        if (!axe.cleared && Math.abs(arr.x - axe.x) < 8) {
          const distFromHole = Math.abs(arr.y - axe.targetY);
          if (distFromHole <= axe.ringRadius) {
            // Passed through ring socket!
            axe.cleared = true;
            arr.ringsPierced++;
            this.score += 25;
            synth.coin();
            this.explode(axe.x, axe.targetY, '#00f0ff');
            this.updateHud();
          } else {
            // Struck axe shaft/metal rim!
            synth.hit();
            this.explode(axe.x, arr.y, '#ff0055');
            arr.inFlight = false;
            bg.arrow = null;
          }
        }
      });

      // Cleared all 12 axes?
      if (arr.ringsPierced >= 12) {
        this.score += 300;
        this.updateHud();
        this.victory('ODYSSEUS PIERCED ALL 12 AXE RINGS! THE SUITORS FLEE IN TERROR!');
        return;
      }

      // Flew off screen
      if (arr.x > this.canvas.width + 40) {
        arr.inFlight = false;
        bg.arrow = null;
      }
    }

    // Check Out of Shots
    if (!bg.arrow && bg.shotsLeft <= 0 && this.gameRunning) {
      if (bg.axes.filter(a => a.cleared).length < 12) {
        this.gameOver(`Quiver exhausted! Odysseus pierced ${bg.axes.filter(a => a.cleared).length}/12 axe rings.`);
      }
    }
  }

  // --- Tapestry Memory Game Functions ---
  initTapestryRound() {
    this.tapestry.sequence = [];
    this.tapestry.playerSequence = [];
    this.tapestry.level = 1;
    this.nextTapestrySequence();
  }

  nextTapestrySequence() {
    this.tapestry.playerSequence = [];
    this.tapestry.sequence.push(Math.floor(Math.random() * this.tapestry.grid.length));
    this.tapestry.animating = true;
    this.updateHud();

    // Playback sequence
    let step = 0;
    const interval = setInterval(() => {
      if (step < this.tapestry.sequence.length) {
        const nodeId = this.tapestry.sequence[step];
        this.highlightTapestryNode(nodeId);
        synth.playTone(300 + nodeId * 80, 'sine', 0.2, 0.08);
        step++;
      } else {
        clearInterval(interval);
        this.tapestry.animating = false;
      }
    }, 600);
  }

  highlightTapestryNode(nodeId) {
    const node = this.tapestry.grid.find((n) => n.id === nodeId);
    if (!node) return;
    node.active = true;
    setTimeout(() => { node.active = false; }, 320);
  }

  handleTapestryInput(nodeId) {
    this.highlightTapestryNode(nodeId);
    synth.playTone(300 + nodeId * 80, 'sine', 0.15, 0.08);
    this.tapestry.playerSequence.push(nodeId);

    const curIdx = this.tapestry.playerSequence.length - 1;
    if (this.tapestry.playerSequence[curIdx] !== this.tapestry.sequence[curIdx]) {
      this.gameOver(`Navigation warp snapped at Level ${this.tapestry.level}! Ithaca remains elusive.`);
      return;
    }

    if (this.tapestry.playerSequence.length === this.tapestry.sequence.length) {
      synth.coin();
      this.score += this.tapestry.level * 25;
      this.tapestry.level++;
      this.updateHud();
      setTimeout(() => this.nextTapestrySequence(), 800);
    }
  }

  // --- Main Animation Loop ---
  loop() {
    if (!this.gameRunning) return;

    this.ctx.fillStyle = '#020610';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Stars drift
    this.ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
    for (let i = 0; i < 20; i++) {
      this.ctx.fillRect((i * 45 + Date.now() * 0.03) % 600, (i * 35) % 380, 2, 2);
    }

    // Route depending on game
    if (this.currentGame === 'dodge') {
      this.updateDodgeGame();
    } else if (this.currentGame === 'cyclops') {
      this.updateCyclopsGame();
    } else if (this.currentGame === 'bow') {
      this.updateBowGame();
    } else if (this.currentGame === 'tapestry') {
      this.renderTapestry();
    }

    // Particle FX
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

  // GAME 1: Neural Dodge (Scylla & Ambrosia)
  updateDodgeGame() {
    // Player Move
    if (this.player.movingLeft && this.player.x > 0) this.player.x -= this.player.speed;
    if (this.player.movingRight && this.player.x < this.canvas.width - this.player.width) this.player.x += this.player.speed;

    // Draw Odysseus Vessel
    this.drawShip(this.player.x, this.player.y, '#00f0ff');

    this.spawnTimer++;
    if (this.spawnTimer > 32) {
      const isGood = Math.random() > 0.36;
      this.items.push({
        x: Math.random() * (this.canvas.width - 30) + 15,
        y: -20,
        radius: isGood ? 10 : 12,
        speed: Math.random() * 2 + 2.5 + this.score * 0.015,
        isGood: isGood
      });
      this.spawnTimer = 0;
    }

    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.y += it.speed;

      this.ctx.fillStyle = it.isGood ? '#00f0ff' : '#ff0055';
      this.ctx.beginPath();
      this.ctx.arc(it.x, it.y, it.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Collision
      if (
        it.y + it.radius >= this.player.y &&
        it.y - it.radius <= this.player.y + this.player.height &&
        it.x + it.radius >= this.player.x &&
        it.x - it.radius <= this.player.x + this.player.width
      ) {
        if (it.isGood) {
          synth.coin();
          this.score += 10;
          this.explode(it.x, it.y, '#00f0ff');
        } else {
          synth.hit();
          this.lives--;
          this.explode(it.x, it.y, '#ff0055');
          if (this.lives <= 0) {
            this.updateHud();
            this.gameOver('Scylla & the Sirens devoured your starship!');
            return;
          }
        }
        this.updateHud();
        this.items.splice(i, 1);
        continue;
      }

      if (it.y > this.canvas.height + 20) this.items.splice(i, 1);
    }
  }

  // GAME 2: Cyclops Defense (Invaders style space shooter)
  updateCyclopsGame() {
    if (this.player.movingLeft && this.player.x > 0) this.player.x -= this.player.speed;
    if (this.player.movingRight && this.player.x < this.canvas.width - this.player.width) this.player.x += this.player.speed;

    this.drawShip(this.player.x, this.player.y, '#38bdf8');

    // Update Lasers
    for (let l = this.lasers.length - 1; l >= 0; l--) {
      const laser = this.lasers[l];
      laser.y -= laser.speed;

      this.ctx.fillStyle = '#00f0ff';
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 8;
      this.ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
      this.ctx.shadowBlur = 0;

      if (laser.y < -10) this.lasers.splice(l, 1);
    }

    // Spawn Cyclops Drones
    this.spawnTimer++;
    if (this.spawnTimer > 40) {
      this.enemies.push({
        x: Math.random() * (this.canvas.width - 40) + 20,
        y: -30,
        width: 32,
        height: 32,
        speed: 1.8 + Math.min(this.score * 0.01, 3),
        eyePulse: 0
      });
      this.spawnTimer = 0;
    }

    // Update Enemies
    for (let e = this.enemies.length - 1; e >= 0; e--) {
      const en = this.enemies[e];
      en.y += en.speed;

      // Draw Cyclops Drone
      this.ctx.fillStyle = '#6366f1';
      this.ctx.fillRect(en.x, en.y, en.width, en.height);
      // Cyclops Single Eye
      this.ctx.fillStyle = '#ff0055';
      this.ctx.beginPath();
      this.ctx.arc(en.x + en.width / 2, en.y + en.height / 2, 7, 0, Math.PI * 2);
      this.ctx.fill();

      // Check collision with Lasers
      for (let l = this.lasers.length - 1; l >= 0; l--) {
        const laser = this.lasers[l];
        if (
          laser.x >= en.x && laser.x <= en.x + en.width &&
          laser.y >= en.y && laser.y <= en.y + en.height
        ) {
          synth.hit();
          this.score += 20;
          this.explode(en.x + en.width / 2, en.y + en.height / 2, '#6366f1');
          this.enemies.splice(e, 1);
          this.lasers.splice(l, 1);
          this.updateHud();
          break;
        }
      }

      // Check collision with Player or bottom
      if (en.y + en.height >= this.player.y && en.x + en.width >= this.player.x && en.x <= this.player.x + this.player.width) {
        synth.hit();
        this.lives--;
        this.explode(en.x + en.width / 2, en.y + en.height / 2, '#ff0055');
        this.enemies.splice(e, 1);
        if (this.lives <= 0) {
          this.updateHud();
          this.gameOver('Polyphemus\' deep-space cyclopes overwhelmed your shields!');
          return;
        }
        this.updateHud();
      } else if (en.y > this.canvas.height) {
        this.enemies.splice(e, 1);
      }
    }
  }

  // GAME 3: Ithaca Matrix Tapestry Canvas Render
  renderTapestry() {
    this.ctx.font = '11px "Press Start 2P"';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.fillText(
      this.tapestry.animating ? 'OBSERVE CELESTIAL PATTERN...' : 'RECONSTRUCT THE TAPESTRY (CLICK NODES)',
      this.canvas.width / 2, 45
    );

    this.tapestry.grid.forEach((node) => {
      this.ctx.fillStyle = node.active ? '#ffffff' : (this.tapestry.animating ? 'rgba(8, 20, 38, 0.9)' : 'rgba(15, 28, 52, 0.85)');
      this.ctx.strokeStyle = node.active ? '#00f0ff' : node.color;
      this.ctx.lineWidth = node.active ? 4 : 2;

      this.ctx.beginPath();
      this.ctx.roundRect(node.x, node.y, node.size, node.size, 10);
      this.ctx.fill();
      this.ctx.stroke();

      if (node.active) {
        this.ctx.shadowColor = node.color;
        this.ctx.shadowBlur = 18;
      }

      this.ctx.fillStyle = node.active ? '#000000' : '#ffffff';
      this.ctx.font = '8px "Press Start 2P"';
      this.ctx.fillText(node.label, node.x + node.size / 2, node.y + node.size / 2 + 4);
      this.ctx.shadowBlur = 0;
    });
  }

  drawShip(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    // Starship aerodynamic prow
    this.ctx.moveTo(x + this.player.width / 2, y);
    this.ctx.lineTo(x + this.player.width, y + this.player.height);
    this.ctx.lineTo(x + this.player.width / 2, y + this.player.height - 5);
    this.ctx.lineTo(x, y + this.player.height);
    this.ctx.closePath();
    this.ctx.fill();

    // Thruster glow
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.fillRect(x + this.player.width / 2 - 3, y + this.player.height - 2, 6, 5);
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
        soundToggle.style.borderColor = 'var(--accent-cyan)';
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

// --- 11. Visitor Gamification Engine (XP, Levels & Secret Achievements) ---
class GamificationEngine {
  constructor() {
    this.xp = parseInt(localStorage.getItem('yash_visitor_xp') || '25', 10);
    this.unlocked = JSON.parse(localStorage.getItem('yash_achievements') || '[]');
    this.badgeEl = document.getElementById('hudXpBadge');
    this.levelText = document.getElementById('hudLevelText');
    this.xpFill = document.getElementById('hudXpFill');
    this.xpNum = document.getElementById('hudXpNum');
    this.toast = document.getElementById('achievementToast');
    this.achTitle = document.getElementById('achTitle');
    this.achDesc = document.getElementById('achDesc');

    this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.konamiIndex = 0;

    this.updateUI();
    this.bindEvents();

    // First visit welcome XP
    if (!this.unlocked.includes('first_visit')) {
      setTimeout(() => {
        this.unlock('first_visit', 'Cadet of Ithaca', 'Arrived at Athota Yashwanth\'s Flight Deck! (+25 XP)', 25);
      }, 1500);
    }
  }

  getLevel() {
    return Math.floor(this.xp / 100) + 1;
  }

  addXP(amount, reason) {
    this.xp += amount;
    localStorage.setItem('yash_visitor_xp', this.xp);
    synth.coin();
    this.updateUI();
  }

  updateUI() {
    const level = this.getLevel();
    const progressInLevel = this.xp % 100;

    if (this.levelText) this.levelText.textContent = `LVL ${level}`;
    if (this.xpFill) this.xpFill.style.width = `${progressInLevel}%`;
    if (this.xpNum) this.xpNum.textContent = `${this.xp} XP`;
  }

  unlock(id, title, desc, xpGain = 50) {
    if (this.unlocked.includes(id)) return;
    this.unlocked.push(id);
    localStorage.setItem('yash_achievements', JSON.stringify(this.unlocked));
    this.addXP(xpGain);

    if (this.toast && this.achTitle && this.achDesc) {
      this.achTitle.textContent = title;
      this.achDesc.textContent = desc;
      this.toast.classList.add('show');
      synth.powerup();

      setTimeout(() => {
        this.toast.classList.remove('show');
      }, 4500);
    }
  }

  bindEvents() {
    // Secret Konami Code Easter Egg
    window.addEventListener('keydown', (e) => {
      const key = e.key;
      const expected = this.konamiSequence[this.konamiIndex];
      if (key.toLowerCase() === expected.toLowerCase()) {
        this.konamiIndex++;
        if (this.konamiIndex === this.konamiSequence.length) {
          this.konamiIndex = 0;
          this.unlock('konami_god', 'Odysseus Mythic Key', 'Entered the 30-Lives Konami Code! Overclocked flight shields unlocked. (+150 XP)', 150);
          synth.odysseyHorn();
          document.body.style.filter = 'hue-rotate(180deg)';
          setTimeout(() => { document.body.style.filter = 'none'; }, 3000);
        }
      } else {
        this.konamiIndex = 0;
      }
    });

    // Award XP when browsing different project missions
    document.querySelectorAll('.project-select-item').forEach((item) => {
      item.addEventListener('click', () => {
        const proj = item.getAttribute('data-project');
        this.unlock(`proj_${proj}`, `Telemetry Decoded: ${proj.toUpperCase()}`, `Inspected architecture & live benchmarks (+20 XP)`, 20);
      });
    });

    // Award XP on clicking skill filters
    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.unlock('skills_surveyed', 'Arsenal Master', 'Analyzed complete technical stack and toolset (+25 XP)', 25);
      });
    });

    // Award XP on reading experience
    const expSection = document.getElementById('experience');
    if (expSection) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.unlock('exp_read', 'OMICS Campaign Recon', 'Reviewed high-scale production AI engineering history (+30 XP)', 30);
          observer.disconnect();
        }
      }, { threshold: 0.4 });
      observer.observe(expSection);
    }

    // Award XP on launching arcade games
    document.querySelectorAll('.arcade-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.unlock('arcade_warrior', 'Odyssey Pilot', 'Booted up the Odysseus Arcade retro battle simulator (+30 XP)', 30);
      });
    });
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
  new OdysseyArcadeManager();
  window.gameEngine = new GamificationEngine();
});

