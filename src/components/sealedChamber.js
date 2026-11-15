import { ICONS } from './icons.js';

const SECTORS = {
  events: {
    sector: 'SECTOR 01 // COMPETITION ARENAS',
    title: 'EVENT CATALOGUE',
    status: 'GATES NOT OPENED · ACCESS SEALED',
    badge: 'TRANSMISSION ENCRYPTED',
    tag: 'WILL BE NOTIFIED',
    desc: 'Official national-level challenges, algorithmic problem statements, Robo-Wars brackets, and prize bounty conduits are undergoing final orbital calibration. Registration portals will open in February 2027.',
  },
  workshops: {
    sector: 'SECTOR 02 // RESEARCH LABS',
    title: 'TECHNICAL WORKSHOPS',
    status: 'LABORATORIES SEALED · ACCESS LOCKED',
    badge: 'CLEARANCE RESTRICTED',
    tag: 'WILL BE NOTIFIED',
    desc: 'Hands-on deep tech masterclasses in Quantum Computing, Edge Silicon Architectures, and Neural Networks are locked under clearance protocols. Delegate seat allocations will unlock soon.',
  },
  speakers: {
    sector: 'SECTOR 03 // AUDITORIUM',
    title: 'KEYNOTE SPEAKERS',
    status: 'TRANSMISSION EMBARGO · COMING SOON',
    badge: 'FREQUENCY CLASSIFIED',
    tag: 'WILL BE NOTIFIED',
    desc: 'Addresses and symposium panels with aerospace pioneers, national research scientists, and deep-tech founders are currently under embargo. Sign up to receive immediate notification upon reveal.',
  },
  exhibits: {
    sector: 'SECTOR 04 // INNOVATION HANGAR',
    title: 'TECHNOLOGY EXHIBITIONS',
    status: 'ARENA GATES SEALED · ACCESS LOCKED',
    badge: 'HANGAR SECURED',
    tag: 'WILL BE NOTIFIED',
    desc: 'Autonomous mobility platforms, experimental aerospace prototypes, and student engineering innovations are under secure hangar assembly. Public exhibition passes will open shortly.',
  },
  schedule: {
    sector: 'SECTOR 05 // COMMAND CHRONOLOGY',
    title: 'FESTIVAL SCHEDULE',
    status: 'TIMELINE SEALED · GATES NOT OPENED',
    badge: 'CHRONOLOGY CLASSIFIED',
    tag: 'WILL BE NOTIFIED',
    desc: 'The complete 3-day February 2027 timeline, stage keynote timings, and tournament match bracket schedules are being finalized by festival command.',
  },
  pass: {
    sector: 'TICKETING // ACCESS CREDENTIALS',
    title: 'FESTIVAL ACCESS PASS',
    status: 'BADGING CONDUIT CLOSED · ACCESS SEALED',
    badge: 'DISPATCH SEALED',
    tag: 'WILL BE NOTIFIED',
    desc: 'Official festival delegate passes, workshop badges, and accommodation tiers are currently sealed. Register your frequency below to receive priority access before tickets go public.',
  },
  login: {
    sector: 'AUTHENTICATION GATEWAY',
    title: 'PARTICIPANT PORTAL',
    status: 'TERMINAL SEALED · ACCESS LOCKED',
    badge: 'AUTHENTICATION OFFLINE',
    tag: 'WILL BE NOTIFIED',
    desc: 'Participant credentials, team rosters, and institutional delegate accounts will activate upon festival launch window announcement.',
  },
};

export function renderSealedChamber(sectorKey = 'events') {
  const data = SECTORS[sectorKey] || SECTORS.events;

  return `<div class="ti-sealed-overlay" id="sealed-overlay" role="dialog" aria-modal="true" aria-labelledby="sealed-title">
    <div class="ti-sealed-backdrop" data-action="close-chamber" aria-hidden="true"></div>
    <div class="ti-sealed-chamber">
      <div class="ti-chamber-frame" aria-hidden="true">
        <span class="tcf-corner tcf-tl"></span>
        <span class="tcf-corner tcf-tr"></span>
        <span class="tcf-corner tcf-bl"></span>
        <span class="tcf-corner tcf-br"></span>
      </div>

      <button type="button" class="ti-chamber-close" data-action="close-chamber" title="Close chamber (ESC)" aria-label="Close chamber">
        ${ICONS.close}
      </button>

      <div class="ti-chamber-badge-strip">
        <span class="tcb-sector">${data.sector}</span>
        <span class="tcb-status-pill">
          <i class="tcb-dot" aria-hidden="true"></i>
          <span>${data.tag}</span>
        </span>
      </div>

      <div class="ti-chamber-lock-emblem">
        <div class="tcl-ring" aria-hidden="true"></div>
        <div class="tcl-icon">${ICONS.lock}</div>
      </div>

      <div class="ti-chamber-heading">
        <span class="ti-chamber-subtag">${data.badge}</span>
        <h2 class="ti-chamber-status" id="sealed-title">${data.status}</h2>
        <h3 class="ti-chamber-target">${data.title}</h3>
      </div>

      <p class="ti-chamber-desc">${data.desc}</p>

      <div class="ti-chamber-action-zone">
        <form class="ti-notify-form" data-notify-form data-sector="${sectorKey}">
          <label class="sr" for="notify-email">Email Address</label>
          <div class="ti-input-wrap">
            <input
              type="email"
              id="notify-email"
              class="ti-notify-input"
              placeholder="Enter email to receive priority dispatch..."
              required
              autocomplete="email"
            />
            <button type="submit" class="ti-notify-btn">
              <span class="tnb-icon">${ICONS.bell}</span>
              <span>WILL BE NOTIFIED</span>
            </button>
          </div>
        </form>
        <div class="ti-notify-success" data-notify-success style="display:none;">
          <span class="tns-icon">${ICONS.check}</span>
          <div class="tns-copy">
            <b>UPLINK RECORDED · WILL BE NOTIFIED</b>
            <small>Your frequency has been added to priority dispatch when gates unlock.</small>
          </div>
        </div>
      </div>

      <div class="ti-chamber-footer">
        <span class="tcf-meta">TITANIUM // 2027 · RAJALAKSHMI ENGINEERING COLLEGE · CHENNAI</span>
        <button type="button" class="ti-return-btn" data-action="close-chamber">
          <span>RETURN TO ORBIT</span>
          ${ICONS.arrow}
        </button>
      </div>
    </div>
  </div>`;
}

export function bindSealedEvents(root) {
  const overlay = root.querySelector('#sealed-overlay');
  if (!overlay) return;

  const form = overlay.querySelector('[data-notify-form]');
  const successBox = overlay.querySelector('[data-notify-success]');
  const input = overlay.querySelector('#notify-email');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = input?.value?.trim();
      if (!email) return;

      try {
        const stored = JSON.parse(localStorage.getItem('ti27-notifications') || '[]');
        stored.push({ email, sector: form.dataset.sector, date: new Date().toISOString() });
        localStorage.setItem('ti27-notifications', JSON.stringify(stored));
      } catch (err) {
        console.warn('Storage unavailable', err);
      }

      form.style.display = 'none';
      if (successBox) successBox.style.display = 'flex';
    });
  }

  const onKey = e => {
    if (e.key === 'Escape') closeChamber();
  };
  window.addEventListener('keydown', onKey);

  return () => {
    window.removeEventListener('keydown', onKey);
  };
}

export function closeChamber() {
  const overlay = document.querySelector('#sealed-overlay');
  if (overlay) {
    overlay.classList.add('is-closing');
    setTimeout(() => {
      overlay.remove();
      if (history.pushState) history.pushState(null, '', '/');
    }, 250);
  }
}
