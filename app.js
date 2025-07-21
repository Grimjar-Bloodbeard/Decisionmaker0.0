document.addEventListener("DOMContentLoaded", () => {
  // 0) New: grab the Copy-Link button
  const copyLinkBtn = document.getElementById("copyLinkBtn");

  // 1) Elements
  const setup     = document.getElementById("setup");
  const optionsIn = document.getElementById("optionsInput");
  const startBtn  = document.getElementById("startBtn");
  const clearBtn  = document.getElementById("clearBtn");
  const duelDiv   = document.getElementById("duel");
  const leftBtn   = document.getElementById("leftOpt");
  const rightBtn  = document.getElementById("rightOpt");
  const champDiv  = document.getElementById("champion");
  const champName = document.getElementById("champName");
  const redoBtn   = document.getElementById("redoBtn");

  let bracket = [], winners = [];

  // 0b) New: parse ?opts=… from URL
  function getOptsFromURL() {
    const params = new URLSearchParams(window.location.search);
    const raw    = params.get("opts");
    if (!raw) return null;
    return raw
      .split(/[\n,]+/)
      .map(o => decodeURIComponent(o.trim()))
      .filter(o => o);
  }
  // If we got shared options, prefill & auto-start
  const sharedOpts = getOptsFromURL();
  if (sharedOpts && sharedOpts.length > 1) {
    optionsIn.value = sharedOpts.join("\n");
    clearBtn.classList.remove("hidden");
    startBtn.click();              // fires your “Start duels” handler
  }

  // 2) Load persisted list
  const saved = JSON.parse(localStorage.getItem("duelOpts") || "[]");
  if (saved.length > 1) {
    optionsIn.value = saved.join("\n");
    clearBtn.classList.remove("hidden");
  }

  // 3) Clear storage
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("duelOpts");
    optionsIn.value = "";
    clearBtn.classList.add("hidden");
  });

  // 4) Start duels
  startBtn.addEventListener("click", () => {
    const opts = optionsIn.value
      .split(/[\n,]+/)
      .map(o => o.trim())
      .filter(o => o);

    if (opts.length < 2) {
      alert("Enter at least two items.");
      return;
    }

    // persist list
    localStorage.setItem("duelOpts", JSON.stringify(opts));
    clearBtn.classList.remove("hidden");

    // New: reveal Copy-Link
    copyLinkBtn.classList.remove("hidden");

    // initialize bracket
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
    if (!bracket.length) return showChampion(winners[0]);
    const [a, b] = bracket.shift();
    leftBtn.querySelector(".opt-label").textContent  = a;
    rightBtn.querySelector(".opt-label").textContent = b;
  }

  // 7) Handle picks
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

  // 8) Report to Google Sheets (via Apps Script)
  function reportResults(opts, picks, winner) {
    fetch(
      "https://script.google.com/macros/s/AKfycbzFMEIKkCQpDpmHVgXBvNGr1ZXEX0qec4BgONZWfa0u_gd7I4bSIsjtgvGauP2c4Qrs/exec",
      {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ options: opts, picks, winner })
      }
    );
  }

  // 9) Show champion & send data
  function showChampion(name) {
    duelDiv.classList.add("hidden");
    champName.textContent = name;
    champDiv.classList.remove("hidden");

    const opts = JSON.parse(localStorage.getItem("duelOpts") || "[]");
    reportResults(opts, winners, name);
  }

  // 10) Restart
  redoBtn.addEventListener("click", () => location.reload());

  // 11) New: Copy Link handler
  copyLinkBtn.addEventListener("click", () => {
    const opts  = JSON.parse(localStorage.getItem("duelOpts") || "[]");
    const param = opts.map(o => encodeURIComponent(o)).join(",");
    const url   = `${location.origin}${location.pathname}?opts=${param}`;

    navigator.clipboard.writeText(url)
      .then(() => alert("Link copied!"))
      .catch(() => prompt("Copy this link:", url));
  });

}); // end DOMContentLoaded
