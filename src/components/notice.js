// Game-style system window: a line appears, the window unfolds top-down
// with a flicker, lines type in, then it snaps shut.
import '../styles/notice.css';

const wait = ms => new Promise(r => setTimeout(r, ms));

function rng(seed) {
  let r = seed;
  return () => ((r = (r * 9301 + 49297) % 233280) / 233280);
}

// Chunky stepped side frame: three parallel stepped strokes plus solid blocks.
function sideFrame(seed) {
  const rand = rng(seed);
  const H = 400, paths = [], blocks = [];
  for (let k = 0; k < 3; k++) {
    let y = 0, x = 6 + k * 9, d = `M${x} 0`;
    while (y < H) {
      y = Math.min(H, y + 10 + rand() * 46);
      d += ` V${y.toFixed(1)}`;
      if (y < H) { x = 3 + k * 9 + (rand() - .5) * 10; d += ` H${x.toFixed(1)}`; }
    }
    paths.push(`<path class="k${k}" d="${d}"/>`);
  }
  for (let i = 0; i < 7; i++) {
    const y = rand() * (H - 40), h = 8 + rand() * 34, x = 4 + rand() * 18;
    blocks.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(3 + rand() * 6).toFixed(1)}" height="${h.toFixed(1)}"/>`);
  }
  return paths.join('') + blocks.join('');
}

const BAR = `<svg viewBox="0 0 1000 36" preserveAspectRatio="none" aria-hidden="true">
  <path class="sb-glow" d="M0 10 H54 L70 20 H930 L946 10 H1000 V26 H946 L930 30 H70 L54 26 H0 Z"/>
  <path class="sb-fill" d="M0 10 H54 L70 20 H930 L946 10 H1000 V26 H946 L930 30 H70 L54 26 H0 Z"/>
  <path class="sb-line" d="M0 10 H54 L70 20 H930 L946 10 H1000"/>
  <path class="sb-line thin" d="M96 4 H360 M640 4 H904 M420 33 H580"/>
</svg>`;

const DEFS = `<svg class="sysn-defs" aria-hidden="true" width="0" height="0">
  <filter id="sysn-electric" x="-5%" y="-80%" width="110%" height="260%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035 0.6" numOctaves="2" seed="3" result="n">
      <animate attributeName="seed" values="1;2;3;4;5;6;7;8" dur="0.8s" repeatCount="indefinite"/>
    </feTurbulence>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="sysn-wisps"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="4" seed="9"/>
    <feColorMatrix values="0 0 0 0 .15  0 0 0 0 .45  0 0 0 0 1  0 0 0 1.6 -.75"/></filter>
</svg>`;

export function createNotice(host, { lines = [] } = {}) {
  const el = document.createElement('div');
  el.className = 'sysn';
  el.dataset.phase = 'idle';
  el.setAttribute('role', 'status');
  el.innerHTML = `${DEFS}
    <div class="sysn-body">
      <svg class="sysn-wisps" aria-hidden="true"><rect width="100%" height="100%" filter="url(#sysn-wisps)"/></svg>
      <div class="sysn-scratch" aria-hidden="true"></div>
      <svg class="sysn-side left" viewBox="0 0 30 400" preserveAspectRatio="none" aria-hidden="true">${sideFrame(7)}</svg>
      <svg class="sysn-side right" viewBox="0 0 30 400" preserveAspectRatio="none" aria-hidden="true">${sideFrame(23)}</svg>
      <div class="sysn-inner">
        <div class="sysn-head">
          <span class="sysn-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15"/><path d="M20 11.5v11"/><circle class="dot" cx="20" cy="28.2" r="1.9"/></svg></span>
          <span class="sysn-title">NOTIFICATION</span>
        </div>
        <ul class="sysn-lines">
          ${lines.map((l, i) => `<li data-line="${i}"${l.strong ? ' class="strong"' : ''}><span class="b" aria-hidden="true">•</span><span class="t">[${l.prefix ? `<span class="pre">${l.prefix}</span> ` : ''}<span data-type></span><span class="pct" data-pct hidden></span>]</span><i class="sysn-box" aria-hidden="true"></i></li>`).join('')}
        </ul>
        <div class="sysn-progress" aria-hidden="true"><i data-bar></i></div>
      </div>
    </div>
    <div class="sysn-bar top">${BAR}</div>
    <div class="sysn-bar bottom">${BAR}</div>
    <div class="sysn-flash" aria-hidden="true"></div>`;
  host.append(el);

  const li = i => el.querySelector(`[data-line="${i}"]`);
  return {
    el,
    async open() {
      await wait(30);
      el.dataset.phase = 'line';     // thin line grows across
      await wait(380);
      el.dataset.phase = 'unfold';   // bottom bar travels down, window flickers in
      await wait(620);
      el.dataset.phase = 'live';
    },
    async type(i, speed = 22) {
      const row = li(i), text = lines[i].text, node = row.querySelector('[data-type]');
      row.classList.add('on');
      // Time-based so a throttled tab catches up instead of crawling.
      const t0 = performance.now();
      for (let k = 0; k < text.length;) {
        k = Math.min(text.length, Math.floor((performance.now() - t0) / speed) + 1);
        node.textContent = text.slice(0, k);
        if (k < text.length) await wait(speed);
      }
    },
    progress(i, value) {
      const pct = li(i).querySelector('[data-pct]');
      pct.hidden = false;
      pct.textContent = ` ${String(Math.round(value * 100)).padStart(3, '0')}%`;
      el.querySelector('[data-bar]').style.transform = `scaleX(${value})`;
    },
    check(i) { li(i).classList.add('checked'); },
    async close() {
      el.dataset.phase = 'fold';     // bottom bar snaps back up
      await wait(240);
      el.dataset.phase = 'gone';     // line collapses with a flash
      await wait(340);
      el.remove();
    },
  };
}
