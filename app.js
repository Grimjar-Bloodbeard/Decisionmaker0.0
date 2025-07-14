document.addEventListener("DOMContentLoaded", () => {
  // 1) Grab elements
  const setup      = document.getElementById("setup");
  const optionsIn  = document.getElementById("optionsInput");
  const startBtn   = document.getElementById("startBtn");
  const clearBtn   = document.getElementById("clearBtn");     // NEW
  const duelDiv    = document.getElementById("duel");
  const leftBtn    = document.getElementById("leftOpt");
  const rightBtn   = document.getElementById("rightOpt");
  const champDiv   = document.getElementById("champion");
  const champName  = document.getElementById("champName");
  const redoBtn    = document.getElementById("redoBtn");

  let bracket = [], winners = [];

  // 2) Persistent state: load saved list, show Clear if exists
  const saved = JSON.parse(localStorage.getItem("duelOpts") || "[]");
  if (saved.length > 1) {
    optionsIn.value = saved.join("\n");
    clearBtn.classList.remove("hidden");
  }

  // 3) Clear stored list
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("duelOpts");
    optionsIn.value = "";
    clearBtn.classList.add("hidden");
  });

  // 4) Start duels: parse input, save, then kick off bracket
  startBtn.addEventListener("click", () => {
    const opts = optionsIn.value
      .split(/[\n,]+/)      // split on newlines or commas
      .map(o => o.trim())
      .filter(o => o);

    if (opts.length < 2) {
      alert("Enter at least two items.");
      return;
    }

    localStorage.setItem("duelOpts", JSON.stringify(opts));  // SAVE
    clearBtn.classList.remove("hidden");

    bracket = buildPairs(shuffle(opts));
    setup.classList.add("hidden");
    duelDiv.classList.remove("hidden");
    nextDuel();
  });

  // 5) Shuffle & pair builder
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

  // 6) Show next duel
  function nextDuel() {
    if (bracket.length === 0) {
      return showChampion(winners[0]);
    }
    const [a, b] = bracket.shift();

    // 6a) Update both image alt texts & labels
    leftBtn.querySelector(".opt-img").alt   = a;
    rightBtn.querySelector(".opt-img").alt  = b;
    leftBtn.querySelector(".opt-label").textContent  = a;
    rightBtn.querySelector(".opt-label").textContent = b;
  }

  // 7) Handle duels
  [leftBtn, rightBtn].forEach(btn => {
    btn.addEventListener("click", () => {
      winners.push(btn.querySelector(".opt-label").textContent);

      if (bracket.length === 0 && winners.length > 1) {
        bracket = buildPairs(shuffle(winners));
        winners = [];
      }

      nextDuel();
    });
  });

  // 8) Show champion
  function showChampion(name) {
    duelDiv.classList.add("hidden");
    champName.textContent = name;
    champDiv.classList.remove("hidden");
  }

  // 9) Start over
  redoBtn.addEventListener("click", () => location.reload());
});
