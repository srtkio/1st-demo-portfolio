/**
 * SARTHAK.EXE — Interactive Motion System & Application Engine
 * Pure Vanilla JavaScript with GSAP/ScrollTrigger Progressive Enhancement
 * Zero-build runtime & offline-safe design
 */

(function () {
  'use strict';

  // State Management
  const state = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    agrigrade: {
      currentStep: 0,
      isPlaying: false,
      timer: null,
      steps: ['1', '2', '3', '4', 'branches', '5', '6', '7', '8', '9']
    },
    repositories: [],
    activeFilter: 'all'
  };

  // Node Documentation Data for AgriGrade Flowchart
  const agrigradeNodeData = {
    '1': {
      label: 'Step 01 • Lot Initialization',
      badge: 'Entry Point',
      title: 'Create Inspection Lot',
      desc: 'The procurement inspector initiates a new session and generates a lot ID (e.g. LOT: ON-2026-042). Records origin mandi, arrival timestamp, and procurement centre parameters before produce images are collected.'
    },
    '2': {
      label: 'Step 02 • Image Acquisition',
      badge: 'Smartphone Input',
      title: 'Smartphone RGB Image Capture',
      desc: 'High-resolution RGB produce images are captured on an ordinary smartphone at the procurement center under standard lighting conditions, eliminating the need for expensive proprietary hardware.'
    },
    '3': {
      label: 'Step 03 • Pre-flight Check',
      badge: 'Quality Gate',
      title: 'Image Quality Validation',
      desc: 'Pre-processing filters check blur, glare, lighting balance, bulb occlusion, and framing. Unusable or obscured images are instantly flagged for recapture rather than passing corrupt inputs to the neural network.'
    },
    '4': {
      label: 'Step 04 • Primary Inference',
      badge: 'Neural Network Core',
      title: 'Computer Vision Analysis',
      desc: 'The visual pipeline identifies and segments individual onions from the produce lot. Once segmented, the pipeline branches into three parallel evaluation tasks.'
    },
    '4a': {
      label: 'Parallel Branch A • Surface Health',
      badge: 'Defect Detection',
      title: 'Visible Defect Classification',
      desc: 'Detects visible cuts, mechanical bruising, surface rot, and black mold colonization across outer onion layers based on visual feature extraction.'
    },
    '4b': {
      label: 'Parallel Branch B • Germination',
      badge: 'Sprouting Check',
      title: 'Neck Sprouting Detection',
      desc: 'Identifies premature internal or external neck shoots. Sprouting significantly degrades shelf life and triggers commercial grade downgrades.'
    },
    '4c': {
      label: 'Parallel Branch C • Geometry',
      badge: 'Measurement',
      title: 'Calibrated Size Estimation',
      desc: 'Translates pixel dimensions into calibrated millimeter diameter estimates using known reference parameters to group bulbs into commercial size bins (e.g., Small, Medium, Large).'
    },
    '5': {
      label: 'Step 05 • Merge & Aggregation',
      badge: 'Batch Statistics',
      title: 'Batch Metrics Synthesis',
      desc: 'Individual bulb observations converge into lot-level percentage distributions (e.g., 78% healthy, 12% surface defect, 5% rot, 3% sprouted, 2% undersized, 6 low-confidence cases).'
    },
    '6': {
      label: 'Step 06 • Decoupled Logic',
      badge: 'Rules Engine',
      title: 'Standards & Rules Engine',
      desc: 'Observations are evaluated against formal standards (AGMARK / BIS IS 17912:2022). Crucially, the AI observes while configurable business rules decide the grade, ensuring auditability and zero silent model bias.'
    },
    '7': {
      label: 'Step 07 • Confidence Thresholding',
      badge: 'Decision Split',
      title: 'Confidence-Based Decision Gate',
      desc: 'Observations with confidence scores ≥ 85% proceed automatically. Any ambiguous, edge-case, or borderline assessments (< 85%) are routed to the human reviewer.'
    },
    '8': {
      label: 'Step 08 • Human In The Loop',
      badge: 'Inspector Override',
      title: 'Human Review & Audit',
      desc: 'The procurement inspector inspects flagged items, confirms or overrides the classification, and logs an explainable rationale directly into the immutable session history.'
    },
    '9': {
      label: 'Step 09 • Final Deliverable',
      badge: 'Digital Certificate',
      title: 'Digital Quality Inspection Report',
      desc: 'Generates a signed, verifiable inspection certificate featuring lot statistics, evidence photography, applied rule versions, and inspector sign-off for procurement settlement.'
    }
  };

  // Framework Data for Problem-to-Product Flowchart
  const frameworkData = {
    '1': {
      title: '01 • Problem Identification',
      desc: 'Great products do not start with code or hype; they start with observing friction. In projects like AgriInspect and Converge, the focus is on unaddressed real-world inefficiencies—such as subjective onion grading at mandis, or civic complaints closed without photographic proof.',
      principle: 'Core Rule: Fall in love with the problem, not the first solution.'
    },
    '2': {
      title: '02 • User Research & Field Empathy',
      desc: 'Deep interviews with procurement officers, mandi operators, and municipal inspectors. Understanding physical environment constraints, network volatility, and time pressure before drafting requirements.',
      principle: 'Core Rule: The user in the field matters 10x more than the developer in the lab.'
    },
    '3': {
      title: '03 • Define Core Problem',
      desc: 'Distilling complex multi-variable noise into a crisp, verifiable thesis. For AgriInspect: "How do we make quality assessment objective and auditable using ordinary smartphones?"',
      principle: 'Core Rule: If you cannot state the problem in one sentence, you are not ready to build.'
    },
    '4': {
      title: '04 • Explore Solution Architecture',
      desc: 'Mapping technical trade-offs between local on-device inference vs cloud processing, decoupled rules engines vs black-box neural networks, and privacy-preserving storage.',
      principle: 'Core Rule: Choose boring, verifiable architecture over complex unexplainable stacks.'
    },
    '5': {
      title: '05 • Rapid Prototyping',
      desc: 'Building rapid clickable flows and proof-of-concept inference scripts to test feasibility with real datasets within days, not months.',
      principle: 'Core Rule: A prototype answers questions that ten meetings cannot.'
    },
    '6': {
      title: '06 • Test & Iterate in Sprints',
      desc: 'Testing prototypes against real-world sample variations (lighting, camera angles, damaged produce) and measuring false positive rates.',
      principle: 'Core Rule: Seek disconfirming evidence early.'
    },
    '7': {
      title: '07 • Build Production MVP',
      desc: 'Writing clean, typed, modular code with clear documentation, reproducible schemas, and reliable audit logs for hackathon judging and real deployment.',
      principle: 'Core Rule: Polish every edge case; reliability is the best feature.'
    },
    '8': {
      title: '08 • Learn from Real Feedback',
      desc: 'Reviewing judge evaluations, stakeholder critiques, and real telemetry to guide roadmap iterations and maintain humility.',
      principle: 'Core Rule: Software is never finished; it is continuously refined.'
    }
  };

  // Deep Case Study Data
  const caseStudyData = {
    agrigrade: {
      category: 'Smart India Hackathon 2026 Core Project',
      title: 'AgriGrade (AgriInspect) — AI-Assisted Agricultural Inspection',
      status: 'Active MVP Development • SIH 2026 (SIH26031)',
      role: 'Lead Architect & AI Systems Integrator',
      problem: `Agricultural quality inspection at procurement centres has historically relied on subjective manual observation and visual estimation. This creates severe friction:
- Inconsistent quality grades between different centres and inspectors.
- Slow batch turnover creating bottlenecks during peak harvests.
- Lack of photographic evidence or auditable records to resolve disputes between farmers and mandis.
- Inability to verify compliance with national grading specifications (AGMARK & BIS).`,
      solution: `AgriInspect transforms standard smartphone cameras into calibrated inspection instruments:
- Computer vision pipeline detects onions, evaluates outer rot/cuts, and spots premature sprouting.
- Calibrated diameter estimation groups produce into standard commercial size bins.
- Aggregates individual observations into lot-level metrics (e.g. % healthy vs % defective).
- Decouples AI perception from procurement rules: formal AGMARK/BIS standards evaluate observations without hidden model bias.
- Retains human-in-the-loop oversight: low-confidence predictions are flagged for inspector verification.`,
      techStack: ['Python', 'OpenCV / PyTorch', 'FastAPI', 'HTML5 / Modern CSS', 'AGMARK & BIS Rulesets'],
      lessons: `1. Real-world agricultural lighting varies tremendously compared to benchmark datasets.
2. Explaining HOW a grade was determined is more valuable to procurement officers than raw black-box accuracy.
3. Separation of perception (AI) and decision (Rules Engine) makes updates straightforward and dispute-proof.`,
      repoUrl: 'https://github.com/srtkio/AgriGrade',
      liveUrl: null
    },
    ragseal: {
      category: "Hypnexis '26 Winner • 3rd Place",
      title: 'RAGSeal — Retrieval vs Generator Error Attribution',
      status: 'Completed Hackathon MVP • 3rd Place Winner (₹50,000 Prize)',
      role: 'Core Backend & Attribution Logic Engineering (Team Monster Energy)',
      problem: `When a Retrieval-Augmented Generation (RAG) system generates an incorrect or hallucinated response, engineering teams struggle to diagnose the root cause:
- Did the vector database fail to retrieve the right context chunks (Retriever Failure)?
- Or did the LLM retrieve the right context but hallucinate / fail to follow context (Generator Failure)?
Without automated attribution testing, debugging production RAG pipelines is slow and subjective.`,
      solution: `RAGSeal executes automated attribution testing on arbitrary question-context-answer triples:
- Evaluates retriever relevance, chunk coverage, and semantic precision.
- Validates generator groundedness, context contradiction, and synthesis accuracy.
- Runs local testing via Ollama and cloud-hosted grading endpoints via Groq.
- Delivers an explainable attribution certificate proving fault mathematically.`,
      techStack: ['Python 3.11+', 'FastAPI', 'React 18', 'TypeScript', 'Ollama', 'Groq', 'SQLite Vector'],
      lessons: `1. Fast local model execution allows evaluation without incurring massive API token costs.
2. Precise attribution saves engineering teams days of manual prompt tinkering.`,
      repoUrl: 'https://github.com/srtkio/RAGSeal',
      liveUrl: 'https://ragseal.vercel.app'
    },
    converge: {
      category: 'Smart Cities Civic Platform',
      title: 'CONVERGE — Citizen Reports to Verified Resolution',
      status: 'Live Deployment (Murthal–Sonipat Pilot)',
      role: 'Product Architecture & Web Implementation',
      problem: `Civic grievance portals often frustrate citizens when municipal tickets are marked "Closed" without physical repairs having occurred. Furthermore, duplicate reports overwhelm city operators, and lack of SLA escalation allows complaints to linger for months.`,
      solution: `CONVERGE enforces an accountable civic resolution workflow:
- Citizens file geotagged complaints directly from smartphones.
- Intelligent deduplication clusters identical reports occurring in the same vicinity.
- Shared-cause linking identifies related systemic issues (e.g., broken pipe causing road cave-in).
- Escalation ladder automatically triggers senior command alerts if repair SLAs slip.
- Cases require photo-verified physical evidence from crews before a closure state is unlocked.`,
      techStack: ['React', 'TypeScript', 'Vercel Edge', 'Render Backend', 'Municipal SLA Rules Engine'],
      lessons: `1. Accountability mechanisms build civic trust faster than flashy UI redesigns.
2. Pilot testing in Murthal–Sonipat provided authentic constraints on operator workflows.`,
      repoUrl: 'https://github.com/srtkio/converge_trojans',
      liveUrl: 'https://converge-web-ten.vercel.app'
    }
  };

  // High-Fidelity Verified Repositories (Fallback & Instant Display)
  const fallbackRepos = [
    {
      name: 'AgriGrade',
      description: '🌾 AI-Assisted Agricultural Quality Inspection Platform (AgriInspect) for onion quality grading with computer vision, standards rules engine, and human auditability (SIH 2026).',
      html_url: 'https://github.com/srtkio/AgriGrade',
      language: 'Python',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-10-28T18:00:00Z',
      category: 'ai'
    },
    {
      name: 'RAGSeal',
      description: '⚡ When a RAG answer is wrong, RAGSeal proves whether the retriever or the generator caused it. Built at Hypnexis \'26 (3rd place winner, Team Monster Energy).',
      html_url: 'https://github.com/srtkio/RAGSeal',
      language: 'Python',
      stargazers_count: 1,
      forks_count: 0,
      updated_at: '2026-10-24T12:00:00Z',
      category: 'ai'
    },
    {
      name: 'converge_trojans',
      description: '🏙️ City complaints, closed only when they are really fixed. Civic platform with SLA escalation and verified photographic resolution for Smart Cities.',
      html_url: 'https://github.com/srtkio/converge_trojans',
      language: 'TypeScript',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-10-20T14:30:00Z',
      category: 'systems'
    },
    {
      name: 'trojan-drop-forge',
      description: '🛠️ Modern full-stack component toolkit and frontend application scaffolding with TanStack Start, React 19, TypeScript, and Framer Motion.',
      html_url: 'https://github.com/srtkio/trojan-drop-forge',
      language: 'TypeScript',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-10-15T09:15:00Z',
      category: 'systems'
    },
    {
      name: 'SAI-worksheet-sarthakrai',
      description: '📚 Systems & AI coursework labs, computational thinking experiments, and algorithmic worksheets at Newton School of Technology.',
      html_url: 'https://github.com/srtkio/SAI-worksheet-sarthakrai',
      language: 'Python',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-09-30T16:00:00Z',
      category: 'academic'
    },
    {
      name: 'sprintzero',
      description: '🚀 Initial sprint zero development sandbox, prototype setup, and technical explorations.',
      html_url: 'https://github.com/srtkio/sprintzero',
      language: 'JavaScript',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-09-20T11:00:00Z',
      category: 'academic'
    }
  ];

  /* ==========================================================================
     1. HERO WORKSPACE 3D POINTER EFFECT & AMBIENT PARALLAX
     ========================================================================== */
  function initHeroWorkspace() {
    const stack = document.getElementById('workspace-interactive');
    const container = document.getElementById('hero-visual-container');

    if (!stack || !container || state.reducedMotion) return;

    let bounds = container.getBoundingClientRect();
    window.addEventListener('resize', () => {
      bounds = container.getBoundingClientRect();
    });

    container.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xPercent = (mouseX / bounds.width - 0.5) * 2; // -1 to 1
      const yPercent = (mouseY / bounds.height - 0.5) * 2;

      const rotateY = xPercent * 10;
      const rotateX = -yPercent * 10;

      stack.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    container.addEventListener('mouseleave', () => {
      stack.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  /* ==========================================================================
     2. READING PROGRESS BAR & SCROLLSPY
     ========================================================================== */
  function initScrollProgressAndNav() {
    const progressBar = document.getElementById('reading-progress');
    const backToTopBtn = document.getElementById('floating-back-to-top');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const progressLine = document.getElementById('timeline-progress-line');
    const timelineEl = document.getElementById('animated-timeline');

    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      // Update progress bar
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', Math.round(progress));
      }

      // Back to top visibility
      if (backToTopBtn) {
        if (scrollTop > 450) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }

      // ScrollSpy: highlight active nav section
      let currentSectionId = '';
      sections.forEach((section) => {
        const top = section.offsetTop - 120;
        const height = section.offsetHeight;
        if (scrollTop >= top && scrollTop < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          }
        });
      }

      // Animated SVG Timeline progressive line drawing
      if (progressLine && timelineEl) {
        const timelineRect = timelineEl.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (timelineRect.top < windowHeight && timelineRect.bottom > 0) {
          const visibleHeight = Math.min(
            timelineRect.height,
            Math.max(0, windowHeight * 0.7 - timelineRect.top)
          );
          progressLine.setAttribute('y2', `${visibleHeight}px`);
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ==========================================================================
     3. ANIMATED TECHNICAL FLOWCHARTS ENGINE (AGRIGRADE)
     ========================================================================== */
  function initAgriGradeFlowchart() {
    const nodes = {
      '1': document.getElementById('node-1'),
      '2': document.getElementById('node-2'),
      '3': document.getElementById('node-3'),
      '4': document.getElementById('node-4'),
      '4a': document.getElementById('node-4a'),
      '4b': document.getElementById('node-4b'),
      '4c': document.getElementById('node-4c'),
      '5': document.getElementById('node-5'),
      '6': document.getElementById('node-6'),
      '7': document.getElementById('node-7'),
      '8': document.getElementById('node-8'),
      '9': document.getElementById('node-9')
    };

    const particle = document.getElementById('flow-particle');
    const playBtn = document.getElementById('ctrl-play');
    const playText = document.getElementById('ctrl-play-text');
    const playIcon = document.getElementById('ctrl-play-icon');
    const stepBtn = document.getElementById('ctrl-step');
    const resetBtn = document.getElementById('ctrl-reset');

    // Inspector elements
    const inspLabel = document.getElementById('insp-step-label');
    const inspBadge = document.getElementById('insp-badge');
    const inspTitle = document.getElementById('insp-title');
    const inspDesc = document.getElementById('insp-desc');

    const nodeCoordinates = {
      '1': { x: 60, y: 90 },
      '2': { x: 220, y: 90 },
      '3': { x: 390, y: 90 },
      '4': { x: 570, y: 85 },
      '4a': { x: 350, y: 250 },
      '4b': { x: 560, y: 250 },
      '4c': { x: 770, y: 250 },
      '5': { x: 555, y: 380 },
      '6': { x: 740, y: 380 },
      '7': { x: 910, y: 380 },
      '8': { x: 295, y: 480 },
      '9': { x: 555, y: 480 }
    };

    function updateInspector(nodeKey) {
      const data = agrigradeNodeData[nodeKey];
      if (!data) return;

      if (inspLabel) inspLabel.textContent = data.label;
      if (inspBadge) inspBadge.textContent = data.badge;
      if (inspTitle) inspTitle.textContent = data.title;
      if (inspDesc) inspDesc.innerHTML = data.desc;
    }

    function clearAllActiveStates() {
      Object.values(nodes).forEach((node) => {
        if (node) node.classList.remove('active-step');
      });
      document.querySelectorAll('.pipe-line').forEach((line) => {
        line.classList.remove('line-active');
      });
    }

    function activateStep(stepIdx) {
      clearAllActiveStates();
      const stepName = state.agrigrade.steps[stepIdx];

      if (stepName === 'branches') {
        if (nodes['4a']) nodes['4a'].classList.add('active-step');
        if (nodes['4b']) nodes['4b'].classList.add('active-step');
        if (nodes['4c']) nodes['4c'].classList.add('active-step');
        updateInspector('4a');

        if (particle) {
          particle.setAttribute('cx', nodeCoordinates['4b'].x);
          particle.setAttribute('cy', nodeCoordinates['4b'].y);
          particle.style.opacity = '1';
        }
      } else {
        const node = nodes[stepName];
        if (node) {
          node.classList.add('active-step');
          updateInspector(stepName);
        }

        const coords = nodeCoordinates[stepName];
        if (coords && particle) {
          particle.setAttribute('cx', coords.x);
          particle.setAttribute('cy', coords.y);
          particle.style.opacity = '1';
        }
      }
    }

    function nextStep() {
      state.agrigrade.currentStep = (state.agrigrade.currentStep + 1) % state.agrigrade.steps.length;
      activateStep(state.agrigrade.currentStep);
    }

    function startPlay() {
      state.agrigrade.isPlaying = true;
      if (playText) playText.textContent = 'Pause Flow';
      if (playIcon) playIcon.innerHTML = '&par;';
      if (playBtn) playBtn.classList.add('playing');

      state.agrigrade.timer = setInterval(() => {
        nextStep();
      }, 2200);
    }

    function pausePlay() {
      state.agrigrade.isPlaying = false;
      if (playText) playText.textContent = 'Play Flow';
      if (playIcon) playIcon.innerHTML = '&rtrif;';
      if (playBtn) playBtn.classList.remove('playing');
      clearInterval(state.agrigrade.timer);
    }

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (state.agrigrade.isPlaying) {
          pausePlay();
        } else {
          startPlay();
        }
      });
    }

    if (stepBtn) {
      stepBtn.addEventListener('click', () => {
        pausePlay();
        nextStep();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        pausePlay();
        state.agrigrade.currentStep = 0;
        activateStep(0);
      });
    }

    // Node click interactions for user exploration
    Object.keys(nodes).forEach((key) => {
      const nodeEl = nodes[key];
      if (nodeEl) {
        nodeEl.style.cursor = 'pointer';
        nodeEl.addEventListener('click', () => {
          pausePlay();
          clearAllActiveStates();
          nodeEl.classList.add('active-step');
          updateInspector(key);

          const coords = nodeCoordinates[key];
          if (coords && particle) {
            particle.setAttribute('cx', coords.x);
            particle.setAttribute('cy', coords.y);
            particle.style.opacity = '1';
          }
        });
      }
    });

    // Start with Node 1
    activateStep(0);
  }

  /* ==========================================================================
     4. FLOWCHART TABS (DIAGRAM SWITCHER)
     ========================================================================== */
  function initDiagramTabs() {
    const tabs = document.querySelectorAll('.diagram-tab');
    const panels = {
      agrigrade: document.getElementById('diagram-agrigrade-panel'),
      framework: document.getElementById('diagram-framework-panel'),
      portfolio: document.getElementById('diagram-portfolio-panel')
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-diagram');

        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        Object.keys(panels).forEach((key) => {
          if (panels[key]) {
            panels[key].classList.remove('active');
          }
        });

        if (panels[target]) {
          panels[target].classList.add('active');
        }
      });
    });

    // Problem-to-Product Step Click Handler
    const fwSteps = document.querySelectorAll('.p2p-step');
    const fwTitle = document.getElementById('fw-detail-title');
    const fwDesc = document.getElementById('fw-detail-desc');

    fwSteps.forEach((step) => {
      step.addEventListener('click', () => {
        const stepNum = step.getAttribute('data-step');
        fwSteps.forEach((s) => s.classList.remove('active'));
        step.classList.add('active');

        const data = frameworkData[stepNum];
        if (data && fwTitle && fwDesc) {
          fwTitle.textContent = data.title;
          fwDesc.innerHTML = `${data.desc}<div class="fw-principle"><strong>${data.principle}</strong></div>`;
        }
      });
    });
  }

  /* ==========================================================================
     5. LIVE GITHUB API INTEGRATION
     ========================================================================== */
  function initGitHubIntegration() {
    const grid = document.getElementById('github-repo-grid');
    const filterButtons = document.querySelectorAll('.repo-filter-btn');

    function renderRepositories(repos) {
      if (!grid) return;
      grid.innerHTML = '';

      if (repos.length === 0) {
        grid.innerHTML = `
          <div class="repo-empty-state">
            <p>No repositories match the selected category filter.</p>
          </div>
        `;
        return;
      }

      repos.forEach((repo) => {
        const card = document.createElement('article');
        card.className = 'repo-card';
        card.setAttribute('data-category', repo.category || 'systems');

        const date = new Date(repo.updated_at).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        });

        const langColor =
          repo.language === 'Python'
            ? '#3572A5'
            : repo.language === 'TypeScript'
            ? '#3178C6'
            : repo.language === 'JavaScript'
            ? '#f7df1e'
            : '#8b949e';

        card.innerHTML = `
          <div class="repo-card-top">
            <span class="repo-type-tag">${repo.category ? repo.category.toUpperCase() : 'CODE'}</span>
            <div class="repo-metrics">
              <span title="Stars">&#9733; ${repo.stargazers_count}</span>
              <span title="Forks">&#9903; ${repo.forks_count}</span>
            </div>
          </div>
          <h3 class="repo-name">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
              ${repo.name} <span>&nearr;</span>
            </a>
          </h3>
          <p class="repo-desc">${repo.description || 'Public repository maintained by @srtkio.'}</p>
          <div class="repo-card-bottom">
            <div class="repo-lang">
              <span class="lang-dot" style="background-color: ${langColor};"></span>
              <span>${repo.language || 'Code'}</span>
            </div>
            <span class="repo-updated">Updated ${date}</span>
          </div>
        `;

        grid.appendChild(card);
      });
    }

    // Filter Handlers
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        state.activeFilter = filter;

        if (filter === 'all') {
          renderRepositories(state.repositories);
        } else {
          const filtered = state.repositories.filter((r) => r.category === filter);
          renderRepositories(filtered);
        }
      });
    });

    // Fetch from GitHub REST API with Fallback
    fetch('https://api.github.com/users/srtkio/repos?per_page=100&sort=updated')
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API Status: ${res.status}`);
        return res.json();
      })
      .then((liveData) => {
        if (Array.isArray(liveData) && liveData.length > 0) {
          // Categorize and enrich live repos
          state.repositories = liveData.map((r) => {
            let cat = 'systems';
            const nameLower = r.name.toLowerCase();
            const descLower = (r.description || '').toLowerCase();

            if (
              nameLower.includes('agri') ||
              nameLower.includes('rag') ||
              descLower.includes('ai') ||
              descLower.includes('vision') ||
              descLower.includes('model')
            ) {
              cat = 'ai';
            } else if (nameLower.includes('worksheet') || nameLower.includes('sprint')) {
              cat = 'academic';
            }

            return {
              name: r.name,
              description: r.description,
              html_url: r.html_url,
              language: r.language,
              stargazers_count: r.stargazers_count,
              forks_count: r.forks_count,
              updated_at: r.updated_at,
              category: cat
            };
          });

          // Ensure featured repos with descriptions are always present
          fallbackRepos.forEach((fb) => {
            const exists = state.repositories.find((lr) => lr.name === fb.name);
            if (!exists) {
              state.repositories.unshift(fb);
            } else if (!exists.description) {
              exists.description = fb.description;
            }
          });
        } else {
          state.repositories = fallbackRepos;
        }
        renderRepositories(state.repositories);
      })
      .catch((err) => {
        console.warn('GitHub API Rate Limit / Network Notice: Using verified repo cache.', err);
        state.repositories = fallbackRepos;
        renderRepositories(state.repositories);
      });
  }

  /* ==========================================================================
     6. INTERACTIVE CASE STUDY MODAL DIALOG
     ========================================================================== */
  function initCaseStudyModal() {
    const modal = document.getElementById('case-study-modal');
    const closeBtn = document.getElementById('modal-close');
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const triggerButtons = document.querySelectorAll('.btn-case-study, .project-card-spotlight');

    if (!modal) return;

    function openCaseStudy(projectId) {
      const data = caseStudyData[projectId];
      if (!data) return;

      if (modalCategory) modalCategory.textContent = data.category;
      if (modalTitle) modalTitle.textContent = data.title;

      let techPills = data.techStack
        .map((t) => `<span class="pill">${t}</span>`)
        .join(' ');

      let linksHtml = '';
      if (data.repoUrl) {
        linksHtml += `<a href="${data.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">GitHub Repository &nearr;</a> `;
      }
      if (data.liveUrl) {
        linksHtml += `<a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">Live Demo &nearr;</a>`;
      }

      if (modalBody) {
        modalBody.innerHTML = `
          <div class="cs-section">
            <span class="cs-label">CURRENT STATUS &amp; ROLE</span>
            <div class="cs-status-box">
              <p><strong>Status:</strong> ${data.status}</p>
              <p><strong>Role:</strong> ${data.role}</p>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-label">THE PROBLEM STATEMENT</span>
            <p>${data.problem.replace(/\n/g, '<br>')}</p>
          </div>

          <div class="cs-section">
            <span class="cs-label">PROPOSED &amp; IMPLEMENTED SOLUTION</span>
            <p>${data.solution.replace(/\n/g, '<br>')}</p>
          </div>

          <div class="cs-section">
            <span class="cs-label">TECHNOLOGY STACK</span>
            <div class="project-tags">${techPills}</div>
          </div>

          <div class="cs-section">
            <span class="cs-label">ENGINEERING LESSONS LEARNED</span>
            <p>${data.lessons.replace(/\n/g, '<br>')}</p>
          </div>

          <div class="cs-actions">${linksHtml}</div>
        `;
      }

      modal.showModal();
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.close();
      document.body.style.overflow = '';
    }

    triggerButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // Prevent clicking internal repo links from opening modal
        if (e.target.closest('.project-repo-link')) return;

        const card = btn.closest('.project-card');
        if (card) {
          const id = card.getAttribute('data-project-id');
          if (id && caseStudyData[id]) {
            openCaseStudy(id);
          }
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        closeModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.open) {
        closeModal();
      }
    });
  }

  /* ==========================================================================
     7. GSAP SCROLLTRIGGER PROGRESSIVE ENHANCEMENT
     ========================================================================== */
  function initScrollAnimations() {
    if (state.reducedMotion) return;

    // Check if GSAP is available
    if (typeof gsap !== 'undefined') {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }

      // Hero headline staggered reveal
      const words = document.querySelectorAll('.hero-title .word');
      if (words.length > 0) {
        gsap.from(words, {
          y: 28,
          opacity: 0,
          duration: 0.8,
          stagger: 0.14,
          ease: 'power3.out'
        });
      }

      // Generic section reveal elements
      const animatedEls = document.querySelectorAll('[data-animate="fade-up"]');
      animatedEls.forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          y: 24,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.out'
        });
      });
    } else {
      // Pure CSS / IntersectionObserver Fallback if offline
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      document.querySelectorAll('[data-animate]').forEach((el) => {
        el.classList.add('will-reveal');
        observer.observe(el);
      });
    }
  }

  /* ==========================================================================
     8. APP INITIALIZATION
     ========================================================================== */
  function init() {
    initHeroWorkspace();
    initScrollProgressAndNav();
    initAgriGradeFlowchart();
    initDiagramTabs();
    initGitHubIntegration();
    initCaseStudyModal();
    initScrollAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
