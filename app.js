// 1) Populate the context <select>
const data = JSON.parse(localStorage.getItem("decider")) || {
  values: ["Freedom","Fun","Growth","Learning","Community"],
  contexts: { "Daily Pick": ["Modding","Watch Show","Walk","Read"] }
};

const ctxSel = document.getElementById("contextSelect");
Object.keys(data.contexts).forEach(ctx => {
  const opt = document.createElement("option");
  opt.value = ctx;
  opt.textContent = ctx;
  ctxSel.append(opt);
});

// 2) Disable Start until a context is chosen
const startBtn = document.getElementById("startBtn");
startBtn.disabled = true;
ctxSel.onchange = () => {
  startBtn.disabled = !ctxSel.value;
};

console.log("Contexts loaded:", Object.keys(data.contexts));
