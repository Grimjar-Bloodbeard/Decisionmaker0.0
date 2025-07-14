document.addEventListener("DOMContentLoaded", () => {
  // 1) Elements
  const setup      = document.getElementById("setup");
  const optionsIn  = document.getElementById("optionsInput");
  const startBtn   = document.getElementById("startBtn");
  const duelDiv    = document.getElementById("duel");
  const leftBtn    = document.getElementById("leftOpt");
  const rightBtn   = document.getElementById("rightOpt");
  const champDiv   = document.getElementById("champion");
  const champName  = document.getElementById("champName");
  const redoBtn    = document.getElementById("redoBtn");

  let bracket = [], winners = [];

  // 2) Start comparison
  startBtn.addEventListener("click", () => {
    // split on commas or newlines
    const opts = optionsIn.value
      .split(/[\n,]+/)
      .map(o => o.trim())
      .filter(o => o);

    if (opts.length < 2) {
      alert("Enter at least two items to compare.");
      return;
    }

    bracket = buildPairs(shuffle(opts));
    setup.classList.add("hidden");
    duelDiv.classList.remove("hidden");
    nextDuel();
  });

  // 3) Shuffle & pair builder
  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
  function buildPairs(arr) {
    const pairs = [];
    for (let i = 0; i < arr.length; i += 2) {
      const pair = arr.slice(i, i + 2);
      // if odd, auto-advance the last one
      pairs.push(pair.length === 2 ? pair : [pair[0], pair[0]]);
    }
    return pairs;
  }

  // 4) Show next duel
  function nextDuel() {
    if (bracket.length === 0) {
      // finalize: only one winner remains
      showChampion(winners[0]);
      return;
    }
    const [a, b] = bracket.shift();
    leftBtn.textContent  = a;
    rightBtn.textContent = b;
  }

  // 5) Handle duels
  [leftBtn, rightBtn].forEach(btn => {
    btn.addEventListener("click", () => {
      winners.push(btn.textContent);

      if (bracket.length === 0 && winners.length > 1) {
        // build next round
        bracket = buildPairs(shuffle(winners));
        winners = [];
      }

      nextDuel();
    });
  });

  // 6) Show champion and allow restart
  function showChampion(name) {
    duelDiv.classList.add("hidden");
    champName.textContent = name;
    champDiv.classList.remove("hidden");
  }
  redoBtn.addEventListener("click", () => location.reload());
});
