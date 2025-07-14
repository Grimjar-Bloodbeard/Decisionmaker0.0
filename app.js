document.addEventListener("DOMContentLoaded", () => {
  // 1) Grab elements
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

  // 2) Start—parse input into an array
  startBtn.addEventListener("click", () => {
    const raw = optionsIn.value;
    console.log("Raw input:", raw);

    const opts = raw
      .split(/[\n,]+/)        // split on commas or newlines
      .map(o => o.trim())     // trim whitespace
      .filter(o => o);        // drop empty strings

    console.log("Parsed options:", opts);

    if (opts.length < 2) {
      alert("Enter at least two items to compare.");
      return;
    }

    bracket = buildPairs(shuffle(opts));
    setup.classList.add("hidden");
    duelDiv.classList.remove("hidden");
    nextDuel();
  });

  // 3) Shuffle & pair up
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

  // 4) Show next duel matchup
  function nextDuel() {
    if (bracket.length === 0) {
      // only one winner left
      return showChampion(winners[0]);
    }
    const [a, b] = bracket.shift();
    leftBtn.textContent  = a;
    rightBtn.textContent = b;
  }

  // 5) Handle each choice
  [leftBtn, rightBtn].forEach(btn => {
    btn.addEventListener("click", () => {
      console.log("Chose:", btn.textContent);
      winners.push(btn.textContent);

      // when current round is done but multiple winners—seed next round
      if (bracket.length === 0 && winners.length > 1) {
        bracket = buildPairs(shuffle(winners));
        winners = [];
      }

      nextDuel();
    });
  });

  // 6) Show the final champion
  function showChampion(name) {
    duelDiv.classList.add("hidden");
    champName.textContent = name;
    champDiv.classList.remove("hidden");
  }

  // 7) Restart
  redoBtn.addEventListener("click", () => location.reload());
});
