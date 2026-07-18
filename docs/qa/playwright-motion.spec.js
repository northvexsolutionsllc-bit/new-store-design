const { chromium, devices } = require('playwright');
const path = require('path');

const HARNESS = 'file://' + path.resolve(__dirname, 'harness.final.html');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const MOTION_JS = 'file:///home/user/new-store-design/assets/gloeus-motion.js';

const results = [];
function log(profile, name, pass, detail) {
  results.push({ profile, name, pass, detail: detail || '' });
  console.log(`${pass ? 'PASS' : 'FAIL'} [${profile}] ${name}${detail ? ' — ' + detail : ''}`);
}

async function instrument(page) {
  // Count opacity-transition starts per element id/class to prove single-act (no re-runs).
  await page.addInitScript(() => {
    window.__optrans = 0;
    document.addEventListener('transitionrun', (e) => {
      if (e.propertyName === 'opacity' &&
          (e.target.classList.contains('g-enter') || e.target.classList.contains('g-mask-i'))) {
        window.__optrans++;
      }
    }, true);
  });
}

async function runProfile(browser, profileName, contextOpts, delayMs) {
  const context = await browser.newContext(contextOpts);
  const consoleErrors = [];
  const pageErrors = [];
  const failed = [];
  const page = await context.newPage();
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  page.on('requestfailed', (r) => { if (!r.url().startsWith('data:')) failed.push(r.url() + ' ' + (r.failure() && r.failure().errorText)); });

  // Optionally delay the motion engine to simulate slow theme JS.
  if (delayMs > 0) {
    await page.route(MOTION_JS, async (route) => {
      await new Promise((r) => setTimeout(r, delayMs));
      await route.continue();
    });
  }

  await instrument(page);
  const t0 = Date.now();
  await page.goto(HARNESS, { waitUntil: 'load' });

  // wait until entrance released (gloeus-in) or 2s ceiling
  await page.waitForFunction(() => document.documentElement.classList.contains('gloeus-in'), null, { timeout: 3000 }).catch(() => {});
  const releaseMs = Date.now() - t0;

  // let transitions settle
  await page.waitForTimeout(900);

  const tag = delayMs ? `${profileName}+${delayMs}ms` : profileName;

  // A. console / pageerror / 404 sweep with full scroll
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += Math.floor(window.innerHeight * 0.5)) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 200));
  });
  log(tag, 'no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));
  log(tag, 'no page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));
  log(tag, 'no failed requests', failed.length === 0, failed.slice(0, 3).join(' | '));

  // B. entrance released
  log(tag, 'entrance released (gloeus-in)', await page.evaluate(() => document.documentElement.classList.contains('gloeus-in')), `${releaseMs}ms`);

  // C. all entrance elements visible (opacity >= 0.9)
  const hiddenEnter = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('.g-enter').forEach((el) => {
      if (parseFloat(getComputedStyle(el).opacity) < 0.9) bad.push(el.className);
    });
    return bad;
  });
  log(tag, 'all .g-enter visible', hiddenEnter.length === 0, hiddenEnter.slice(0, 3).join(' | '));

  // D. single-act — no same-element opacity re-runs beyond first
  const optrans = await page.evaluate(() => window.__optrans);
  const enterCount = await page.evaluate(() => document.querySelectorAll('.g-enter, .g-mask-i').length);
  // In the fallback (delayed) path the reveal may be instant (no transition) → optrans can be < count.
  // The guard we care about: optrans must NEVER exceed the element count (that would mean re-runs).
  log(tag, 'single-act (no re-runs)', optrans <= enterCount, `opacity-transitions=${optrans} elements=${enterCount}`);

  // E. stuck-reveal guard — scroll fully, nothing in viewport left < 0.9
  const stuck = await page.evaluate(async () => {
    const stuckEls = [];
    const step = Math.floor(window.innerHeight * 0.4);
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 160));
      document.querySelectorAll('.g-reveal, .g-enter').forEach((el) => {
        const r = el.getBoundingClientRect();
        const inView = r.top < window.innerHeight * 0.9 && r.bottom > window.innerHeight * 0.1;
        if (inView && parseFloat(getComputedStyle(el).opacity) < 0.9) {
          stuckEls.push(el.className.split(' ').slice(0, 2).join('.'));
        }
      });
    }
    return [...new Set(stuckEls)];
  });
  log(tag, 'stuck-reveal guard (0 stuck)', stuck.length === 0, stuck.slice(0, 4).join(' | '));

  // F. How-It-Works scrub sets --p within range + progress width grows
  const hiw = await page.evaluate(async () => {
    const sec = document.querySelector('.g-hiw');
    if (!sec) return { ok: false, why: 'no .g-hiw' };
    const top = sec.offsetTop;
    window.scrollTo(0, top + Math.floor(sec.offsetHeight * 0.5));
    await new Promise((r) => setTimeout(r, 200));
    const p = parseFloat(getComputedStyle(sec).getPropertyValue('--p')) || 0;
    const onDots = sec.querySelectorAll('.g-hiw-dot.on').length;
    return { ok: p > 0.2 && p < 0.9 && onDots >= 1, p, onDots };
  });
  log(tag, 'how-it-works scrub', hiw.ok, `--p=${hiw.p} activeDots=${hiw.onDots}`);

  // G. FAQ accordion toggles open (grid-rows animates height)
  const faq = await page.evaluate(async () => {
    const inner = document.querySelector('#faq .gloeus-faq__inner');
    const label = document.querySelector('#faq .gloeus-faq__q');
    if (!inner || !label) return { ok: false };
    const before = inner.getBoundingClientRect().height;
    label.click();
    await new Promise((r) => setTimeout(r, 450));
    const after = inner.getBoundingClientRect().height;
    return { ok: after > before + 4, before, after };
  });
  log(tag, 'FAQ accordion opens', faq.ok, `h ${Math.round(faq.before)}→${Math.round(faq.after)}`);

  // H. Sticky ATC reveals after anchor scrolled above, and add→real form
  const atc = await page.evaluate(async () => {
    window.__realAddClicked = false;
    const real = document.getElementById('realadd');
    if (real) real.addEventListener('click', (e) => { e.preventDefault(); window.__realAddClicked = true; });
    const anchor = document.getElementById('gloeus-atc-anchor');
    anchor.scrollIntoView(); window.scrollBy(0, 400);
    await new Promise((r) => setTimeout(r, 400));
    const bar = document.querySelector('.g-sticky-atc');
    const visible = bar.classList.contains('is-visible');
    const stickyAdd = document.querySelector('[data-sticky-add]');
    stickyAdd.click();
    await new Promise((r) => setTimeout(r, 100));
    return { visible, clicked: window.__realAddClicked };
  });
  log(tag, 'sticky ATC reveals', atc.visible);
  log(tag, 'sticky add → real form', atc.clicked);

  await context.close();
  return { consoleErrors, pageErrors, failed };
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const desktop = { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 };
  const iphone = { ...devices['iPhone 13'] };

  // Desktop: normal, +400ms, +1800ms
  await runProfile(browser, 'desktop', desktop, 0);
  await runProfile(browser, 'desktop', desktop, 400);
  await runProfile(browser, 'desktop', desktop, 1800);
  // iPhone touch: normal + delayed
  await runProfile(browser, 'iphone', iphone, 0);
  await runProfile(browser, 'iphone', iphone, 1800);
  // reduced motion (desktop)
  await runProfile(browser, 'reduced-motion', { ...desktop, reducedMotion: 'reduce' }, 0);

  await browser.close();

  const fails = results.filter((r) => !r.pass);
  console.log('\n================ SUMMARY ================');
  console.log(`total checks: ${results.length}  passed: ${results.length - fails.length}  failed: ${fails.length}`);
  if (fails.length) { console.log('FAILURES:'); fails.forEach((f) => console.log(`  [${f.profile}] ${f.name} — ${f.detail}`)); }
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error('RUNNER ERROR', e); process.exit(2); });
