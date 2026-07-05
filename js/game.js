/* ============================================
   MEET THE SICKOS — game.js
   "Don't Get Caught" — click Stanley & Patricia
   ============================================ */

const GAME_QUOTES = [
  "We have neighbors.",
  "Happy wife, happy life.",
  "You never know when someone wants to erase their debt.",
  "I gotta do some good before I go to sleep tonight.",
  "The spirits told me you'd return.",
  "Superstition, I guess.",
  "Pure poetry right there.",
  "That is the dumbest thing I've ever heard.",
  "If one more person kicks me in the fucking face.",
  "There won't be a next time.",
  "Somebody been studying, I see.",
  "It's nothing better than a good old-fashioned newspaper.",
];

// Characters
const CHARACTERS = [
  { id: 'stanley', label: 'Stanley', color: '#8b0000', points: 10, emoji: '🎭' },
  { id: 'patricia', label: 'Patricia', color: '#5a0020', points: 15, emoji: '🔪' },
];

// Game state
let state = {
  running: false,
  score: 0,
  level: 1,
  timeLeft: 30,
  targets: [],
  timerInterval: null,
  spawnInterval: null,
  quoteInterval: null,
  hiScore: 0,
  hiLevel: 1,
};

// Load hi scores from localStorage
function loadHi() {
  try {
    state.hiScore = parseInt(localStorage.getItem('mts_hi_score') || '0', 10);
    state.hiLevel = parseInt(localStorage.getItem('mts_hi_level') || '1', 10);
  } catch(e) {}
  document.getElementById('hiScore').textContent = state.hiScore;
  document.getElementById('hiLevel').textContent = state.hiLevel;
}

function saveHi() {
  try {
    if (state.score > state.hiScore) {
      localStorage.setItem('mts_hi_score', state.score);
      state.hiScore = state.score;
    }
    if (state.level > state.hiLevel) {
      localStorage.setItem('mts_hi_level', state.level);
      state.hiLevel = state.level;
    }
  } catch(e) {}
}

// DOM refs
const introEl    = () => document.getElementById('gameIntro');
const screenEl   = () => document.getElementById('gameScreen');
const overEl     = () => document.getElementById('gameOver');
const arenaEl    = () => document.getElementById('gameArena');
const scoreEl    = () => document.getElementById('score');
const levelEl    = () => document.getElementById('level');
const timerEl    = () => document.getElementById('timer');
const quoteEl    = () => document.getElementById('gameQuote');

function showScreen(name) {
  ['gameIntro', 'gameScreen', 'gameOver'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === name ? 'flex' : 'none';
  });
}

// ---- SPAWN TARGET ----
function spawnTarget() {
  const arena = arenaEl();
  if (!arena || !state.running) return;

  const bounds = arena.getBoundingClientRect();
  const char   = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  const size   = Math.max(40, 72 - state.level * 4); // shrinks with level

  // Avoid edges
  const maxX = 100 - (size / bounds.width * 100) - 4;
  const maxY = 100 - (size / bounds.height * 100) - 4;
  const x = 4 + Math.random() * maxX;
  const y = 4 + Math.random() * maxY;

  const btn = document.createElement('button');
  btn.className = 'target-btn';
  btn.setAttribute('aria-label', `Click ${char.label}`);
  btn.style.cssText = `
    left: ${x}%;
    top: ${y}%;
    width: ${size}px;
    height: ${size}px;
    font-size: ${size * 0.5}px;
    border-color: ${char.color};
  `;
  btn.innerHTML = `<span>${char.emoji}</span><span class="target-name">${char.label}</span>`;

  // Disappear after window — shorter at higher levels
  const lifespan = Math.max(600, 1800 - state.level * 120);
  const disappear = setTimeout(() => {
    if (btn.parentNode) {
      btn.classList.add('target-miss');
      setTimeout(() => btn.remove(), 250);
    }
  }, lifespan);

  btn.addEventListener('click', () => {
    clearTimeout(disappear);
    if (!state.running) return;
    state.score += char.points * state.level;
    scoreEl().textContent = state.score;
    btn.classList.add('target-hit');

    // Brief quote flash
    const q = GAME_QUOTES[Math.floor(Math.random() * GAME_QUOTES.length)];
    quoteEl().textContent = `\u201c${q}\u201d`;
    clearTimeout(btn._quoteTimer);
    btn._quoteTimer = setTimeout(() => { quoteEl().textContent = '\u00a0'; }, 2000);

    setTimeout(() => btn.remove(), 200);

    // Level up every 100 points
    const newLevel = Math.floor(state.score / 100) + 1;
    if (newLevel > state.level) {
      state.level = newLevel;
      levelEl().textContent = state.level;
      resetSpawnInterval();
    }
  });

  arena.appendChild(btn);
}

function resetSpawnInterval() {
  clearInterval(state.spawnInterval);
  const rate = Math.max(350, 1200 - state.level * 80);
  state.spawnInterval = setInterval(spawnTarget, rate);
}

// ---- TIMER ----
function startTimer() {
  state.timeLeft = 30;
  timerEl().textContent = state.timeLeft;

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    timerEl().textContent = state.timeLeft;

    if (state.timeLeft <= 5) {
      timerEl().classList.add('timer-danger');
    }

    if (state.timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// ---- START ----
function startGame() {
  state.running  = true;
  state.score    = 0;
  state.level    = 1;

  scoreEl().textContent = '0';
  levelEl().textContent = '1';
  timerEl().classList.remove('timer-danger');

  // Clear arena
  const arena = arenaEl();
  Array.from(arena.querySelectorAll('.target-btn')).forEach(b => b.remove());

  showScreen('gameScreen');
  startTimer();
  resetSpawnInterval();
}

// ---- END ----
function endGame() {
  state.running = false;
  clearInterval(state.timerInterval);
  clearInterval(state.spawnInterval);
  saveHi();

  const isNewHi = state.score >= state.hiScore && state.score > 0;

  document.getElementById('finalScore').textContent = state.score;
  document.getElementById('finalLevel').textContent = state.level;
  document.getElementById('finalHi').textContent    = state.hiScore;
  document.getElementById('goEyebrow').textContent  = isNewHi ? 'New Best Score' : 'Game Over';
  document.getElementById('goTitle').textContent    = isNewHi ? "They didn't catch you." : "They Got You.";
  document.getElementById('goSub').textContent      = isNewHi
    ? 'You made it out. For now.'
    : 'Not everyone makes it out.';

  showScreen('gameOver');
}

// ---- WIRING ----
document.addEventListener('DOMContentLoaded', () => {
  loadHi();
  showScreen('gameIntro');

  document.getElementById('startBtn')?.addEventListener('click', startGame);
  document.getElementById('playAgainBtn')?.addEventListener('click', startGame);
});
