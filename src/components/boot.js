// Preloader: a blank screen, then a system notification unfolds top-down,
// reports loading, asks the question, snaps shut, and the warp begins.
import '../styles/boot.css';
import { createNotice } from './notice.js';

const wait = ms => new Promise(r => setTimeout(r, ms));

/**
 * @param {object} opts
 * @param {boolean} opts.full  first visit: include the question and the long warp
 * @param {Promise[]} opts.tasks  real loading work to track
 * @param {(instant:boolean) => Promise} opts.onWarp  camera dive, started as the window closes
 */
export function runBoot({ full = true, tasks = [], onWarp = async () => {} } = {}) {
  const boot = document.createElement('div');
  boot.className = 'boot';
  boot.dataset.state = 'blank';
  boot.innerHTML = full ? '<button type="button" class="boot-skip" data-skip>Skip <span aria-hidden="true">»</span></button>' : '';
  document.body.append(boot);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let real = 0, skipped = false;
  const total = Math.max(1, tasks.length);
  tasks.forEach(t => Promise.resolve(t).catch(() => {}).finally(() => { real += 1 / total; }));
  const giveUp = setTimeout(() => { real = 1; }, 6000);
  const skip = () => { skipped = true; };
  boot.querySelector('[data-skip]')?.addEventListener('click', skip);
  const onKey = e => { if (e.key === 'Escape') skip(); };
  addEventListener('keydown', onKey);

  const lines = [
    { prefix: 'Linking to', text: 'REC ground station' },
    ...(full ? [{ text: 'Are you ready for something big?', strong: true }] : []),
  ];

  return (async () => {
    if (reduce) {
      await Promise.race([Promise.all(tasks.map(t => Promise.resolve(t).catch(() => {}))), wait(6000)]);
    } else {
      await wait(full ? 450 : 120);            // a beat of empty space
      const notice = createNotice(boot, { lines });
      await notice.open();
      if (!skipped) await notice.type(0, full ? 20 : 8);

      // Loading progress, eased over time so it never jumps.
      const start = performance.now(), minTime = full ? 1500 : 500;
      let shown = 0, prev = start;
      while (!(shown >= .999 && (real >= 1 || skipped))) {
        await new Promise(r => requestAnimationFrame(r));
        const now = performance.now(), dt = Math.min(.25, (now - prev) / 1000); prev = now;
        const timeShare = Math.min(1, (now - start) / minTime);
        const target = skipped ? 1 : Math.min(timeShare, real >= 1 ? 1 : .96);
        shown += (target - shown) * (1 - Math.exp(-dt * (skipped ? 30 : 6)));
        if (target - shown < .002) shown = target;
        notice.progress(0, shown);
      }
      notice.check(0);
      if (full && !skipped) {
        await wait(320);
        await notice.type(1, 42);
        await wait(220);
        notice.check(1);
        await wait(1100);
      } else {
        await wait(skipped ? 0 : 240);
      }
      await notice.close();
    }

    clearTimeout(giveUp);
    removeEventListener('keydown', onKey);
    boot.dataset.state = 'open';
    const warp = onWarp(reduce || skipped);
    setTimeout(() => boot.remove(), reduce ? 0 : 900);
    return { warp }; // wrapped so the caller does not wait for the whole dive
  })();
}
