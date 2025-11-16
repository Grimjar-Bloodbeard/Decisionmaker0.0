import { getAllPersonalities, getPersonality } from './personalities.js';
import { applyTheme, getRandomPreset } from './themes.js';

// ========== STATE ==========
let currentPersonality = null;
let bracket = [];
let winners = [];
let roundNumber = 1;
let totalRounds = 0;

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", () => {
  initPersonalitySelect();
  initSetupScreen();
  initDuelScreen();
  initChampionScreen();
});

// ========== PERSONALITY SELECTION ==========
function initPersonalitySelect() {
  const grid = document.getElementById('personalityGrid');
  const personalities = getAllPersonalities();

  personalities.forEach(p => {
    const card = document.createElement('div');
    card.className = 'personality-card';
    card.innerHTML = `
      <div class="personality-icon">${p.icon}</div>
      <div class="personality-name">${p.name}</div>
      <div class="personality-desc">${p.description}</div>
    `;
    card.addEventListener('click', () => selectPersonality(p.id));
    grid.appendChild(card);
  });

  document.getElementById('randomVibeBtn').addEventListener('click', () => {
    const randomP = personalities[Math.floor(Math.random() * personalities.length)];
    selectPersonality(randomP.id);
  });
}

function selectPersonality(personalityId) {
  currentPersonality = getPersonality(personalityId);

  // Apply personality theme
  applyTheme(currentPersonality.theme);

  // Add personality-specific body class for CSS styling
  document.body.className = `personality-${personalityId}`;

  // Show setup screen
  document.getElementById('personalitySelect').classList.add('hidden');
  document.getElementById('setup').classList.remove('hidden');

  // Update badge
  const badge = document.getElementById('selectedPersonalityBadge');
  badge.textContent = `${currentPersonality.icon} ${currentPersonality.name} Mode`;
  badge.style.background = currentPersonality.theme.gradient;

  // Load saved options if exist
  loadSavedOptions();
}

// ========== SETUP SCREEN ==========
function initSetupScreen() {
  const startBtn = document.getElementById('startBtn');
  const clearBtn = document.getElementById('clearBtn');
  const changePersonalityBtn = document.getElementById('changePersonalityBtn');
  const optionsIn = document.getElementById('optionsInput');

  startBtn.addEventListener('click', startDuels);
  clearBtn.addEventListener('click', clearSaved);
  changePersonalityBtn.addEventListener('click', () => {
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('personalitySelect').classList.remove('hidden');
  });

  // Auto-save on input
  optionsIn.addEventListener('input', () => {
    const opts = parseOptions(optionsIn.value);
    if (opts.length > 0) {
      localStorage.setItem('duelOpts', JSON.stringify(opts));
      clearBtn.classList.remove('hidden');
    }
  });
}

function loadSavedOptions() {
  const saved = JSON.parse(localStorage.getItem("duelOpts") || "[]");
  const optionsIn = document.getElementById('optionsInput');

  if (saved.length > 1) {
    optionsIn.value = saved.join("\n");
    document.getElementById('clearBtn').classList.remove('hidden');
  }

  // Check for shared URL options
  const sharedOpts = getOptsFromURL();
  if (sharedOpts && sharedOpts.length > 1) {
    optionsIn.value = sharedOpts.join("\n");
    document.getElementById('clearBtn').classList.remove('hidden');
  }
}

function clearSaved() {
  localStorage.removeItem("duelOpts");
  document.getElementById('optionsInput').value = "";
  document.getElementById('clearBtn').classList.add('hidden');
}

function startDuels() {
  const opts = parseOptions(document.getElementById('optionsInput').value);

  if (opts.length < 2) {
    alert("Enter at least two options to compare!");
    return;
  }

  // Save options
  localStorage.setItem("duelOpts", JSON.stringify(opts));

  // Initialize bracket
  bracket = buildPairs(shuffle(opts));
  winners = [];
  roundNumber = 1;
  totalRounds = Math.ceil(Math.log2(opts.length));

  // Show duel screen
  document.getElementById('setup').classList.add('hidden');
  document.getElementById('duel').classList.remove('hidden');

  nextDuel();
}

// ========== DUEL SCREEN ==========
function initDuelScreen() {
  const leftBtn = document.getElementById('leftOpt');
  const rightBtn = document.getElementById('rightOpt');

  [leftBtn, rightBtn].forEach(btn => {
    btn.addEventListener('click', () => handleChoice(btn));
  });
}

async function nextDuel() {
  if (!bracket.length) {
    if (winners.length === 1) {
      return showChampion(winners[0]);
    }
    // Next round
    bracket = buildPairs(shuffle(winners));
    winners = [];
    roundNumber++;
  }

  const [a, b] = bracket.shift();
  document.getElementById('leftOpt').querySelector('.opt-label').textContent = a;
  document.getElementById('rightOpt').querySelector('.opt-label').textContent = b;

  // Update round indicator
  document.getElementById('roundIndicator').textContent = `Round ${roundNumber}`;

  // Load AI commentary
  await loadCommentary(a, b);
}

async function loadCommentary(optionA, optionB) {
  const commentaryDiv = document.getElementById("aiCommentary");

  // Show loading
  commentaryDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';

  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        optionA,
        optionB,
        personality: currentPersonality.id
      })
    });
    const data = await response.json();
    commentaryDiv.textContent = data.commentary || "Make your choice!";
  } catch (err) {
    console.error("Failed to load commentary:", err);
    commentaryDiv.textContent = `${optionA} vs ${optionB} - What's your pick?`;
  }
}

function handleChoice(btn) {
  const choice = btn.querySelector('.opt-label').textContent;
  winners.push(choice);

  // Add selection animation
  btn.classList.add('selected');
  setTimeout(() => {
    btn.classList.remove('selected');
    nextDuel();
  }, 400);
}

// ========== CHAMPION SCREEN ==========
function initChampionScreen() {
  document.getElementById('redoBtn').addEventListener('click', () => location.reload());
  document.getElementById('copyLinkBtn').addEventListener('click', copyShareLink);
  document.getElementById('shareBtn').addEventListener('click', generateShareImage);
}

function showChampion(name) {
  document.getElementById('duel').classList.add('hidden');
  document.getElementById('champName').textContent = name;

  // Add stats
  const opts = JSON.parse(localStorage.getItem("duelOpts") || "[]");
  const statsDiv = document.getElementById('champStats');
  statsDiv.innerHTML = `
    <div class="stat">Defeated ${opts.length - 1} contenders</div>
    <div class="stat">Survived ${totalRounds} rounds</div>
    <div class="stat">AI Mode: ${currentPersonality.icon} ${currentPersonality.name}</div>
  `;

  document.getElementById('champion').classList.remove('hidden');

  // Report results
  reportResults(opts, winners, name);
}

function copyShareLink() {
  const opts = JSON.parse(localStorage.getItem("duelOpts") || "[]");
  const param = opts.map(o => encodeURIComponent(o)).join(",");
  const url = `${location.origin}${location.pathname}?opts=${param}`;

  navigator.clipboard.writeText(url)
    .then(() => alert("✅ Shareable link copied!"))
    .catch(() => prompt("Copy this link:", url));
}

function generateShareImage() {
  const canvas = document.getElementById('shareCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 600;

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, 800, 600);
  gradient.addColorStop(0, currentPersonality.theme.primary);
  gradient.addColorStop(1, currentPersonality.theme.accent);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 600);

  // Draw text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🏆 WINNER 🏆', 400, 150);

  ctx.font = 'bold 64px Arial';
  const winner = document.getElementById('champName').textContent;
  ctx.fillText(winner, 400, 280);

  ctx.font = '32px Arial';
  ctx.fillText(`${currentPersonality.icon} ${currentPersonality.name} Mode`, 400, 380);

  ctx.font = '24px Arial';
  ctx.fillText('Deciduel - Make Decisions with AI', 400, 520);

  // Download image
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deciduel-winner.png';
    a.click();
    URL.revokeObjectURL(url);
    alert('📸 Image saved! Share it on social media!');
  });
}

// ========== UTILITIES ==========
function parseOptions(text) {
  return text
    .split(/[\n,]+/)
    .map(o => o.trim())
    .filter(o => o);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// Generate creative alternative when there's a duplicate
function generateAlternative(item) {
  const alternatives = {
    // Food
    'pizza': 'Calzone',
    'taco': 'Burrito', 'tacos': 'Burritos',
    'burger': 'Sandwich', 'burgers': 'Sandwiches',
    'coffee': 'Tea',
    'sushi': 'Sashimi',
    'pasta': 'Risotto',
    'chicken': 'Turkey',
    'beer': 'Wine',
    'ice cream': 'Frozen Yogurt',
    'chocolate': 'Vanilla',

    // Entertainment
    'movie': 'TV Show', 'movies': 'TV Shows',
    'game': 'DLC', 'games': 'DLC',
    'book': 'Audiobook', 'books': 'Audiobooks',
    'netflix': 'Hulu',
    'spotify': 'Apple Music',

    // Activities
    'gym': 'Home Workout',
    'run': 'Walk', 'running': 'Walking',
    'sleep': 'Nap',
    'study': 'Procrastinate',
    'work': 'Side Hustle',
  };

  const lowerItem = item.toLowerCase();

  // Check for exact match
  if (alternatives[lowerItem]) {
    return alternatives[lowerItem];
  }

  // Check if item contains any key
  for (const [key, value] of Object.entries(alternatives)) {
    if (lowerItem.includes(key)) {
      return value;
    }
  }

  // Generic creative alternatives
  const generic = [
    `Better ${item}`,
    `${item} 2.0`,
    `${item} (but cooler)`,
    `${item}'s rival`,
    `Not ${item}`,
    `${item} Pro Max`,
  ];

  return generic[Math.floor(Math.random() * generic.length)];
}

function buildPairs(arr) {
  const pairs = [];
  for (let i = 0; i < arr.length; i += 2) {
    const pair = arr.slice(i, i + 2);

    if (pair.length === 2) {
      // Check if it's a self-match (same item twice)
      if (pair[0] === pair[1]) {
        const alternative = generateAlternative(pair[0]);
        pairs.push([pair[0], alternative]);
      } else {
        pairs.push(pair);
      }
    } else {
      // Odd number of items - create alternative for the solo item
      const alternative = generateAlternative(pair[0]);
      pairs.push([pair[0], alternative]);
    }
  }
  return pairs;
}

function getOptsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("opts");
  if (!raw) return null;
  return raw
    .split(/[\n,]+/)
    .map(o => decodeURIComponent(o.trim()))
    .filter(o => o);
}

function reportResults(opts, picks, winner) {
  fetch(
    "https://script.google.com/macros/s/AKfycbzFMEIKkCQpDpmHVgXBvNGr1ZXEX0qec4BgONZWfa0u_gd7I4bSIsjtgvGauP2c4Qrs/exec",
    {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        options: opts,
        picks,
        winner,
        personality: currentPersonality.id,
        timestamp: new Date().toISOString()
      })
    }
  );
}
