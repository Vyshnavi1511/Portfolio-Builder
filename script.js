/* =====================================================
   FOLIO — Portfolio Builder · script.js
   ===================================================== */

/* ── STATE ───────────────────────────────────────────── */
const state = {
  selectedTemplate: 'midnight',
  details: {},
  projects: [],
  domain: 'free',
  subdomain: '',
  deployedUrl: '',
};

const TEMPLATES = [
  { id:'midnight',  name:'Midnight',  tag:'Developer' },
  { id:'editorial', name:'Editorial', tag:'Designer'  },
  { id:'terminal',  name:'Terminal',  tag:'Engineer'  },
  { id:'glass',     name:'Glass',     tag:'Minimal'   },
  { id:'brutalist', name:'Brutalist', tag:'Bold'      },
  { id:'magazine',  name:'Magazine',  tag:'Creative'  },
];

const PREVIEW_COLORS = {
  midnight:  { bg:'#080a0e', text:'#f5f0e8', accent:'#c9a84c' },
  editorial: { bg:'#f8f5ef', text:'#111',    accent:'#1a1a1a' },
  terminal:  { bg:'#1a1a1a', text:'#7ec8e3', accent:'#28c840' },
  glass:     { bg:'#0f1117', text:'#fff',    accent:'#6366f1' },
  brutalist: { bg:'#fff',    text:'#000',    accent:'#000'    },
  magazine:  { bg:'#fafafa', text:'#111',    accent:'#dc2626' },
};

/* ── CURSOR ──────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  setTimeout(() => {
    trail.style.left = e.clientX + 'px';
    trail.style.top  = e.clientY + 'px';
  }, 80);
});

document.addEventListener('mouseover', e => {
  if (e.target.matches('a,button,[onclick],.template-card,.btpl-card,.pricing-card,.feature-card,.domain-option')) {
    document.body.classList.add('cursor-hover');
  } else {
    document.body.classList.remove('cursor-hover');
  }
});

/* ── TOAST ───────────────────────────────────────────── */
function toast(msg, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast show ${type}`;
  clearTimeout(t._t);
  t._t = setTimeout(() => t.className = 'toast', 3000);
}

/* ── SCREEN SWITCHING ────────────────────────────────── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${id}`).classList.add('active');
  window.scrollTo(0, 0);
}

/* ── LANDING ACTIONS ─────────────────────────────────── */
document.getElementById('startBuildingBtn')?.addEventListener('click', goToBuild);
document.getElementById('heroStartBtn')?.addEventListener('click', goToBuild);

function goToBuild() {
  showScreen('builder');
  showBuilderStep(1);
  renderBuilderTemplates();
}

function selectTemplate(id) {
  state.selectedTemplate = id;

  // Update landing template cards
  document.querySelectorAll('.template-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.template === id);
  });

  // Update builder template cards
  document.querySelectorAll('.btpl-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.template === id);
    c.querySelector('.btpl-check').textContent = c.dataset.template === id ? '✓' : '';
  });

  updateLivePreview();
}

/* ── BUILDER STEPS ───────────────────────────────────── */
function showBuilderStep(n) {
  document.querySelectorAll('.builder-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step-${n}`)?.classList.add('active');

  // Update step indicators
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`bstep-${i}`);
    if (!el) continue;
    el.classList.remove('active','done');
    if (i < n)  el.classList.add('done');
    if (i === n) el.classList.add('active');
  }

  if (n === 2) renderProjectsForm();
  if (n === 3) updateSubdomainFromName();
  if (n === 4) renderDeploySummary();
}

// Step navigation buttons
document.getElementById('toStep2')?.addEventListener('click', () => {
  if (!state.selectedTemplate) { toast('Please select a template', 'error'); return; }
  showBuilderStep(2);
});

document.getElementById('toStep1Back')?.addEventListener('click', () => showBuilderStep(1));

document.getElementById('toStep3')?.addEventListener('click', () => {
  const name = document.getElementById('bf-name')?.value.trim();
  if (!name) { toast('Please enter your name', 'error'); return; }
  collectDetails();
  showBuilderStep(3);
});

document.getElementById('toStep2Back')?.addEventListener('click', () => showBuilderStep(2));

document.getElementById('toStep4')?.addEventListener('click', () => {
  const sub = document.getElementById('subdomainInput')?.value.trim();
  if (state.domain === 'free' && !sub) { toast('Please enter a subdomain', 'error'); return; }
  state.subdomain = sub || document.getElementById('customDomainInput')?.value.trim();
  showBuilderStep(4);
});

document.getElementById('backToLanding')?.addEventListener('click', () => showScreen('landing'));

/* ── BUILDER TEMPLATES ───────────────────────────────── */
function renderBuilderTemplates() {
  const grid = document.getElementById('builderTemplateGrid');
  if (!grid) return;

  grid.innerHTML = TEMPLATES.map(t => `
    <div class="btpl-card ${state.selectedTemplate === t.id ? 'selected' : ''}"
         data-template="${t.id}" onclick="selectTemplate('${t.id}')">
      <div class="btpl-preview tpl-preview ${t.id}-preview">
        ${getTemplatePreviewHTML(t.id)}
      </div>
      <div class="btpl-info">
        <span class="btpl-name">${t.name}</span>
        <div class="btpl-check">${state.selectedTemplate === t.id ? '✓' : ''}</div>
      </div>
    </div>
  `).join('');
}

function getTemplatePreviewHTML(id) {
  const previews = {
    midnight:  `<div class="tp-nav"><div class="tp-logo"></div><div class="tp-links"><span></span><span></span><span></span></div></div><div class="tp-body"><div class="tp-hero-text"><div class="tp-h"></div><div class="tp-h short"></div><div class="tp-sub"></div><div class="tp-btn"></div></div><div class="tp-circle"></div></div>`,
    editorial: `<div class="tp-top-bar"><div class="tp-logo light"></div><div class="tp-links light"><span></span><span></span></div></div><div class="tp-editorial-body"><div class="tp-big-num">01</div><div class="tp-editorial-text"><div class="tp-h dark"></div><div class="tp-h dark short"></div><div class="tp-sub dark"></div></div><div class="tp-editorial-img"></div></div>`,
    terminal:  `<div class="tp-term-bar"><span class="td red"></span><span class="td yellow"></span><span class="td green"></span></div><div class="tp-term-body"><div class="tp-prompt"><span class="tp-dollar">$</span> whoami</div><div class="tp-output">Your Name</div><div class="tp-prompt"><span class="tp-dollar">$</span> ls skills/</div><div class="tp-output dim">react node python...</div><div class="tp-cursor-blink">▌</div></div>`,
    glass:     `<div class="tp-glass-bg"><div class="tp-blob b1"></div><div class="tp-blob b2"></div></div><div class="tp-glass-card"><div class="tp-gc-av"></div><div class="tp-gc-text"><div class="tp-h"></div><div class="tp-sub"></div></div></div>`,
    brutalist: `<div class="tp-brut-header">PORTFOLIO</div><div class="tp-brut-body"><div class="tp-brut-name">YOUR<br/>NAME</div><div class="tp-brut-line"></div><div class="tp-brut-tags"><span>DEV</span><span>DESIGN</span></div></div>`,
    magazine:  `<div class="tp-mag-grid"><div class="tp-mag-big"></div><div class="tp-mag-small"><div></div><div></div></div></div><div class="tp-mag-title">WORK</div>`,
  };
  return previews[id] || '';
}

/* ── DETAILS FORM ────────────────────────────────────── */
let projectCount = 1;

function renderProjectsForm() {
  const container = document.getElementById('projectsForm');
  if (!container || container.children.length > 0) return;
  addProjectBlock();
}

function addProjectBlock() {
  const container = document.getElementById('projectsForm');
  if (!container) return;
  if (container.children.length >= 3) { toast('Maximum 3 projects allowed', 'error'); return; }

  const idx = Date.now();
  const div = document.createElement('div');
  div.className = 'project-input-block';
  div.dataset.idx = idx;
  div.innerHTML = `
    <button class="proj-remove" onclick="removeProject(${idx})">✕</button>
    <div class="bf-group">
      <label>Project Name</label>
      <input type="text" class="bf-input proj-name" placeholder="E-Commerce Platform"/>
    </div>
    <div class="bf-row">
      <div class="bf-group">
        <label>Live URL</label>
        <input type="text" class="bf-input proj-url" placeholder="https://yourproject.com"/>
      </div>
      <div class="bf-group">
        <label>GitHub URL</label>
        <input type="text" class="bf-input proj-github" placeholder="github.com/you/repo"/>
      </div>
    </div>
    <div class="bf-group">
      <label>Short Description</label>
      <input type="text" class="bf-input proj-desc" placeholder="What does this project do?"/>
    </div>
    <div class="bf-group">
      <label>Tech Stack (comma separated)</label>
      <input type="text" class="bf-input proj-tech" placeholder="React, Node.js, MongoDB"/>
    </div>
  `;
  container.appendChild(div);

  // Live preview update on input
  div.querySelectorAll('.bf-input').forEach(inp =>
    inp.addEventListener('input', updateLivePreview)
  );
}

function removeProject(idx) {
  const el = document.querySelector(`[data-idx="${idx}"]`);
  if (el) el.remove();
}

document.getElementById('addProjectBtn')?.addEventListener('click', addProjectBlock);

// Skills chips
document.getElementById('bf-skills')?.addEventListener('input', e => {
  const chips = e.target.value.split(',').map(s=>s.trim()).filter(Boolean);
  const prev = document.getElementById('skillsPreview');
  if (!prev) return;
  prev.innerHTML = chips.map((s,i) =>
    `<span class="skill-chip" style="animation-delay:${i*0.06}s">${s}</span>`
  ).join('');
});

// Live preview updates on all details inputs
['bf-name','bf-role','bf-bio','bf-location'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', updateLivePreview);
});

function collectDetails() {
  state.details = {
    name:     document.getElementById('bf-name')?.value.trim(),
    role:     document.getElementById('bf-role')?.value.trim(),
    bio:      document.getElementById('bf-bio')?.value.trim(),
    location: document.getElementById('bf-location')?.value.trim(),
    github:   document.getElementById('bf-github')?.value.trim(),
    linkedin: document.getElementById('bf-linkedin')?.value.trim(),
    email:    document.getElementById('bf-email')?.value.trim(),
    twitter:  document.getElementById('bf-twitter')?.value.trim(),
    skills:   document.getElementById('bf-skills')?.value.split(',').map(s=>s.trim()).filter(Boolean),
  };

  state.projects = [];
  document.querySelectorAll('.project-input-block').forEach(block => {
    const name = block.querySelector('.proj-name')?.value.trim();
    if (!name) return;
    state.projects.push({
      name,
      url:    block.querySelector('.proj-url')?.value.trim(),
      github: block.querySelector('.proj-github')?.value.trim(),
      desc:   block.querySelector('.proj-desc')?.value.trim(),
      tech:   block.querySelector('.proj-tech')?.value.split(',').map(s=>s.trim()).filter(Boolean),
    });
  });
}

/* ── LIVE PREVIEW ────────────────────────────────────── */
function updateLivePreview() {
  const frame = document.getElementById('livePreview');
  if (!frame) return;

  const tpl = state.selectedTemplate;
  const c   = PREVIEW_COLORS[tpl] || PREVIEW_COLORS.midnight;
  const name = document.getElementById('bf-name')?.value || 'Your Name';
  const role = document.getElementById('bf-role')?.value || 'Developer';
  const bio  = document.getElementById('bf-bio')?.value  || 'Building beautiful things for the web.';
  const skills = (document.getElementById('bf-skills')?.value || 'React, Node.js').split(',').map(s=>s.trim()).filter(Boolean);

  frame.innerHTML = buildLivePreview(tpl, c, name, role, bio, skills);
}

function buildLivePreview(tpl, c, name, role, bio, skills) {
  if (tpl === 'terminal') {
    return `<div style="background:#1a1a1a;height:100%;padding:16px;font-family:'Fira Code',monospace;font-size:11px;color:#7ec8e3">
      <div style="display:flex;gap:5px;margin-bottom:12px"><span style="width:8px;height:8px;border-radius:50%;background:#ff5f57"></span><span style="width:8px;height:8px;border-radius:50%;background:#febc2e"></span><span style="width:8px;height:8px;border-radius:50%;background:#28c840"></span></div>
      <div><span style="color:#28c840">$</span> whoami</div>
      <div style="color:#fff;margin-bottom:8px;padding-left:12px">${name}</div>
      <div><span style="color:#28c840">$</span> cat title.txt</div>
      <div style="color:#fff;margin-bottom:8px;padding-left:12px">${role}</div>
      <div><span style="color:#28c840">$</span> ls skills/</div>
      <div style="color:rgba(255,255,255,0.5);padding-left:12px">${skills.slice(0,3).join('  ')}</div>
      <div style="color:#7ec8e3;margin-top:8px">▌</div>
    </div>`;
  }

  if (tpl === 'brutalist') {
    return `<div style="background:#fff;height:100%;padding:0;border:3px solid #000;font-family:sans-serif;overflow:hidden">
      <div style="background:#000;color:#fff;padding:6px 12px;font-size:10px;font-weight:900;letter-spacing:0.2em">${name.toUpperCase()}</div>
      <div style="padding:16px">
        <div style="font-size:1.4rem;font-weight:900;line-height:1;margin-bottom:8px;letter-spacing:-0.03em">${role.toUpperCase()}</div>
        <div style="height:2px;background:#000;margin-bottom:10px"></div>
        <div style="font-size:11px;color:#555;margin-bottom:12px">${bio.substring(0,80)}...</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">${skills.slice(0,3).map(s=>`<span style="border:1.5px solid #000;padding:2px 8px;font-size:10px;font-weight:700">${s}</span>`).join('')}</div>
      </div>
    </div>`;
  }

  if (tpl === 'editorial') {
    return `<div style="background:#f8f5ef;height:100%;padding:16px;font-family:sans-serif">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid #ddd;padding-bottom:8px">
        <div style="font-weight:900;font-size:12px">${name.split(' ')[0].toLowerCase()}</div>
        <div style="display:flex;gap:8px;font-size:9px;color:#888">${['About','Work','Contact'].join(' · ')}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:center">
        <div>
          <div style="font-size:9px;color:#888;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:6px">${role}</div>
          <div style="font-size:1.2rem;font-weight:900;line-height:1.1;margin-bottom:8px">${name}</div>
          <div style="font-size:10px;color:#555;line-height:1.5">${bio.substring(0,60)}...</div>
        </div>
        <div style="background:linear-gradient(135deg,#e5e0d8,#c5bcaf);border-radius:10px;height:100px"></div>
      </div>
    </div>`;
  }

  if (tpl === 'glass') {
    return `<div style="background:#0f1117;height:100%;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center">
      <div style="position:absolute;width:120px;height:120px;background:#6366f1;border-radius:50%;filter:blur(40px);top:-20px;left:-20px;opacity:0.5"></div>
      <div style="position:absolute;width:140px;height:140px;background:#ec4899;border-radius:50%;filter:blur(40px);bottom:-30px;right:-30px;opacity:0.5"></div>
      <div style="background:rgba(255,255,255,0.08);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:20px;width:80%;position:relative;z-index:1;text-align:center">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#ec4899);margin:0 auto 10px"></div>
        <div style="color:#fff;font-weight:700;font-size:12px;margin-bottom:4px">${name}</div>
        <div style="color:rgba(255,255,255,0.5);font-size:10px">${role}</div>
      </div>
    </div>`;
  }

  if (tpl === 'magazine') {
    return `<div style="background:#fafafa;height:100%;padding:14px;font-family:sans-serif">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;height:100px">
        <div style="background:linear-gradient(135deg,#e5e0d8,#d0c8bc);border-radius:8px;position:relative;overflow:hidden">
          <div style="position:absolute;bottom:8px;left:8px;font-size:9px;font-weight:900;color:#333">${name}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="flex:1;background:#e8e3dc;border-radius:8px"></div>
          <div style="flex:1;background:#d8d0c5;border-radius:8px"></div>
        </div>
      </div>
      <div style="font-size:0.7rem;font-weight:900;letter-spacing:0.2em;color:#111;border-top:2px solid #000;padding-top:8px">${role.toUpperCase()}</div>
    </div>`;
  }

  // Default: midnight
  return `<div style="background:#080a0e;height:100%;display:flex;align-items:center;padding:20px;font-family:sans-serif">
    <div style="flex:1">
      <div style="font-family:monospace;font-size:9px;color:#3d7fbd;letter-spacing:0.1em;margin-bottom:8px">&lt; ${role} /&gt;</div>
      <div style="font-size:1.3rem;font-weight:900;color:#f5f0e8;line-height:1;margin-bottom:4px">${name}</div>
      <div style="font-size:1rem;color:#c9a84c;font-style:italic;margin-bottom:10px">${role}</div>
      <div style="font-size:10px;color:rgba(245,240,232,0.5);line-height:1.5;margin-bottom:12px">${bio.substring(0,70)}...</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">${skills.slice(0,3).map(s=>`<span style="font-size:9px;padding:2px 8px;background:rgba(255,255,255,0.06);color:rgba(245,240,232,0.5);border-radius:3px">${s}</span>`).join('')}</div>
    </div>
    <div style="width:60px;height:60px;border-radius:50%;border:2px solid #c9a84c;flex-shrink:0;background:linear-gradient(135deg,#1a1f2e,#0d1117)"></div>
  </div>`;
}

// Device toggle
document.querySelectorAll('.dev-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.dev-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const frame = document.getElementById('livePreview');
    if (!frame) return;
    frame.classList.toggle('mobile-mode', btn.dataset.device === 'mobile');
  });
});

/* ── DOMAIN ──────────────────────────────────────────── */
function selectDomain(type) {
  state.domain = type;
  document.getElementById('domFree').classList.toggle('active', type === 'free');
  document.getElementById('domCustom').classList.toggle('active', type === 'custom');
  document.querySelectorAll('.do-radio').forEach((r, i) => {
    r.classList.toggle('active', (i === 0) === (type === 'free'));
  });
}

function updateSubdomainFromName() {
  const name = state.details.name || document.getElementById('bf-name')?.value || '';
  const slug = name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  const input = document.getElementById('subdomainInput');
  if (input && !input.value) {
    input.value = slug;
    checkSubdomain();
  }
}

let subTimer;
function checkSubdomain() {
  clearTimeout(subTimer);
  const input  = document.getElementById('subdomainInput');
  const status = document.getElementById('subdomainStatus');
  if (!input || !status) return;

  const val = input.value.trim();
  if (!val) { status.textContent = ''; return; }

  status.textContent = '…';
  status.style.color = '#888';

  subTimer = setTimeout(() => {
    // Simulate availability check
    const taken = ['john','jane','test','demo','admin','sherlock'];
    if (taken.includes(val)) {
      status.textContent = '✗ Taken';
      status.style.color = '#dc2626';
    } else {
      status.textContent = '✓ Available';
      status.style.color = '#0d9488';
      state.subdomain = val;
    }
  }, 600);
}

/* ── DEPLOY SUMMARY ──────────────────────────────────── */
function renderDeploySummary() {
  collectDetails();
  const tpl = TEMPLATES.find(t => t.id === state.selectedTemplate);
  const url = state.domain === 'free'
    ? `folio.dev/${state.subdomain || 'your-name'}`
    : (document.getElementById('customDomainInput')?.value || 'your-domain.com');

  state.deployedUrl = url;

  document.getElementById('deploySummary').innerHTML = `
    <div class="deploy-sum-title">Deployment Summary</div>
    <div class="sum-row">
      <span class="sum-label">Template</span>
      <span class="sum-value"><span class="sum-tpl-dot"></span>${tpl?.name || 'Midnight'}</span>
    </div>
    <div class="sum-row">
      <span class="sum-label">Name</span>
      <span class="sum-value">${state.details.name || '—'}</span>
    </div>
    <div class="sum-row">
      <span class="sum-label">Role</span>
      <span class="sum-value">${state.details.role || '—'}</span>
    </div>
    <div class="sum-row">
      <span class="sum-label">Projects</span>
      <span class="sum-value">${state.projects.length} project${state.projects.length !== 1 ? 's' : ''}</span>
    </div>
    <div class="sum-row">
      <span class="sum-label">Domain</span>
      <span class="sum-value" style="color:#0d9488;font-family:'Fira Code',monospace;font-size:0.82rem">${url}</span>
    </div>
    <div class="sum-row">
      <span class="sum-label">Framework</span>
      <span class="sum-value">Next.js on Vercel</span>
    </div>
    <div class="sum-row">
      <span class="sum-label">SSL</span>
      <span class="sum-value" style="color:#0d9488">Auto-provisioned ✓</span>
    </div>
  `;
}

/* ── DEPLOY ──────────────────────────────────────────── */
const DEPLOY_LOGS = [
  '> Initializing build environment...',
  '> Installing dependencies (next, react, tailwind)...',
  '> Compiling portfolio from template...',
  '> Optimising images and assets...',
  '> Running type checks...',
  '> Building production bundle...',
  '> Deploying to Vercel edge network...',
  '> Assigning domain and SSL certificate...',
  '> Running health checks...',
  '✓ Build complete! Deploying...',
];

document.getElementById('deployBtn')?.addEventListener('click', startDeploy);

function startDeploy() {
  document.getElementById('deployIdle').style.display     = 'none';
  document.getElementById('deployProgress').style.display = 'block';

  const logContainer = document.getElementById('deployLog');
  const bar          = document.getElementById('deployBar');

  logContainer.innerHTML = '';
  bar.style.width = '0%';

  DEPLOY_LOGS.forEach((line, i) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className  = 'dp-log-line';
      div.textContent = line;
      logContainer.appendChild(div);
      logContainer.scrollTop = logContainer.scrollHeight;
      bar.style.width = ((i + 1) / DEPLOY_LOGS.length * 100) + '%';

      if (i === DEPLOY_LOGS.length - 1) {
        setTimeout(showDeploySuccess, 800);
      }
    }, i * 650 + Math.random() * 200);
  });
}

function showDeploySuccess() {
  document.getElementById('deployProgress').style.display = 'none';
  document.getElementById('deploySuccess').style.display  = 'block';

  const url = state.deployedUrl || 'folio.dev/your-name';
  document.getElementById('deployedUrl').textContent = url;

  // Confetti
  const container = document.getElementById('confetti');
  const colors = ['#0d9488','#fbbf24','#f472b6','#60a5fa','#a78bfa','#f87171'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * -20}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${Math.random() * 2 + 1.5}s;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    container.appendChild(piece);
  }

  // Save to "portfolios"
  const saved = JSON.parse(localStorage.getItem('folio_portfolios') || '[]');
  saved.unshift({
    id:       Date.now(),
    name:     state.details.name || 'My Portfolio',
    template: state.selectedTemplate,
    url,
    created:  new Date().toLocaleDateString('en-IN'),
  });
  localStorage.setItem('folio_portfolios', JSON.stringify(saved.slice(0, 10)));

  document.getElementById('visitSiteBtn').onclick = () => {
    toast(`Opening https://${url}`, 'success');
  };
}

function copyUrl() {
  const url = state.deployedUrl || 'folio.dev/your-name';
  navigator.clipboard?.writeText(`https://${url}`).then(() => toast('URL copied!', 'success'));
}

function goToDashboard() {
  showScreen('dashboard');
  renderDashboard();
}

/* ── DASHBOARD ───────────────────────────────────────── */
function renderDashboard() {
  const container = document.getElementById('dashPortfolios');
  if (!container) return;

  const saved = JSON.parse(localStorage.getItem('folio_portfolios') || '[]');

  if (!saved.length) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#888">
      <div style="font-size:2.5rem;margin-bottom:12px">◈</div>
      <p>No portfolios yet. <button onclick="goToBuild()" style="background:none;border:none;color:#0d9488;cursor:pointer;font-weight:700;font-size:1rem">Create your first →</button></p>
    </div>`;
    return;
  }

  const previewColor = { midnight:'#080a0e', editorial:'#f8f5ef', terminal:'#1a1a1a', glass:'#0f1117', brutalist:'#fff', magazine:'#fafafa' };

  container.innerHTML = saved.map(p => `
    <div class="dash-portfolio-card">
      <div class="dpc-preview" style="background:${previewColor[p.template]||'#080a0e'}">
        <div class="dpc-badge">Live</div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:2rem;opacity:0.15">⬡</div>
      </div>
      <div class="dpc-info">
        <div class="dpc-name">${p.name}</div>
        <div class="dpc-url">${p.url}</div>
        <div class="dpc-meta">
          <span>Template: ${p.template}</span>
          <span>${p.created}</span>
        </div>
      </div>
      <div class="dpc-actions">
        <button class="dpc-btn dpc-btn-primary" onclick="toast('Opening live site…','success')">Visit ↗</button>
        <button class="dpc-btn dpc-btn-ghost" onclick="toast('Opening editor…','info')">Edit</button>
      </div>
    </div>
  `).join('');
}

/* ── INIT ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Set today date in hero
  document.getElementById('heroBadge')?.remove();

  // Default template selected on landing
  selectTemplate('midnight');

  // Initial live preview
  updateLivePreview();
});
