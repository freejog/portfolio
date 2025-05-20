const primes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
  31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97
];

let currentIndex = 0;
let correctCount = 0;
let startTime = null;
let timerInterval = null;

function startGame() {
  currentIndex = 0;
  correctCount = 0;
  document.getElementById("feedback").textContent = "";
  document.getElementById("result").textContent = "";
  document.getElementById("input").value = "";
  document.getElementById("input-area").style.display = "block";

  startTime = new Date();
  timerInterval = setInterval(updateTimer, 100);
}

function updateTimer() {
  const now = new Date();
  const elapsed = Math.floor((now - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  document.getElementById("timer").textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function submitNumber() {
  const input = document.getElementById("input");
  const value = parseInt(input.value);
  const feedback = document.getElementById("feedback");

  if (value === primes[currentIndex]) {
    feedback.textContent = "OK!";
    feedback.style.color = "green";
    correctCount++;
    currentIndex++;
    input.value = "";
    feedback.textContent = "";

    if (currentIndex === primes.length) {
      clearInterval(timerInterval);
      const elapsed = Math.floor((new Date() - startTime) / 1000);
      document.getElementById("result").textContent = `FINISH! 正解数: ${correctCount}、時間: ${elapsed}秒`;
      document.getElementById("input-area").style.display = "none";
    }
  } else {
    feedback.textContent = "NO";
    feedback.style.color = "red";
    input.value = "";
  }
}