import { ICONS } from './icons.js';
import { isAudioActive } from './audio.js';

export function dockComponent() {
  const isAudio = isAudioActive();
  return `<footer class="ti-dock" role="contentinfo">
    <!-- Utility Shortcuts -->
    <div class="ti-dock-utilities">
      <button type="button" class="ti-dock-btn" data-action="home" title="Return to Orbit" aria-label="Home">
        ${ICONS.home}
      </button>
      <button type="button" class="ti-dock-btn" data-sealed="schedule" title="Schedule" aria-label="Schedule">
        ${ICONS.schedule}
      </button>
      <button type="button" class="ti-dock-btn ti-dock-btn-pass" data-sealed="pass" title="Get Pass" aria-label="Get Pass">
        ${ICONS.pass}
        <span class="tdb-pass-label">Pass</span>
      </button>
    </div>

    <!-- Authentic Festival Metadata in Center -->
    <div class="ti-dock-fest-info">
      <div class="tdfi-primary">
        <span class="tdfi-badge">INDIA'S LARGEST TECH FEST</span>
        <span class="tdfi-dot" aria-hidden="true">·</span>
        <strong class="tdfi-title">TITANIUM 2027</strong>
        <span class="tdfi-dot" aria-hidden="true">·</span>
        <span class="tdfi-date">February 2027</span>
      </div>
      <div class="tdfi-venue">
        <span class="tdfi-globe" aria-hidden="true">${ICONS.globe}</span>
        <span>Rajalakshmi Engineering College · Chennai, Tamil Nadu, India</span>
      </div>
    </div>

    <!-- Utility Audio Control & Official Social Media Links -->
    <div class="ti-dock-actions">
      <button class="ti-dock-btn ti-audio-toggle" type="button" data-action="toggle-audio" title="Toggle ambient atmospheric drone" aria-label="Toggle ambient atmospheric drone" aria-pressed="${isAudio}">
        <span class="ti-audio-icon is-off"${isAudio ? ' style="display:none;"' : ''}>${ICONS.soundOff}</span>
        <span class="ti-audio-icon is-on"${!isAudio ? ' style="display:none;"' : ''}>${ICONS.soundOn}</span>
      </button>
      <div class="ti-dock-socials" aria-label="Official Social Channels">
        <a class="ti-social-btn" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
          ${ICONS.instagram}
        </a>
        <a class="ti-social-btn" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
          ${ICONS.linkedin}
        </a>
        <a class="ti-social-btn" href="https://x.com" target="_blank" rel="noopener noreferrer" title="X (Twitter)" aria-label="X">
          ${ICONS.x}
        </a>
      </div>
    </div>
  </footer>`;
}
