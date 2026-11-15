import { ICONS } from './icons.js';

const REC_MARK = '/brand/rec-mark.png';

export function headerComponent() {
  return `<header class="ti-header-rail" role="banner">
    <!-- Left Wing Rail Navigation -->
    <nav class="ti-rail-wing ti-rail-left" aria-label="Festival Sectors Primary">
      <button type="button" class="ti-rail-link" data-sealed="events" data-label="Event Catalogue">
        <span class="ti-rail-text">Explore</span>
        <span class="ti-rail-indicator" aria-hidden="true"></span>
      </button>
      <button type="button" class="ti-rail-link" data-sealed="workshops" data-label="Technical Workshops">
        <span class="ti-rail-text">Workshops</span>
        <span class="ti-rail-indicator" aria-hidden="true"></span>
      </button>
      <button type="button" class="ti-rail-link" data-sealed="speakers" data-label="Keynote Speakers">
        <span class="ti-rail-text">Speakers</span>
        <span class="ti-rail-indicator" aria-hidden="true"></span>
      </button>
    </nav>

    <!-- Dedicated Central TITANIUM Emblem Throneroom -->
    <div class="ti-emblem-center-dock">
      <a class="ti-emblem-anchor" href="/" aria-label="TITANIUM 2027 home">
        <div class="ti-emblem-disc">
          <span class="ti-emblem-ring" aria-hidden="true"></span>
          <img class="ti-emblem-rec" src="${REC_MARK}" alt="REC" width="286" height="286" />
        </div>
        <div class="ti-emblem-brand">
          <div class="ti-emblem-word-row">
            <span class="ti-wordmark ti-emblem-wm" role="img" aria-label="TITANIUM"></span>
            <span class="ti-emblem-year">2027</span>
          </div>
          <span class="ti-identity-tag">INDIA'S LARGEST TECH FEST</span>
        </div>
      </a>
    </div>

    <!-- Right Wing Rail Navigation -->
    <nav class="ti-rail-wing ti-rail-right" aria-label="Festival Sectors Secondary">
      <button type="button" class="ti-rail-link" data-sealed="exhibits" data-label="Tech Exhibitions">
        <span class="ti-rail-text">Exhibits</span>
        <span class="ti-rail-indicator" aria-hidden="true"></span>
      </button>
      <button type="button" class="ti-rail-link" data-sealed="schedule" data-label="Festival Schedule">
        <span class="ti-rail-text">Schedule</span>
        <span class="ti-rail-indicator" aria-hidden="true"></span>
      </button>
      <button type="button" class="ti-rail-link" data-sealed="pass" data-label="Festival Access Pass">
        <span class="ti-rail-text">Get Pass</span>
        <span class="ti-rail-indicator" aria-hidden="true"></span>
      </button>
    </nav>

    <!-- Separate Smaller Sign In Control & Audio Control at Far Right -->
    <div class="ti-auth-dock">
      <button class="ti-audio-header-btn ti-audio-toggle" type="button" data-action="toggle-audio" title="Toggle ambient atmospheric audio" aria-label="Toggle ambient atmospheric audio" aria-pressed="false">
        <span class="ti-audio-icon is-off">${ICONS.soundOff}</span>
        <span class="ti-audio-icon is-on" style="display:none;">${ICONS.soundOn}</span>
      </button>
      <button type="button" class="ti-signin-ctrl" data-sealed="login" data-label="Participant Portal">
        <span class="tsc-icon">${ICONS.login}</span>
        <span class="tsc-label">Sign in</span>
      </button>
    </div>
  </header>`;
}
