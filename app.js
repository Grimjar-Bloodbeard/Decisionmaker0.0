document.addEventListener("DOMContentLoaded", () => {
  // 1) Grab all your elements AFTER the DOM is ready
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

  // 2) Now your click handler will actually find startBtn
  startBtn.addEventListener("click", () => {
    console.log("👆 Start clicked"); // sanity check
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

  // … rest of your functions exactly as before …
  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
  function buildPairs(arr) { /* … */ }
  function nextDuel() { /* … */ }
  function showChampion(name) { /* … */ }

  [leftBtn, rightBtn].forEach(btn => {
    btn.addEventListener("click", () => { /* … */ });
  });

  redoBtn.addEventListener("click", () => location.reload());
});
