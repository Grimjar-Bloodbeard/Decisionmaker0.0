// app.js – Decision Maker Logic

document.addEventListener("DOMContentLoaded", () => {
  // 1) Load or initialize data
  const defaults = {
    values: ["Freedom","Fun","Growth","Learning","Community"],
    contexts: {
      "Daily Pick": ["Modding","Watch Show","Walk","Read"]
    }
  };
  const data = JSON.parse(localStorage.getItem("decider")) || defaults;

  // 2) Populate the context dropdown
  const ctxSel = document.getElementById("contextSelect");
  Object.keys(data.contexts).forEach(ctx => {
    const opt = document.createElement("option");
    opt.value = ctx;
    opt.textContent = ctx;
    ctxSel.append(opt);
  });

  // 3) Disable Start until a context is chosen
  const startBtn = document.getElementById("startBtn");
  startBtn.disabled = true;
  ctxSel.addEventListener("change", () => {
    startBtn.disabled = !ctxSel.value;
  });

  console.log("🎉 app.js loaded, contexts:", Object.keys(data.contexts));
});
