// Solo Leveling System Notification Holographic HUD Chamber
const SECTORS = {
  speakers: {
    categoryTag: 'SPEAKERS · GUILD HALL',
    sealedLine: 'Sealed · This gate has not opened yet.',
    lore: 'Researchers, founders and engineers will share how they cleared their own gates. The line-up is being confirmed.',
    notifyLine: 'You will be notified when it opens.',
    primaryBtn: 'QUEST BOARD',
    primaryAction: 'events',
  },
  events: {
    categoryTag: 'EVENTS · QUEST BOARD',
    sealedLine: 'Sealed · This gate has not opened yet.',
    lore: 'Hunters and engineers will face 9 national trial arenas from robotic combat to algorithmic cryptography. Challenge parameters are being calibrated.',
    notifyLine: 'You will be notified when it opens.',
    primaryBtn: 'TRAINING GROUNDS',
    primaryAction: 'workshops',
  },
  workshops: {
    categoryTag: 'WORKSHOPS · TRAINING GROUNDS',
    sealedLine: 'Sealed · This gate has not opened yet.',
    lore: 'Masterclasses in Quantum Computing, Edge Silicon, and Neural Architectures will sharpen your abilities. Training slots are being prepared.',
    notifyLine: 'You will be notified when it opens.',
    primaryBtn: 'QUEST BOARD',
    primaryAction: 'events',
  },
  exhibits: {
    categoryTag: 'EXHIBITS · RELICS',
    sealedLine: 'Sealed · This gate has not opened yet.',
    lore: 'Autonomous prototype rigs, aerospace models, and hardware artifacts are being secured in the hangar. Arena viewing conduits are locked.',
    notifyLine: 'You will be notified when it opens.',
    primaryBtn: 'QUEST BOARD',
    primaryAction: 'events',
  },
  schedule: {
    categoryTag: 'SCHEDULE · TIMELINE',
    sealedLine: 'Sealed · This gate has not opened yet.',
    lore: 'The 3-day February 2027 festival timeline and tournament match bracket schedules are undergoing final synchronization.',
    notifyLine: 'You will be notified when it opens.',
    primaryBtn: 'QUEST BOARD',
    primaryAction: 'events',
  },
  pass: {
    categoryTag: 'GET PASS · LICENSE',
    sealedLine: 'Sealed · This gate has not opened yet.',
    lore: 'Hunter licenses and early access pass tiers are being prepared for public dispatch. Registration conduits are sealed.',
    notifyLine: 'You will be notified when it opens.',
    primaryBtn: 'QUEST BOARD',
    primaryAction: 'events',
  },
  login: {
    categoryTag: 'SIGN IN · AUTHENTICATION',
    sealedLine: 'Sealed · This gate has not opened yet.',
    lore: 'Hunter identification cards and institutional delegate accounts will activate upon festival launch window announcement.',
    notifyLine: 'You will be notified when it opens.',
    primaryBtn: 'QUEST BOARD',
    primaryAction: 'events',
  },
};

const CHECK_ICON = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
const GLYPH_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="12" rx="8" ry="10"/><ellipse cx="12" cy="12" rx="4" ry="6"/><circle cx="12" cy="12" r="1.5"/></svg>`;

export function renderSealedChamber(sectorKey = 'speakers') {
  const data = SECTORS[sectorKey] || SECTORS.speakers;

  return `<div class="notif-overlay" id="sealed-overlay" role="dialog" aria-modal="true" aria-labelledby="notif-title-text">
    <div class="notif-backdrop" data-action="close-chamber" aria-hidden="true"></div>

    <div class="notif-chamber">
      <!-- Glowing Top & Bottom Horizontal Light Rails -->
      <div class="notif-rail notif-rail-top" aria-hidden="true"></div>
      <div class="notif-rail notif-rail-bottom" aria-hidden="true"></div>

      <!-- Stepped Cybernetic Circuit Teeth on Left & Right -->
      <svg class="notif-teeth notif-teeth-left" viewBox="0 0 32 360" preserveAspectRatio="none" aria-hidden="true">
        <path d="M26 0 V40 H14 V70 H26 V130 H8 V150 H26 V210 H14 V240 H26 V290 H8 V320 H26 V360" stroke="#5fe0ff" stroke-width="2.5" fill="none" vector-effect="non-scaling-stroke" />
        <path d="M20 50 H8 V60 H20" stroke="#5fe0ff" stroke-width="1.5" fill="none" />
        <path d="M20 220 H8 V230 H20" stroke="#5fe0ff" stroke-width="1.5" fill="none" />
        <rect x="2" y="136" width="4" height="8" fill="#5fe0ff" />
        <rect x="2" y="296" width="4" height="8" fill="#5fe0ff" />
      </svg>
      <svg class="notif-teeth notif-teeth-right" viewBox="0 0 32 360" preserveAspectRatio="none" aria-hidden="true">
        <path d="M6 0 V40 H18 V70 H6 V130 H24 V150 H6 V210 H18 V240 H6 V290 H24 V320 H6 V360" stroke="#5fe0ff" stroke-width="2.5" fill="none" vector-effect="non-scaling-stroke" />
        <path d="M12 50 H24 V60 H12" stroke="#5fe0ff" stroke-width="1.5" fill="none" />
        <path d="M12 220 H24 V230 H12" stroke="#5fe0ff" stroke-width="1.5" fill="none" />
        <rect x="26" y="136" width="4" height="8" fill="#5fe0ff" />
        <rect x="26" y="296" width="4" height="8" fill="#5fe0ff" />
      </svg>

      <!-- Inner Holographic Cockpit Frame -->
      <div class="notif-screen">
        <button type="button" class="notif-close-corner" data-action="close-chamber" title="Dismiss Notification" aria-label="Dismiss Notification">✕</button>

        <!-- Header: Glyph Box + NOTIFICATION Box -->
        <div class="notif-header">
          <div class="notif-glyph-box" aria-hidden="true">
            ${GLYPH_ICON}
          </div>
          <div class="notif-title-box">
            <span class="notif-title" id="notif-title-text">NOTIFICATION</span>
          </div>
        </div>

        <!-- Category Tag in Red -->
        <div class="notif-category">${data.categoryTag}</div>

        <!-- System Message Rows with Checkboxes -->
        <div class="notif-body-list">
          <div class="notif-row">
            <span class="notif-bullet">•</span>
            <span class="notif-text">[ ${data.sealedLine} ]</span>
            <span class="notif-checkbox" aria-hidden="true">${CHECK_ICON}</span>
          </div>
          <div class="notif-row notif-row-indent">
            <span class="notif-bullet-space"></span>
            <span class="notif-text">[ ${data.lore} ]</span>
            <span class="notif-checkbox" aria-hidden="true">${CHECK_ICON}</span>
          </div>
          <div class="notif-row">
            <span class="notif-bullet">•</span>
            <span class="notif-text">[ ${data.notifyLine} ]</span>
            <span class="notif-checkbox" aria-hidden="true">${CHECK_ICON}</span>
          </div>
        </div>

        <!-- Priority Notification Uplink Form -->
        <div class="notif-uplink-container">
          <form class="notif-form" data-notify-form data-sector="${sectorKey}">
            <div class="notif-input-row">
              <input
                type="email"
                id="notif-email"
                class="notif-email-field"
                placeholder="Enter email to receive notification..."
                required
                autocomplete="email"
              />
              <button type="submit" class="notif-submit-btn">
                <span>WILL BE NOTIFIED</span>
              </button>
            </div>
          </form>
          <div class="notif-success-banner" data-notify-success style="display:none;">
            <span class="nsb-check">${CHECK_ICON}</span>
            <span>UPLINK RECORDED · YOU WILL BE NOTIFIED WHEN THIS GATE OPENS</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="notif-action-row">
          <button type="button" class="notif-sci-btn" data-sealed="${data.primaryAction}">
            <span class="nsb-bracket">[</span>
            <span class="nsb-label">${data.primaryBtn}</span>
            <span class="nsb-bracket">]</span>
          </button>
          <button type="button" class="notif-sci-btn" data-action="close-chamber">
            <span class="nsb-bracket">[</span>
            <span class="nsb-label">RETURN TO ORBIT</span>
            <span class="nsb-bracket">]</span>
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

export function bindSealedEvents(root) {
  const overlay = root?.id === 'sealed-overlay' ? root : (root?.querySelector('#sealed-overlay') || root);
  if (!overlay) return;

  const form = overlay.querySelector('[data-notify-form]');
  const successBox = overlay.querySelector('[data-notify-success]');
  const input = overlay.querySelector('#notif-email');

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
    }, 200);
  }
}
