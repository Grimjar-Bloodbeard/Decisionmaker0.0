// app.js – Decision Maker Logic

document.addEventListener("DOMContentLoaded", () => {
  // 1) Load or initialize data
  const defaults = {
    values: ["Freedom", "Fun", "Growth", "Learning", "Community"],
    contexts: {
      "Daily Pick": ["Modding", "Watch Show", "Walk", "Read"]
    }
  };
  const data = JSON.parse(localStorage.getItem("decider")) || defaults;
  const values = data.values;

  // 2) Grab UI elements
  const ctxSel   = document.getElementById("contextSelect");
  const startBtn = document.getElementById("startBtn");
  const scoring  = document.getElementById("scoring");
  const optName  = document.getElementById("optName");
  const sliders  = document.getElementById("sliders");
  const nextBtn  = document.getElementById("nextBtn");
  const results  = document.getElementById("results");
  const resTable = document.getElementById("resTable");
  const redoBtn  = document.getElementById("redoBtn");

  // 3) Populate the context dropdown
  Object.keys(data.contexts).forEach(ctx => {
    const opt = document.createElement("option");
    opt.value = ctx;
    opt.textContent = ctx;
    ctxSel.append(opt);
  });

  // 4) Disable Start until a context is chosen
  startBtn.disabled = true;
  ctxSel.addEventListener("change", () => {
    startBtn.disabled = !ctxSel.value;
  });

  // 5) Handle Start click: lock UI & show first slider set
  let options = [], scores = [], idx = 0;
  startBtn.addEventListener("click", () => {
    options = data.contexts[ctxSel.value];
    ctxSel.disabled   = true;
    startBtn.disabled = true;
    scoring.classList.remove("hidden");
    renderSlider();
  });

  // Renders sliders for the current option
  function renderSlider() {
    const option = options[idx];
    optName.textContent = option;
    sliders.innerHTML   = "";

    values.forEach(val => {
      const row = document.createElement("div");
      row.className = "slider-row";
      row.innerHTML = `
        <label>${val}</label>
        <input type="range" min="0" max="10" value="5" data-val="${val}">
        <span>5</span>
      `;
      const range = row.querySelector("input");
      const span  = row.querySelector("span");

      range.addEventListener("input", () => {
        span.textContent = range.value;
      });

      sliders.append(row);
    });
  }

  // 6) Handle Next click: save scores or show results
  nextBtn.addEventListener("click", () => {
    // Collect weights for this option
    const entry = { opt: options[idx], weights: {} };
    sliders.querySelectorAll("input").forEach(input => {
      entry.weights[input.dataset.val] = Number(input.value);
    });
    scores.push(entry);

    idx++;
    if (idx < options.length) {
      renderSlider();
    } else {
      showResults();
    }
  });

  // 7) Build and display results table
  function showResults() {
    scoring.classList.add("hidden");
    results.classList.remove("hidden");

    // Table header
    resTable.innerHTML = "";
    const header = document.createElement("tr");
    header.innerHTML = "<th>Option</th>" +
      values.map(v => `<th>${v}</th>`).join("") +
      "<th>Total</th>";
    resTable.append(header);

    // Table rows
    scores.forEach(entry => {
      const total = values.reduce((sum, v) => sum + entry.weights[v], 0);
      const row = document.createElement("tr");
      row.innerHTML = `<td>${entry.opt}</td>` +
        values.map(v => `<td>${entry.weights[v]}</td>`).join("") +
        `<td>${total}</td>`;
      resTable.append(row);
    });
  }

  // 8) Reset on Redo
  redoBtn.addEventListener("click", () => {
    location.reload();
  });

  console.log("🎉 Decision Maker ready!");
});
