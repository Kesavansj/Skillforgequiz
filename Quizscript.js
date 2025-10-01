let score = 0, currentQ = 0, lives = 3, player = "", avatar = "";
const leaderboard = [];

// Avatar options
const maleAvatars = [
  "images/Male Avatar 1.png",
  "images/Male Avatar 2.png",
  "images/Male Avatar 3.png",
  "images/Male Avatar 4.png"
];
const femaleAvatars = [
  "images/Female Avatar 1.png",
  "images/Female Avatar 2.png",
  "images/Female Avatar 3.png",
  "images/Female Avatar 4.png"
];

function renderAvatars(avatars = []) {
  const container = document.getElementById('avatarContainer');
  container.innerHTML = '';
  avatars.forEach((src, idx) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Avatar ${idx+1}`;
    img.className = 'avatar-img';
    img.onclick = () => selectAvatar(idx, avatars);
    container.appendChild(img);
  });
}

let selectedAvatar = null;
function selectAvatar(idx, avatars) {
  selectedAvatar = avatars[idx];
  avatar = selectedAvatar;
  document.querySelectorAll('.avatar-img').forEach((img, i) => {
    img.style.border = i === idx ? '2px solid #007bff' : 'none';
  });
}

// Gender change listener
document.addEventListener('DOMContentLoaded', function() {
  const genderSelect = document.getElementById('gender');
  genderSelect.addEventListener('change', function() {
    if (this.value === 'male') renderAvatars(maleAvatars);
    else if (this.value === 'female') renderAvatars(femaleAvatars);
    else renderAvatars([]);
  });
  renderAvatars([]);
});

// Questions
const questions = [
  { q: "Which one best describes the Money Measurement Concept?", options: { A: "All transactions recorded", B: "Only money-measurable transactions recorded", C: "Only historic cost", D: "Must convert currency" }, correct: "B" },
  { q: "Revenue recognition for annual subscription ₹1,20,000?", options: { A: "All immediately", B: "₹10,000 monthly", C: "Capital contribution", D: "Loan" }, correct: "B" },
  { q: "₹16,000 wages for installing machine?", options: { A: "Expense", B: "Capitalised with machine", C: "Drawings", D: "Prepaid" }, correct: "B" },
  { q: "Periodic inventory system means?", options: { A: "Continuous update", B: "By physical count at intervals", C: "No physical count", D: "Capitalise purchases" }, correct: "B" },
  { q: "Provision vs contingent liability?", options: { A: "Provision recognised, contingent disclosed", B: "Reverse", C: "Same", D: "Provision always larger" }, correct: "A" },
  { q: "Which increases cash book balance?", options: { A: "Insurance premium", B: "Subsidy credited by bank", C: "Stale cheque", D: "Under-cast ₹350" }, correct: "B" },
  { q: "Closing inventory (gross profit method) value?", options: { A: "₹4,80,000", B: "₹5,25,000", C: "₹5,50,000", D: "₹6,00,000" }, correct: "B" },
  { q: "Depreciation @10% on ₹2,00,000?", options: { A: "₹10,000", B: "₹20,000", C: "₹25,000", D: "₹40,000" }, correct: "B" },
  { q: "Bonus issue 2 for 5 on 6,75,000 shares?", options: { A: "1,35,000", B: "2,70,000", C: "3,37,500", D: "6,75,000" }, correct: "B" },
  { q: "When recognise dividend income?", options: { A: "When received", B: "When declared", C: "Year-end", D: "Purchase date" }, correct: "B" },
  { q: "Kabir pays immediately?", options: { A: "₹2,000", B: "₹2,240", C: "₹8,000", D: "₹10,240" }, correct: "B" },
  { q: "P’s goodwill share absorbed by Q?", options: { A: "₹2,500", B: "₹5,000", C: "₹7,500", D: "₹10,000" }, correct: "A" },
];

// Hints
const hints = [
  "Only money transactions are recorded in accounts.",
  "Subscriptions spread across months, not all at once.",
  "Installation wages add to asset cost, not expense.",
  "Inventory updated by counting at intervals.",
  "Provision is recognised, contingent is disclosed.",
  "Bank subsidy increases cash balance.",
  "Use gross profit method for closing inventory.",
  "Depreciation = 10% of ₹2,00,000 = ₹20,000.",
  "Bonus issue = 2/5 × 6,75,000 = 2,70,000 shares.",
  "Dividend income when declared.",
  "Discounted immediate payment by Kabir.",
  "Q absorbs P’s share of goodwill = ₹2,500."
];

// Page handling
function showPage(id) {
  document.querySelectorAll(".page").forEach(p =>
    p.classList.remove("active", "bg1", "bg2", "bg3", "bg4", "bg5", "bg6", "bg7", "bg8", "bg9", "bg10", "bg11", "bg12")
  );
  document.getElementById(id).classList.add("active");
  document.getElementById("hud").classList.toggle("active", id === "quizPage");
}

// **Login validation**
function validateLogin() {
  const name = document.getElementById("playerName").value.trim();
  const email = document.getElementById("playerEmail").value.trim();
  const password = document.getElementById("playerPass").value.trim();
  const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|skillforge\.solutions)$/;
  const validPassword = "Skill@1Gan09";
  const namePattern = /^[A-Za-z]{3,}$/;

   if (!emailPattern.test(email)) {
    alert("Invalid email address");
    return;
  }
  if (password !== validPassword) {
    alert("Incorrect password");
    return;
  }

  if (!namePattern.test(name)) {
    alert("Name must be at least 3 alphabets");
    return;
  }
  if (!name || !avatar || !document.getElementById("gender").value) {
    alert("Fill all fields");
    return;
  }

  startQuiz();
}

// Start quiz
function startQuiz() {
  player = document.getElementById("playerName").value.trim();
  score = 0;
  currentQ = 0;
  lives = 3;
  totalTime = 20 * 60; // reset timer
  document.getElementById("hearts").innerHTML =
    "<i class='bx bxs-heart'></i><i class='bx bxs-heart'></i><i class='bx bxs-heart'></i>";

  showPage("quizPage");
  loadQuestion();
  startTimer();
}

// Progress chart
let ctx = document.getElementById("progressChart").getContext("2d");
let progressChart = new Chart(ctx, {
  type: "doughnut",
  data: { labels: ["Completed", "Remaining"], datasets: [{ data: [0, 100], backgroundColor: ["#00ffcc", "#444"] }] },
  options: { plugins: { legend: { display: false } }, cutout: "70%" }
});

// Load question
function loadQuestion() {
  if (currentQ >= questions.length) { endQuiz(); return; }

  const q = questions[currentQ];
  const qp = document.getElementById("quizPage");
  qp.className = "page active bg" + (currentQ + 1);

  document.getElementById("question-number").innerText = `Q ${currentQ + 1}/${questions.length}`;
  document.getElementById("question").innerText = q.q;

  const opt = document.getElementById("options");
  opt.innerHTML = "";
  for (let k in q.options) {
    let b = document.createElement("button");
    b.innerText = `${k}) ${q.options[k]}`;
    b.onclick = () => checkAnswer(b, k);
    opt.appendChild(b);
  }
  document.getElementById("explanation").style.display = "none";
  document.getElementById("explanation").innerText = "";

  // Add hint bulb
  if (document.getElementById("hintBtn")) {
    document.getElementById("hintBtn").remove();
  }
  addHintButton();

  let percent = Math.round((currentQ / questions.length) * 100);
  progressChart.data.datasets[0].data = [percent, 100 - percent];
  progressChart.update();
  document.getElementById("chartPercent").innerText = percent + "%";
}

// Check answer
function checkAnswer(btn, opt) {
  const q = questions[currentQ];
  if (opt === q.correct) { btn.classList.add("correct"); score++; } 
  else { btn.classList.add("wrong"); lives--; updateHearts(); }
  document.querySelectorAll("#options button").forEach(b => b.disabled = true);
}

// Previous question
function previousQ() {
  if (currentQ > 0) {
    currentQ--;
    loadQuestion();
  }
}

// Next question
function nextQ() {
  currentQ++;
  if (lives <= 0 || currentQ >= questions.length) { endQuiz(); return; }
  loadQuestion();
}

// Update hearts
function updateHearts() {
  document.getElementById("hearts").innerHTML =
    "<i class='bx bxs-heart'></i>".repeat(lives);
}

// End quiz
function endQuiz() {
  document.getElementById("finalScore").innerText = `${player}'s Score: ${score}`;
  let percent = Math.round((score / questions.length) * 100);
  let msg = percent >= 90 ? "Excellent! 🎉" : percent >= 70 ? "Great job! 👍" : percent >= 50 ? "Good effort! 🙂" : "Keep trying! 💪";
  document.getElementById("appreciation").innerText = msg;

  leaderboard.push({ player, score });
  leaderboard.sort((a,b)=>b.score-a.score);
  document.getElementById("leaderboard").innerHTML = leaderboard.map(l=>`<li>${l.player} - ${l.score}</li>`).join("");
  showPage("scorePage");
}

// =================== TIMER ===================
let totalTime = 20 * 60;
let timerInterval;

function startTimer() {
  const old = document.getElementById("timer");
  if (old) old.remove();

  const timerDiv = document.createElement("div");
  timerDiv.id = "timer";
  timerDiv.style.marginTop = "10px";
  timerDiv.style.fontWeight = "bold";
  document.getElementById("hud").appendChild(timerDiv);

  function updateTimer() {
    let min = Math.floor(totalTime / 60);
    let sec = totalTime % 60;
    timerDiv.innerText = `Time Left: ${min}:${sec < 10 ? "0" : ""}${sec}`;
    if (totalTime <= 0) {
      clearInterval(timerInterval);
      endQuiz();
    }
    totalTime--;
  }
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

// =================== HINTS ===================
let hintTimer = null;

function addHintButton() {
  // Remove any existing hint button
  const oldBtn = document.getElementById("hintBtn");
  if (oldBtn) oldBtn.remove();

  const exp = document.getElementById("explanation");
  exp.style.display = "none";
  exp.innerText = "";

  // Create bulb icon button
  let bulb = document.createElement("button");
  bulb.id = "hintBtn";
  bulb.className = "icon-btn";
  bulb.title = "Show Hint";
  bulb.innerHTML = "<i class='bx bx-bulb'></i>";

  // Show hint on click
  bulb.onclick = () => {
    exp.style.display = "block";
    exp.innerText = hints[currentQ];
    bulb.classList.remove("glow");
    if (hintTimer) clearTimeout(hintTimer);
  };

  // Insert at the top of quizPage
  const quizPage = document.getElementById("quizPage");
  quizPage.insertBefore(bulb, quizPage.firstChild);

  // Start 1-minute timer for auto-glow and auto-hint
  if (hintTimer) clearTimeout(hintTimer);
  hintTimer = setTimeout(() => {
    bulb.classList.add("glow");
    exp.style.display = "block";
    exp.innerText = hints[currentQ];
  }, 60000);
}

// =================== VIEW ALL QUESTIONS ===================

function viewAllQuestions() {
  let page = document.createElement("div");
  page.id = "allQPage";
  page.className = "page active";

  let html = `<h2>All Questions</h2><div class="all-questions-list">`;

  questions.forEach((q, i) => {
    html += `
      <div class="question-block">
        <h3>Q${i + 1}: ${q.q}</h3>
        <button class="btn jumpBtn" data-index="${i}">Go to this Question</button>
      </div>
    `;
  });

  html += `</div><button class="btn" id="backBtn">Back</button>`;
  page.innerHTML = html;

  // Jump buttons
  page.querySelectorAll(".jumpBtn").forEach(btn => {
    btn.onclick = () => {
      currentQ = parseInt(btn.dataset.index);
      page.remove();
      showPage("quizPage");
      loadQuestion();
    };
  });

  // Back
  page.querySelector("#backBtn").onclick = () => {
    page.remove();
    showPage("quizPage");
  };

  document.body.appendChild(page);
}


// Add "View All Questions" button in quiz HUD
document.addEventListener("DOMContentLoaded", () => {
  let btn = document.createElement("button");
  btn.className = "btn";
  btn.innerText = "View All Questions";
  btn.onclick = viewAllQuestions;
  document.getElementById("hud").appendChild(btn);
});
