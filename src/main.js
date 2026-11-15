// TITANIUM 2027 — Landing Page Standalone Application
import './styles/global.css';
import './styles/header.css';
import './styles/home.css';
import './styles/sealed.css';

import { createSpace } from './components/space.js';
import { toggleAudio, isAudioActive, onAudioStateChange } from './components/audio.js';
import { headerComponent } from './components/header.js';
import { runBoot } from './components/boot.js';
import { renderSealedChamber, bindSealedEvents, closeChamber } from './components/sealedChamber.js';
import { ICONS } from './components/icons.js';

const app = document.querySelector('#app');
const canvas = document.querySelector('#space');

// Countdown target: February 2027
const target = Date.parse('2027-02-01T00:00:00+05:30');
const units = [['Days', 86400], ['Hours', 3600], ['Mins', 60], ['Secs', 1]];

// The two compulsory hero action cards: EXPLORE and GET PASS
const HERO_MODULES = [
  {
    id: 'explore',
    sector: 'events',
    title: 'Explore',
    sub: 'Event Catalogue',
    meta: '09 Challenges · Live',
    icon: ICONS.explore,
  },
  {
    id: 'pass',
    sector: 'pass',
    title: 'Get Pass',
    sub: 'Festival Access Pass',
    meta: 'Access Tiers · Badges',
    icon: ICONS.pass,
  },
];

// Stage 3 Festival Experience Sectors
const SECTORS = [
  {
    id: 'events',
    title: 'Event Catalogue',
    track: '09 Flagship Tracks',
    desc: 'From robotic combat and algorithmic cybersecurity to generative AI hackathons and autonomous rovers.',
    meta: 'National Arena',
    cta: 'Explore Events',
    icon: ICONS.events,
  },
  {
    id: 'workshops',
    title: 'Technical Workshops',
    track: 'Hands-on Masterclasses',
    desc: 'Deep-dive masterclasses led by frontier architects in quantum computing, edge silicon, and neural networks.',
    meta: 'Deep Tech Labs',
    cta: 'View Workshops',
    icon: ICONS.workshops,
  },
  {
    id: 'speakers',
    title: 'Keynote Speakers',
    track: 'Global Visionaries',
    desc: 'Seminal addresses from aerospace pioneers, national researchers, founders, and frontier tech scientists.',
    meta: 'Auditorium Stage',
    cta: 'Discover Speakers',
    icon: ICONS.speakers,
  },
  {
    id: 'exhibits',
    title: 'Tech Exhibitions',
    track: 'Live Prototyping',
    desc: 'Witness breakthrough autonomous mobility rigs, experimental drones, and student engineering innovations.',
    meta: 'Innovation Pavilion',
    cta: 'View Exhibits',
    icon: ICONS.exhibits,
  },
  {
    id: 'schedule',
    title: 'Schedule & Passes',
    track: 'February 2027 · 3 Days',
    desc: 'Complete 3-day timeline, track chronologies, and festival passes for all accredited student delegates.',
    meta: 'Festival Command',
    cta: 'View Schedule',
    icon: ICONS.schedule,
  },
];

function heroModuleCard(m, i) {
  return `<button type="button" class="hero-module" data-sealed="${m.sector}" style="--i:${i}">
    <span class="hm-icon">${m.icon}</span>
    <span class="hm-copy">
      <b>${m.title}</b>
      <small>${m.sub}</small>
    </span>
    <span class="hm-meta"><i></i>${m.meta}</span>
    <span class="hm-go" aria-hidden="true">${ICONS.arrow}</span>
  </button>`;
}

function statStrip() {
  return `<div class="telemetry-stat-strip">
    <div class="tss-item">
      <div class="tss-num-row">
        <span class="tss-num">09</span>
        <span class="tss-unit">Tracks</span>
      </div>
      <strong class="tss-label">Flagship Arenas</strong>
      <p class="tss-detail">Robo-Wars, Hackathons, Paper presentations & AI Summits</p>
    </div>
    <div class="tss-divider" aria-hidden="true"></div>
    <div class="tss-item">
      <div class="tss-num-row">
        <span class="tss-num">₹10L+</span>
        <span class="tss-unit">Pool</span>
      </div>
      <strong class="tss-label">Prize Bounty</strong>
      <p class="tss-detail">Cash prizes, venture mentorship & incubator awards</p>
    </div>
    <div class="tss-divider" aria-hidden="true"></div>
    <div class="tss-item">
      <div class="tss-num-row">
        <span class="tss-num">15K+</span>
        <span class="tss-unit">Delegates</span>
      </div>
      <strong class="tss-label">National Delegates</strong>
      <p class="tss-detail">Engineers, creators, developers and student pioneers</p>
    </div>
    <div class="tss-divider" aria-hidden="true"></div>
    <div class="tss-item">
      <div class="tss-num-row">
        <span class="tss-num">50+</span>
        <span class="tss-unit">Institutes</span>
      </div>
      <strong class="tss-label">Top Engineering Colleges</strong>
      <p class="tss-detail">Leading universities and technical institutes across India</p>
    </div>
  </div>`;
}

function manifestRow(s, i) {
  const num = String(i + 1).padStart(2, '0');
  return `<div class="manifest-row" data-sealed="${s.id}" tabindex="0" role="button" aria-label="${s.title}">
    <div class="mr-lead">
      <span class="mr-index">${num}</span>
      <div class="mr-titles">
        <h3 class="mr-title">${s.title}</h3>
        <span class="mr-track">${s.track}</span>
      </div>
    </div>
    <p class="mr-desc">${s.desc}</p>
    <div class="mr-trail">
      <span class="mr-meta">${s.meta}</span>
      <span class="mr-gate-badge">SEALED</span>
      <span class="mr-arrow" aria-hidden="true">${ICONS.arrow}</span>
    </div>
  </div>`;
}

function renderLanding() {
  return `
    ${headerComponent()}

    <main class="ti-landing-container" id="focus">
      <!-- STAGE 1 — ORBIT -->
      <section class="ti-stage ti-stage-orbit" id="stage-orbit">
        <div class="hero-content">
          <p class="hero-kicker"><span></span>Rajalakshmi Engineering College presents<span></span></p>
          <h1 class="hero-title" aria-label="TITANIUM 2027">
            <span class="ti-wordmark ht-word" role="img" aria-label="TITANIUM"></span>
            <span class="ht-year">2027</span>
          </h1>
          <p class="hero-tag"><b>National Level Techfest</b><span aria-hidden="true">//</span>Beyond the clouds, a festival awaits.</p>
          <div class="hero-countdown" role="timer" aria-label="Countdown">
            <p>Launch window · February 2027</p>
            <div>${units.map(([l]) => `<span><b data-unit>00</b><small>${l}</small></span>`).join('<i aria-hidden="true">:</i>')}</div>
          </div>
        </div>

        <!-- Compulsory Hero Action Cards: EXPLORE and GET PASS -->
        <div class="hero-modules">
          ${HERO_MODULES.map(heroModuleCard).join('')}
        </div>

        <!-- Scroll Descent Cue -->
        <button type="button" class="ti-scroll-cue" data-stage-target="stage-descent" aria-label="Scroll down to initiate descent">
          <span class="tsc-label">INITIATE DESCENT TO FESTIVAL</span>
          <span class="tsc-arrow" aria-hidden="true">${ICONS.arrow}</span>
        </button>
      </section>

      <!-- STAGE 2 — DESCENT -->
      <section class="ti-stage ti-stage-descent" id="stage-descent">
        <div class="descent-backdrop" aria-hidden="true"></div>
        <div class="descent-container">
          <div class="descent-badge-row">
            <span class="descent-telemetry-tag">RE-ENTRY VECTOR · 13.01°N 80.00°E</span>
            <span class="descent-status-dot" aria-hidden="true"></span>
            <span class="descent-status-text">ATMOSPHERE INTERFACE ESTABLISHED</span>
          </div>
          <div class="descent-lead">
            <p class="eyebrow">STAGE 02 // SUB-ORBITAL APPROACH</p>
            <h2 class="descent-heading">DESCENT TO TITANIUM 2027</h2>
            <p class="descent-subheading">Transitioning from low-Earth orbit to the campus of Rajalakshmi Engineering College, Chennai. Ground stations fully illuminated for India's largest technical convergence.</p>
          </div>

          ${statStrip()}

          <button type="button" class="ti-scroll-cue" data-stage-target="stage-experience" aria-label="Enter festival experience sectors">
            <span class="tsc-label">EXPLORE FESTIVAL DIRECTORY</span>
            <span class="tsc-arrow" aria-hidden="true">${ICONS.arrow}</span>
          </button>
        </div>
      </section>

      <!-- STAGE 3 — THE EXPERIENCE -->
      <section class="ti-stage ti-stage-experience" id="stage-experience">
        <div class="experience-container">
          <div class="experience-header">
            <p class="eyebrow">STAGE 03 // SURFACE TERMINAL</p>
            <h2 class="experience-heading">THE FESTIVAL EXPERIENCE</h2>
            <p class="experience-subheading">Every arena is engineered to test your technical mettle. Select a sector to inspect details.</p>
          </div>

          <div class="manifest-directory">
            ${SECTORS.map(manifestRow).join('')}
          </div>
        </div>
      </section>
    </main>
  `;
}

// Initialize space backdrop
let space = null;
try {
  space = createSpace(canvas);
  space?.jump('deep');
} catch (e) {
  console.warn('WebGL space backdrop unavailable', e);
}

// Render app with preloader handoff
app.innerHTML = renderLanding();
app.style.opacity = '0';
app.style.transition = 'opacity 0.8s ease';

const fontsReady = document.fonts?.ready ?? Promise.resolve();
const tasks = [
  fontsReady,
  new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))),
];

runBoot({
  full: true,
  tasks,
  onWarp: instant => {
    if (!space || instant) {
      space?.jump('orbit');
      return Promise.resolve();
    }
    return space.travel('orbit', 2800);
  },
}).then(async ({ warp }) => {
  if (warp) {
    await Promise.race([warp, new Promise(r => setTimeout(r, 1600))]);
  }
  app.style.opacity = '1';
});

// Countdown clock timer
const digits = [...app.querySelectorAll('[data-unit]')];
function updateCountdown() {
  let left = Math.max(0, Math.ceil((target - Date.now()) / 1000));
  units.forEach(([, s], i) => {
    const v = String(Math.floor(left / s)).padStart(2, '0');
    if (digits[i] && digits[i].textContent !== v) digits[i].textContent = v;
    left %= s;
  });
  setTimeout(updateCountdown, 1000 - (Date.now() % 1000));
}
updateCountdown();

// Scroll & Telemetry Stage Synchronizer
const telemetrySteps = [...app.querySelectorAll('.ttr-step')];
const stages = [
  document.querySelector('#stage-orbit'),
  document.querySelector('#stage-descent'),
  document.querySelector('#stage-experience'),
].filter(Boolean);

function onWindowScroll() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const scrollRatio = Math.max(0, Math.min(1, window.scrollY / maxScroll));

  // Sync 3D Earth Camera Tilt / Dive
  space?.setScrollProgress(scrollRatio);

  // Update Telemetry Step highlighting
  const currentY = window.scrollY + window.innerHeight * 0.35;
  let activeIdx = 0;
  stages.forEach((st, idx) => {
    if (st.offsetTop <= currentY) activeIdx = idx;
  });

  telemetrySteps.forEach((btn, idx) => {
    btn.classList.toggle('is-active', idx === activeIdx);
  });
}
window.addEventListener('scroll', onWindowScroll, { passive: true });
onWindowScroll();

// Global Click Delegation
let unbindChamber = null;

function openChamber(sectorKey) {
  unbindChamber?.();
  const existing = document.querySelector('#sealed-overlay');
  existing?.remove();

  const temp = document.createElement('div');
  temp.innerHTML = renderSealedChamber(sectorKey);
  const overlay = temp.firstElementChild;
  document.body.appendChild(overlay);
  unbindChamber = bindSealedEvents(overlay);
}

document.addEventListener('click', e => {
  // Sealed sector trigger ("Gates Not Opened / Will be notified")
  const sealedTrigger = e.target.closest('[data-sealed]');
  if (sealedTrigger) {
    e.preventDefault();
    const sectorKey = sealedTrigger.dataset.sealed;
    openChamber(sectorKey);
    return;
  }

  // Close chamber
  const closeTrigger = e.target.closest('[data-action="close-chamber"]');
  if (closeTrigger) {
    e.preventDefault();
    closeChamber();
    return;
  }

  // Stage Jump Navigation
  const jumpTrigger = e.target.closest('[data-stage-target]');
  if (jumpTrigger) {
    e.preventDefault();
    const targetId = jumpTrigger.dataset.stageTarget;
    const targetEl = document.querySelector(`#${targetId}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }

  // Home Shortcut
  const homeTrigger = e.target.closest('[data-action="home"]');
  if (homeTrigger) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Audio Toggle Button
  const audioTrigger = e.target.closest('[data-action="toggle-audio"]');
  if (audioTrigger) {
    e.preventDefault();
    const isNowActive = toggleAudio();
    document.querySelectorAll('.ti-audio-toggle').forEach(btn => {
      btn.setAttribute('aria-pressed', String(isNowActive));
      const off = btn.querySelector('.ti-audio-icon.is-off');
      const on = btn.querySelector('.ti-audio-icon.is-on');
      if (off) off.style.display = isNowActive ? 'none' : '';
      if (on) on.style.display = isNowActive ? '' : 'none';
    });
    return;
  }
});

// Check initial URL route
const initialPath = location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
const routeMap = {
  explore: 'events',
  events: 'events',
  workshops: 'workshops',
  speakers: 'speakers',
  exhibits: 'exhibits',
  experience: 'exhibits',
  schedule: 'schedule',
  pass: 'pass',
  'get-your-pass': 'pass',
  login: 'login',
  signin: 'login',
  profile: 'login',
};
if (initialPath && routeMap[initialPath]) {
  openChamber(routeMap[initialPath]);
}
