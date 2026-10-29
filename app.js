/**
 * SARTHAK.EXE — COLD UI / PRECISION ENGINE & APPLICATION CONTROLLER
 * Architecture: Pure Vanilla JavaScript + Precision 3D Canvas Visualizer
 * Theme: Monochromatic Cold Editorial, Icy Chrome, Architectural Motion
 */

(function () {
  'use strict';

  // Global Application State
  const state = {
    theme: document.documentElement.getAttribute('data-theme') || 'light',
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

  /* ==========================================================================
     1. THEME SWITCHER ENGINE (LIGHT / DARK COLD SYSTEM)
     ========================================================================== */
  function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');

    function applyTheme(newTheme) {
      state.theme = newTheme;
      document.documentElement.setAttribute('data-theme', newTheme);
      try {
        localStorage.setItem('sarthak_theme', newTheme);
      } catch (e) {}

      // Notify Canvas Visualizer to adjust specular highlights
      if (window.renderPrecisionVisualizer) {
        window.renderPrecisionVisualizer.updateTheme(newTheme);
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const nextTheme = state.theme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
      });
    }

    // Listen for OS theme change if user hasn't set an explicit override
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('sarthak_theme')) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    } catch (e) {}
  }

  /* ==========================================================================
     2. CINEMATIC COLD HERO 3D PRECISION CANVAS ENGINE
     Draws rotating concentric chrome gimbal rings, floating faceted geometry,
     and wireframe architectural lines with interactive mouse parallax.
     ========================================================================== */
  function initHeroCanvasVisualizer() {
    const canvas = document.getElementById('hero-precision-canvas');
    const container = document.getElementById('hero-canvas-container');
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = 600);
    let height = (canvas.height = 600);

    // Interactive pointer state
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let baseAngle = 0;
    let isVisible = true;

    // Responsive Canvas Resizing
    function resizeCanvas() {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = rect.width * dpr;
      height = canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Mouse movement listener on desktop
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotY = x * 0.75;
      targetRotX = -y * 0.75;
    });

    container.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
    });

    // 3D Point Projection Helper
    function project(x, y, z, cx, cy, fov) {
      const zoom = fov / (fov + z);
      return {
        x: cx + x * zoom,
        y: cy + y * zoom,
        scale: zoom
      };
    }

    // 3D Point Rotation Helper
    function rotate3D(x, y, z, rotX, rotY, rotZ) {
      // Rotate around X
      let cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      let y1 = y * cosX - z * sinX;
      let z1 = y * sinX + z * cosX;

      // Rotate around Y
      let cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      let x2 = x * cosY + z1 * sinY;
      let z2 = -x * sinY + z1 * cosY;

      // Rotate around Z
      let cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);
      let x3 = x2 * cosZ - y1 * sinZ;
      let y3 = x2 * sinZ + y1 * cosZ;

      return { x: x3, y: y3, z: z2 };
    }

    // Render Loop
    function render() {
      if (!isVisible) {
        requestAnimationFrame(render);
        return;
      }

      const rect = container.getBoundingClientRect();
      const displayW = rect.width;
      const displayH = rect.height;
      const cx = displayW / 2;
      const cy = displayH / 2;
      const fov = 450;

      // Smooth interpolation for mouse parallax
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      if (!state.reducedMotion) {
        baseAngle += 0.008;
      }

      ctx.clearRect(0, 0, displayW, displayH);

      const isDark = state.theme === 'dark';
      const strokeMain = isDark ? 'rgba(236, 239, 244, 0.35)' : 'rgba(17, 19, 24, 0.35)';
      const strokeSubtle = isDark ? 'rgba(236, 239, 244, 0.12)' : 'rgba(17, 19, 24, 0.12)';
      const strokeHighlight = isDark ? '#7EB0F2' : '#4F7EC4';
      const fillFacet = isDark ? 'rgba(25, 39, 58, 0.35)' : 'rgba(221, 235, 250, 0.45)';

      // 1. Draw Ring 1: Outer Precision Chrome Gimbal (Radius 150)
      ctx.beginPath();
      const r1 = 150;
      const segs = 64;
      for (let i = 0; i <= segs; i++) {
        const theta = (i / segs) * Math.PI * 2;
        const pt = rotate3D(
          Math.cos(theta) * r1,
          Math.sin(theta) * r1,
          0,
          currentRotX + 0.35,
          currentRotY + baseAngle * 0.5,
          0
        );
        const pr = project(pt.x, pt.y, pt.z, cx, cy, fov);
        if (i === 0) ctx.moveTo(pr.x, pr.y);
        else ctx.lineTo(pr.x, pr.y);
      }
      ctx.strokeStyle = strokeMain;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Precision tick marks on Ring 1
      for (let i = 0; i < 24; i++) {
        const theta = (i / 24) * Math.PI * 2;
        const ptA = rotate3D(Math.cos(theta) * (r1 - 4), Math.sin(theta) * (r1 - 4), 0, currentRotX + 0.35, currentRotY + baseAngle * 0.5, 0);
        const ptB = rotate3D(Math.cos(theta) * (r1 + 4), Math.sin(theta) * (r1 + 4), 0, currentRotX + 0.35, currentRotY + baseAngle * 0.5, 0);
        const prA = project(ptA.x, ptA.y, ptA.z, cx, cy, fov);
        const prB = project(ptB.x, ptB.y, ptB.z, cx, cy, fov);
        ctx.beginPath();
        ctx.moveTo(prA.x, prA.y);
        ctx.lineTo(prB.x, prB.y);
        ctx.strokeStyle = i % 6 === 0 ? strokeHighlight : strokeSubtle;
        ctx.lineWidth = i % 6 === 0 ? 1.5 : 0.8;
        ctx.stroke();
      }

      // 2. Draw Ring 2: Orthogonal Chrome Gimbal (Radius 120)
      ctx.beginPath();
      const r2 = 120;
      for (let i = 0; i <= segs; i++) {
        const theta = (i / segs) * Math.PI * 2;
        const pt = rotate3D(
          Math.cos(theta) * r2,
          0,
          Math.sin(theta) * r2,
          currentRotX + baseAngle * 0.4,
          currentRotY + 0.4,
          0.2
        );
        const pr = project(pt.x, pt.y, pt.z, cx, cy, fov);
        if (i === 0) ctx.moveTo(pr.x, pr.y);
        else ctx.lineTo(pr.x, pr.y);
      }
      ctx.strokeStyle = strokeSubtle;
      ctx.lineWidth = 1;
      ctx.stroke();

      // 3. Central Faceted Geometric Prism (Octahedron / Diamond Structure)
      const r3 = 75;
      const vertices = [
        { x: 0, y: -r3 * 1.25, z: 0 }, // Top apex
        { x: r3, y: 0, z: 0 },          // Mid-ring
        { x: 0, y: 0, z: r3 },
        { x: -r3, y: 0, z: 0 },
        { x: 0, y: 0, z: -r3 },
        { x: 0, y: r3 * 1.25, z: 0 }   // Bottom apex
      ];

      const rotatedVertices = vertices.map((v) => {
        const pt = rotate3D(v.x, v.y, v.z, currentRotX + baseAngle, currentRotY + baseAngle * 0.7, 0);
        return project(pt.x, pt.y, pt.z, cx, cy, fov);
      });

      // Octahedron Faces
      const faces = [
        [0, 1, 2],
        [0, 2, 3],
        [0, 3, 4],
        [0, 4, 1],
        [5, 2, 1],
        [5, 3, 2],
        [5, 4, 3],
        [5, 1, 4]
      ];

      faces.forEach((f, idx) => {
        const p1 = rotatedVertices[f[0]];
        const p2 = rotatedVertices[f[1]];
        const p3 = rotatedVertices[f[2]];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();

        // Shading based on orientation
        ctx.fillStyle = idx % 2 === 0 ? fillFacet : 'rgba(169, 200, 245, 0.15)';
        ctx.fill();

        ctx.strokeStyle = strokeMain;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Vertex Highlight Nodes
      rotatedVertices.forEach((rv, i) => {
        ctx.beginPath();
        ctx.arc(rv.x, rv.y, i === 0 || i === 5 ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? strokeHighlight : strokeMain;
        ctx.fill();
      });

      // 4. Hairline Center Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - 24, cy);
      ctx.lineTo(cx + 24, cy);
      ctx.moveTo(cx, cy - 24);
      ctx.lineTo(cx, cy + 24);
      ctx.strokeStyle = strokeSubtle;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      requestAnimationFrame(render);
    }

    // Scroll Observer to pause rendering when out of viewport (Performance Optimization)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Expose update handler
    window.renderPrecisionVisualizer = {
      updateTheme: (newTheme) => {
        // Theme updated
      }
    };

    render();
  }

  /* ==========================================================================
     3. READING PROGRESS BAR & SCROLLSPY
     ========================================================================== */
  function initScrollProgressAndNav() {
    const progressBar = document.getElementById('reading-progress');
    const backToTopBtn = document.getElementById('floating-back-to-top');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const activeSectionLabel = document.getElementById('nav-active-section');
    const timelineProgress = document.getElementById('timeline-progress-line');
    const timelineContainer = document.getElementById('animated-timeline');

    const sectionNameMap = {
      home: 'PORTFOLIO / HOME',
      about: 'SECTION 01 / IDENTITY',
      architecture: 'SECTION 02 / ARCHITECTURE',
      projects: 'SECTION 03 / SELECTED WORK',
      github: 'SECTION 04 / GITHUB TELEMETRY',
      journey: 'SECTION 05 / CHRONOLOGY',
      achievements: 'SECTION 06 / MILESTONES',
      contact: 'SECTION 07 / CONTACT'
    };

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
        if (scrollTop > 500) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }

      // ScrollSpy: identify active section
      let currentId = 'home';
      sections.forEach((sec) => {
        const top = sec.offsetTop - 140;
        const height = sec.offsetHeight;
        if (scrollTop >= top && scrollTop < top + height) {
          currentId = sec.getAttribute('id');
        }
      });

      // Update active nav link
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });

      // Update live top nav text indicator
      if (activeSectionLabel && sectionNameMap[currentId]) {
        activeSectionLabel.textContent = sectionNameMap[currentId];
      }

      // Progressive Journey Timeline Hairline
      if (timelineProgress && timelineContainer) {
        const rect = timelineContainer.getBoundingClientRect();
        const winH = window.innerHeight;
        if (rect.top < winH && rect.bottom > 0) {
          const traveled = Math.max(0, winH * 0.65 - rect.top);
          const percent = Math.min(100, (traveled / rect.height) * 100);
          timelineProgress.style.height = `${percent}%`;
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
     4. FLOWCHART A: AGRIGRADE (AGRIINSPECT) PIPELINE ENGINE
     ========================================================================== */
  const agrigradeNodeData = {
    '1': {
      label: 'Node 01 of 09',
      badge: 'STEP 01 // LOT INIT',
      title: 'Create Inspection Lot',
      desc: 'The procurement inspector initiates a new session and enters a unique lot ID (e.g. <code>LOT: ON-2026-042</code>). Captures origin mandi parameters, timestamp, and batch volume before image collection begins.'
    },
    '2': {
      label: 'Node 02 of 09',
      badge: 'STEP 02 // RGB CAPTURE',
      title: 'Smartphone RGB Image Capture',
      desc: 'High-resolution produce images are acquired on standard smartphone hardware under ambient procurement centre lighting, eliminating proprietary scanner costs.'
    },
    '3': {
      label: 'Node 03 of 09',
      badge: 'STEP 03 // PRE-FLIGHT CHECK',
      title: 'Image Quality Validation',
      desc: 'Automated filters assess motion blur, exposure balance, occlusion, and bulb clustering. Corrupt or obscured images are rejected immediately for recapture.'
    },
    '4': {
      label: 'Node 04 of 09',
      badge: 'STEP 04 // CV SEGMENTATION',
      title: 'Computer Vision Analysis',
      desc: 'Visual models detect and segment individual onion instances. The single pipeline then branches into three parallel evaluation tasks.'
    },
    '4a': {
      label: 'Parallel Branch A',
      badge: 'BRANCH A // DEFECTS',
      title: 'Visible Defect Classification',
      desc: 'Identifies mechanical cuts, surface decay, black mold patches, and outer shell bruising across segmented produce.'
    },
    '4b': {
      label: 'Parallel Branch B',
      badge: 'BRANCH B // GERMINATION',
      title: 'Sprouting Detection',
      desc: 'Detects internal and emerging neck shoots. Sprouted bulbs deteriorate rapidly and trigger mandatory grade discounts.'
    },
    '4c': {
      label: 'Parallel Branch C',
      badge: 'BRANCH C // GEOMETRY',
      title: 'Calibrated Size Estimation',
      desc: 'Translates pixel diameter into millimeter measurements using reference parameters to categorize bulbs into commercial sizing bins.'
    },
    '5': {
      label: 'Node 05 of 09',
      badge: 'STEP 05 // SYNTHESIS',
      title: 'Batch Analytics & Aggregation',
      desc: 'Parallel observations consolidate into whole-lot distribution percentages (e.g., 78% healthy, 12% damaged, 5% rot, 3% sprouted, 2% undersized, 6 low-confidence cases).'
    },
    '6': {
      label: 'Node 06 of 09',
      badge: 'STEP 06 // RULES ENGINE',
      title: 'Standards & Rules Engine',
      desc: 'Batch data is evaluated against formal procurement standards (AGMARK / BIS IS 17912:2022). The AI observes; explicit decoupled code rules decide the grade.'
    },
    '7': {
      label: 'Node 07 of 09',
      badge: 'STEP 07 // DECISION GATE',
      title: 'Confidence-Based Decision Gate',
      desc: 'Observations with confidence scores ≥ 85% proceed directly to reporting. Borderline or ambiguous cases (< 85%) route to inspector review.'
    },
    '8': {
      label: 'Node 08 of 09',
      badge: 'STEP 08 // HUMAN AUDIT',
      title: 'Human Review & Override',
      desc: 'Procurement inspectors review flagged anomalies, override inaccurate classifications if necessary, and write an auditable justification.'
    },
    '9': {
      label: 'Node 09 of 09',
      badge: 'STEP 09 // DIGITAL CERT',
      title: 'Digital Quality Inspection Report',
      desc: 'Produces an explainable digital certificate complete with lot statistics, photographic evidence, and applied standards version.'
    }
  };

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

    const inspBadge = document.getElementById('insp-badge');
    const inspLabel = document.getElementById('insp-step-label');
    const inspTitle = document.getElementById('insp-title');
    const inspDesc = document.getElementById('insp-desc');

    const nodeCoords = {
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

    function updateInspector(key) {
      const data = agrigradeNodeData[key];
      if (!data) return;
      if (inspBadge) inspBadge.textContent = data.badge;
      if (inspLabel) inspLabel.textContent = data.label;
      if (inspTitle) inspTitle.textContent = data.title;
      if (inspDesc) inspDesc.innerHTML = data.desc;
    }

    function clearActive() {
      Object.values(nodes).forEach((n) => {
        if (n) n.classList.remove('active-step');
      });
      document.querySelectorAll('.pipe-line').forEach((l) => l.classList.remove('line-active'));
    }

    function activateStep(idx) {
      clearActive();
      const step = state.agrigrade.steps[idx];

      if (step === 'branches') {
        if (nodes['4a']) nodes['4a'].classList.add('active-step');
        if (nodes['4b']) nodes['4b'].classList.add('active-step');
        if (nodes['4c']) nodes['4c'].classList.add('active-step');
        updateInspector('4a');

        if (particle) {
          particle.setAttribute('cx', nodeCoords['4b'].x);
          particle.setAttribute('cy', nodeCoords['4b'].y);
        }
      } else {
        const node = nodes[step];
        if (node) {
          node.classList.add('active-step');
          updateInspector(step);
        }

        const coords = nodeCoords[step];
        if (coords && particle) {
          particle.setAttribute('cx', coords.x);
          particle.setAttribute('cy', coords.y);
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
      }, 2400);
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
        if (state.agrigrade.isPlaying) pausePlay();
        else startPlay();
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

    // Direct node click exploration
    Object.keys(nodes).forEach((key) => {
      const el = nodes[key];
      if (el) {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          pausePlay();
          clearActive();
          el.classList.add('active-step');
          updateInspector(key);

          const coords = nodeCoords[key];
          if (coords && particle) {
            particle.setAttribute('cx', coords.x);
            particle.setAttribute('cy', coords.y);
          }
        });
      }
    });

    activateStep(0);
  }

  /* ==========================================================================
     5. FLOWCHART TABS & PROBLEM-TO-PRODUCT MATRIX
     ========================================================================== */
  const frameworkData = {
    '1': {
      title: '01 • Problem Identification',
      desc: 'Great products do not start with code or hype; they start with observing friction. In projects like AgriInspect and Converge, the focus is on unaddressed real-world inefficiencies—such as subjective onion grading at mandis, or civic complaints closed without photographic proof.',
      principle: 'Core Rule: Fall in love with the problem, not the first solution.'
    },
    '2': {
      title: '02 • User Research & Field Empathy',
      desc: 'Interviewing procurement officers and municipal workers in their native physical contexts to understand time constraints, hardware reality, and environmental friction.',
      principle: 'Core Rule: The user in the field matters 10x more than the developer in the lab.'
    },
    '3': {
      title: '03 • Define Core Problem',
      desc: 'Distilling complex multi-variable noise into a single, falsifiable problem statement: "How do we make quality assessment objective and auditable using ordinary smartphones?"',
      principle: 'Core Rule: If you cannot state the problem in one sentence, you are not ready to build.'
    },
    '4': {
      title: '04 • Explore Solution Architecture',
      desc: 'Evaluating trade-offs between on-device inference vs cloud processing, decoupled rules engines vs black-box neural networks, and privacy-preserving storage.',
      principle: 'Core Rule: Choose boring, verifiable architecture over complex unexplainable stacks.'
    },
    '5': {
      title: '05 • Rapid Prototyping',
      desc: 'Building minimal testable artifacts to validate critical assumptions with real produce datasets within days, not months.',
      principle: 'Core Rule: A prototype answers questions that ten meetings cannot.'
    },
    '6': {
      title: '06 • Test & Iterate in Sprints',
      desc: 'Testing prototypes against real-world sample variations (lighting, camera angles, damaged produce) and measuring false positive rates.',
      principle: 'Core Rule: Seek disconfirming evidence early.'
    },
    '7': {
      title: '07 • Build Production MVP',
      desc: 'Writing clean, typed, modular code with clear documentation, reproducible schemas, and reliable audit logs for competition judging and real deployment.',
      principle: 'Core Rule: Polish every edge case; reliability is the best feature.'
    },
    '8': {
      title: '08 • Learn from Real Feedback',
      desc: 'Reviewing judge evaluations, stakeholder critiques, and real telemetry to guide roadmap iterations and maintain humility.',
      principle: 'Core Rule: Software is never finished; it is continuously refined.'
    }
  };

  function initDiagramTabs() {
    const tabs = document.querySelectorAll('.cold-tab');
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

        Object.keys(panels).forEach((k) => {
          if (panels[k]) panels[k].classList.remove('active');
        });
        if (panels[target]) panels[target].classList.add('active');
      });
    });

    // Step selection inside Problem-to-Product
    const stepRows = document.querySelectorAll('.p2p-step-row');
    const fwTitle = document.getElementById('fw-detail-title');
    const fwDesc = document.getElementById('fw-detail-desc');

    stepRows.forEach((row) => {
      row.addEventListener('click', () => {
        const stepNum = row.getAttribute('data-step');
        stepRows.forEach((r) => r.classList.remove('active'));
        row.classList.add('active');

        const data = frameworkData[stepNum];
        if (data && fwTitle && fwDesc) {
          fwTitle.textContent = data.title;
          fwDesc.innerHTML = `${data.desc}<div class="cold-principle-tag"><strong>${data.principle}</strong></div>`;
        }
      });
    });
  }

  /* ==========================================================================
     6. LIVE GITHUB REST API INTEGRATION
     ========================================================================== */
  const fallbackRepos = [
    {
      name: 'AgriGrade',
      description: 'AI-Assisted Agricultural Quality Inspection Platform (AgriInspect) for onion quality grading with computer vision, standards rules engine, and human auditability (SIH 2026).',
      html_url: 'https://github.com/srtkio/AgriGrade',
      language: 'Python',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-10-28T18:00:00Z',
      category: 'ai'
    },
    {
      name: 'RAGSeal',
      description: 'When a RAG answer is wrong, RAGSeal proves whether the retriever or the generator caused it. Built at Hypnexis \'26 (3rd place winner, Team Monster Energy).',
      html_url: 'https://github.com/srtkio/RAGSeal',
      language: 'Python',
      stargazers_count: 1,
      forks_count: 0,
      updated_at: '2026-10-24T12:00:00Z',
      category: 'ai'
    },
    {
      name: 'converge_trojans',
      description: 'City complaints, closed only when they are really fixed. Civic platform with SLA escalation and verified photographic resolution for Smart Cities.',
      html_url: 'https://github.com/srtkio/converge_trojans',
      language: 'TypeScript',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-10-20T14:30:00Z',
      category: 'systems'
    },
    {
      name: 'trojan-drop-forge',
      description: 'Modern full-stack component toolkit and frontend application scaffolding with TanStack Start, React 19, TypeScript, and Framer Motion.',
      html_url: 'https://github.com/srtkio/trojan-drop-forge',
      language: 'TypeScript',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-10-15T09:15:00Z',
      category: 'systems'
    },
    {
      name: 'SAI-worksheet-sarthakrai',
      description: 'Systems & AI coursework labs, computational thinking experiments, and algorithmic worksheets at Newton School of Technology.',
      html_url: 'https://github.com/srtkio/SAI-worksheet-sarthakrai',
      language: 'Python',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-09-30T16:00:00Z',
      category: 'academic'
    },
    {
      name: 'sprintzero',
      description: 'Initial sprint zero development sandbox, prototype setup, and technical explorations.',
      html_url: 'https://github.com/srtkio/sprintzero',
      language: 'JavaScript',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-09-20T11:00:00Z',
      category: 'academic'
    }
  ];

  function initGitHubIntegration() {
    const grid = document.getElementById('github-repo-grid');
    const filterButtons = document.querySelectorAll('.cold-filter-btn');

    function renderRepositories(repos) {
      if (!grid) return;
      grid.innerHTML = '';

      if (repos.length === 0) {
        grid.innerHTML = `<div class="repo-empty"><p>No repositories found in this category.</p></div>`;
        return;
      }

      repos.forEach((repo) => {
        const card = document.createElement('article');
        card.className = 'cold-repo-card';

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
            ? '#d4b106'
            : '#737B86';

        card.innerHTML = `
          <div class="repo-card-top">
            <span class="repo-type-tag">${(repo.category || 'CODE').toUpperCase()}</span>
            <div class="repo-metrics">
              <span>&#9733; ${repo.stargazers_count}</span>
              <span>&#9903; ${repo.forks_count}</span>
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

    // Filter Button Clicks
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        state.activeFilter = filter;

        if (filter === 'all') {
          renderRepositories(state.repositories);
        } else {
          renderRepositories(state.repositories.filter((r) => r.category === filter));
        }
      });
    });

    // Public GitHub API Fetch
    fetch('https://api.github.com/users/srtkio/repos?per_page=100&sort=updated')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((live) => {
        if (Array.isArray(live) && live.length > 0) {
          state.repositories = live.map((r) => {
            let cat = 'systems';
            const nameLower = r.name.toLowerCase();
            const descLower = (r.description || '').toLowerCase();

            if (nameLower.includes('agri') || nameLower.includes('rag') || descLower.includes('ai') || descLower.includes('vision')) {
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

          // Ensure verified descriptions exist
          fallbackRepos.forEach((fb) => {
            const found = state.repositories.find((lr) => lr.name === fb.name);
            if (!found) state.repositories.unshift(fb);
            else if (!found.description) found.description = fb.description;
          });
        } else {
          state.repositories = fallbackRepos;
        }
        renderRepositories(state.repositories);
      })
      .catch(() => {
        state.repositories = fallbackRepos;
        renderRepositories(state.repositories);
      });
  }

  /* ==========================================================================
     7. ACCESSIBLE CASE STUDY MODAL DIALOG
     ========================================================================== */
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

  function initCaseStudyModal() {
    const modal = document.getElementById('case-study-modal');
    const closeBtn = document.getElementById('modal-close');
    const catEl = document.getElementById('modal-category');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const triggerButtons = document.querySelectorAll('.btn-case-study, .card-spotlight');

    if (!modal) return;

    function openModal(id) {
      const data = caseStudyData[id];
      if (!data) return;

      if (catEl) catEl.textContent = data.category;
      if (titleEl) titleEl.textContent = data.title;

      const techBadges = data.techStack
        .map((t) => `<span class="cold-pill">${t}</span>`)
        .join(' ');

      let links = '';
      if (data.repoUrl) {
        links += `<a href="${data.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-cold-primary btn-sm">GitHub Repository &nearr;</a> `;
      }
      if (data.liveUrl) {
        links += `<a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-cold-secondary btn-sm">Live Demo &nearr;</a>`;
      }

      if (bodyEl) {
        bodyEl.innerHTML = `
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
            <div class="card-tag-cluster">${techBadges}</div>
          </div>

          <div class="cs-section">
            <span class="cs-label">ENGINEERING LESSONS LEARNED</span>
            <p>${data.lessons.replace(/\n/g, '<br>')}</p>
          </div>

          <div class="cs-actions">${links}</div>
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
        if (e.target.closest('.project-repo-link')) return;
        const card = btn.closest('.cold-project-card');
        if (card) {
          const id = card.getAttribute('data-project-id');
          if (id && caseStudyData[id]) openModal(id);
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const inDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!inDialog) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.open) closeModal();
    });
  }

  /* ==========================================================================
     8. CINEMATIC ENTRANCE & SCROLL CHOREOGRAPHY (GSAP WITH JS FALLBACK)
     ========================================================================== */
  function initChoreography() {
    if (state.reducedMotion) return;

    if (typeof gsap !== 'undefined') {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }

      // Stage 1 to 5: Hero Entrance Sequence
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Stage 1: Fine hairline & metadata
      tl.from('.hero-backdrop-hairline', { scaleX: 0, duration: 0.9, transformOrigin: 'left' })
        .from('.hero-meta-strip', { opacity: 0, y: -10, duration: 0.4 }, '-=0.4')
        // Stage 3: Masked typography entrance
        .from('.hero-line-inner', { y: '110%', opacity: 0, duration: 0.85, stagger: 0.14 }, '-=0.2')
        // Stage 4: Identity line & supporting copy
        .from('.hero-identity-line', { opacity: 0, y: 15, duration: 0.5 }, '-=0.4')
        .from('.hero-supporting-copy', { opacity: 0, y: 15, duration: 0.5 }, '-=0.3')
        // Stage 5: CTAs & telemetry
        .from('.hero-actions-row', { opacity: 0, y: 12, duration: 0.4 }, '-=0.3')
        .from('.hero-telemetry-row', { opacity: 0, duration: 0.4 }, '-=0.2')
        .from('.cold-canvas-wrapper', { opacity: 0, scale: 0.96, duration: 0.8 }, '-=0.7');

      // Stage 6: Scroll Handoff
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.to('.cold-canvas-wrapper', {
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          },
          y: -40,
          scale: 0.92,
          opacity: 0.6
        });

        // Scroll reveals for sections
        const revealElements = document.querySelectorAll('[data-reveal="fade"]');
        revealElements.forEach((el) => {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none'
            },
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
          });
        });
      }
    }
  }

  /* ==========================================================================
     9. APPLICATION BOOTSTRAP
     ========================================================================== */
  function init() {
    initThemeToggle();
    initHeroCanvasVisualizer();
    initScrollProgressAndNav();
    initAgriGradeFlowchart();
    initDiagramTabs();
    initGitHubIntegration();
    initCaseStudyModal();
    initChoreography();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
