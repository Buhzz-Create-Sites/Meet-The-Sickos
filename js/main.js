/* ============================================
   MEET THE SICKOS — main.js
   Quotes · Countdowns · Mobile nav
   ============================================ */

// --- QUOTES OF THE DAY ---
// Spoiler-free. Add more here as needed.
const QUOTES = [
  { text: "Happy wife, happy life.",                                          attr: "— Stanley" },
  { text: "We have neighbors.",                                               attr: "— Patricia" },
  { text: "I don't need your word when I got your balls.",                    attr: "— Antonio Silvi" },
  { text: "Sometimes you get good peaches, sometimes you get bad ones.",      attr: "— Detective Lock" },
  { text: "If one more person kicks me in the fucking face.",                 attr: "— Stanley" },
  { text: "There won't be a next time, Dennis.",                              attr: "— Mother Aisha" },
  { text: "You never know when someone wants to come in and erase their debt.", attr: "— Antonio Silvi" },
  { text: "I gotta do some good before I go to sleep tonight.",               attr: "— Detective Miller" },
  { text: "The spirits told me you'd return.",                                attr: "— Mother Aisha" },
  { text: "Superstition, I guess.",                                           attr: "— Dennis" },
  { text: "Pure poetry right there.",                                         attr: "— Detective Lock" },
  { text: "That is the dumbest thing I've ever heard.",                       attr: "— Detective Miller" },
  { text: "Somebody been studying, I see.",                                   attr: "— Ray" },
  { text: "It's nothing better than a good old-fashioned newspaper.",         attr: "— Stanley" },
];

function setQuote() {
  const el = document.getElementById('quoteText');
  const at = document.getElementById('quoteAttr');
  if (!el || !at) return;

  // Changes once per day, same quote for all visitors that day
  const dayIndex = Math.floor(Date.now() / 86400000) % QUOTES.length;
  const q = QUOTES[dayIndex];

  el.textContent = '\u201c' + q.text + '\u201d';
  at.textContent = q.attr;
}

// --- COUNTDOWN --- 
function pad(n) { return String(Math.floor(n)).padStart(2, '0'); }

function startCountdown(target, ids) {
  const { d, h, m, s } = ids;
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      [d, h, m, s].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }
    const days  = diff / 86400000;
    const hours = (diff % 86400000) / 3600000;
    const mins  = (diff % 3600000) / 60000;
    const secs  = (diff % 60000) / 1000;

    const dEl = document.getElementById(d);
    const hEl = document.getElementById(h);
    const mEl = document.getElementById(m);
    const sEl = document.getElementById(s);

    if (dEl) dEl.textContent = pad(days);
    if (hEl) hEl.textContent = pad(hours);
    if (mEl) mEl.textContent = pad(mins);
    if (sEl) sEl.textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);
}

// --- SCREENING DATES ---
// UPDATE THESE when venue and exact dates are confirmed
const AUG_SCREENING     = new Date('2026-08-15T20:00:00');
const HALLOWEEN_SCREENING = new Date('2026-10-24T20:00:00');

// --- MOBILE NAV ---
function initMobileNav() {
  const burger = document.querySelector('.nav-burger');
  const menu   = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    });
  });
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
  setQuote();

  startCountdown(AUG_SCREENING, {
    d: 'a-d', h: 'a-h', m: 'a-m', s: 'a-s'
  });

  startCountdown(HALLOWEEN_SCREENING, {
    d: 'h-d', h: 'h-h', m: 'h-m', s: 'h-s'
  });

  initMobileNav();
});
