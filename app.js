const setup     = document.getElementById("setup");
const optionsIn = document.getElementById("optionsInput");
const startBtn  = document.getElementById("startBtn");
const duelDiv   = document.getElementById("duel");
const leftBtn   = document.getElementById("leftOpt");
const rightBtn  = document.getElementById("rightOpt");
const champDiv  = document.getElementById("champion");
const champName = document.getElementById("champName");
const redoBtn   = document.getElementById("redoBtn");

let bracket = [], winners = [], currentPair;

startBtn.addEventListener("click", () => {
  const opts = optionsIn.value
    .split("\n")
    .map(o => o.trim())
    .filter(o => o);
  if (opts.length < 2) {
    alert("Enter at least 2 options.");
    return;
  }
  bracket = buildPairs(shuffle(opts));
  setup.classList.add("hidden");
  duelDiv.classList.remove("hidden");
  nextDuel();
});

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
function buildPairs(arr) {
  const pairs = [];
  for (let i = 0; i < arr.length; i += 2) {
    const pair = arr.slice(i, i + 2);
    pairs.push(pair.length === 2 ? pair : [pair[0], pair[0]]);
  }
  return pairs;
}

function nextDuel() {
  if (!bracket.length) return showChampion(winners[0]);
  currentPair = bracket.shift();
  leftBtn.textContent  = currentPair[0];
  rightBtn.textContent = currentPair[1];
}

[leftBtn, rightBtn].forEach(btn => {
  btn.addEventListener("click", () => {
    winners.push(btn.textContent);
    if (bracket.length === 0 && winners.length === 1) {
      duelDiv.classList.add("hidden");
      showChampion(winners[0]);
    } else if (bracket.length === 0) {
      bracket = buildPairs(shuffle(winners));
      winners = [];
      nextDuel();
    } else {
      nextDuel();
    }
  });
});

function showChampion(name) {
  champName.textContent = name;
  champDiv.classList.remove("hidden");
}

redoBtn.addEventListener("click", () => location.reload());
