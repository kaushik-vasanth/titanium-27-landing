// TITANIUM 2027 — Landing Page Standalone Application
import './styles/global.css';
import './styles/header.css';
import './styles/dock.css';
import './styles/home.css';
import './styles/sealed.css';

import { createSpace } from './components/space.js';
import { toggleAudio, isAudioActive, onAudioStateChange } from './components/audio.js';
import { headerComponent } from './components/header.js';
import { dockComponent } from './components/dock.js';
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

function sectorCard(s, i) {
  return `<article class="experience-card" data-sealed="${s.id}" style="--i:${i}">
    <div class="exp-card-top">
      <span class="exp-card-icon">${s.icon}</span>
      <span class="exp-card-track">${s.track}</span>
    </div>
    <h3 class="exp-card-title">${s.title}</h3>
    <p class="exp-card-desc">${s.desc}</p>
    <div class="exp-card-bottom">
      <span class="exp-card-meta">${s.meta}</span>
      <span class="exp-card-cta">
        <span>${s.cta}</span>
        ${ICONS.arrow}
      </span>
    </div>
  </article>`;
}

function renderLanding() {
  return `
    ${headerComponent()}

    <!-- Floating Flight Telemetry Stage Navigator -->
    <aside class="ti-telemetry-rail" aria-label="Flight stage navigation">
      <div class="ttr-track">
        <button type="button" class="ttr-step is-active" data-stage-target="stage-orbit" title="Jump to Stage 1: Orbit">
          <span class="ttr-pip"></span>
          <span class="ttr-tag">STAGE 01</span>
          <span class="ttr-label">ORBIT</span>
        </button>
        <span class="ttr-connector" aria-hidden="true"></span>
        <button type="button" class="ttr-step" data-stage-target="stage-descent" title="Jump to Stage 2: Descent">
          <span class="ttr-pip"></span>
          <span class="ttr-tag">STAGE 02</span>
          <span class="ttr-label">DESCENT</span>
        </button>
        <span class="ttr-connector" aria-hidden="true"></span>
        <button type="button" class="ttr-step" data-stage-target="stage-experience" title="Jump to Stage 3: Experience">
          <span class="ttr-pip"></span>
          <span class="ttr-tag">STAGE 03</span>
          <span class="ttr-label">EXPERIENCE</span>
        </button>
      </div>
    </aside>

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

          <div class="descent-telemetry-grid">
            <div class="dtg-cell">
              <span class="dtg-num">09</span>
              <span class="dtg-title">Technical Tracks</span>
              <span class="dtg-note">Robo-Wars, Hackathons, Paper presentations & AI Summits</span>
            </div>
            <div class="dtg-cell">
              <span class="dtg-num">₹10L+</span>
              <span class="dtg-title">Prize Bounty</span>
              <span class="dtg-note">Cash prizes, venture mentorship & incubator awards</span>
            </div>
            <div class="dtg-cell">
              <span class="dtg-num">15K+</span>
              <span class="dtg-title">National Delegates</span>
              <span class="dtg-note">Engineers, creators, developers and student pioneers</span>
            </div>
            <div class="dtg-cell">
              <span class="dtg-num">50+</span>
              <span class="dtg-title">Institutions</span>
              <span class="dtg-note">Top engineering and research colleges across India</span>
            </div>
          </div>

          <button type="button" class="ti-scroll-cue" data-stage-target="stage-experience" aria-label="Enter festival experience sectors">
            <span class="tsc-label">ENTER FESTIVAL SECTORS</span>
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
            <p class="experience-subheading">Every arena is engineered to test your technical mettle. Select your sector below to compete, build, or witness breakthrough demonstrations.</p>
          </div>

          <div class="experience-sectors">
            ${SECTORS.map(sectorCard).join('')}
          </div>
        </div>
      </section>
    </main>

    ${dockComponent()}
  `;
}

// Initialize space backdrop
let space = null;
try {
  space = createSpace(canvas);
} catch (e) {
  console.warn('WebGL space backdrop unavailable', e);
}

// Render app
app.innerHTML = renderLanding();

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
