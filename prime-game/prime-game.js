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
  document.getElementById("correct-list").textContent = "";

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
  const value = parseInt(input.value, 10);
  const feedback = document.getElementById("feedback");

  if (value === primes[currentIndex]) {
    feedback.textContent = `OK! ${value}`;
    feedback.style.color = "green";
    correctCount++;
    currentIndex++;
    input.value = "";

    const correctPrimes = primes.slice(0, currentIndex);
    let formatted = "";
    for (let i = 0; i < correctPrimes.length; i++) {
      formatted += correctPrimes[i].toString();
      if (i < correctPrimes.length - 1) {
        formatted += ", ";
      }
      if ((i + 1) % 10 === 0) {
        formatted += "<br>";
      }
    }
    document.getElementById("correct-list").innerHTML = formatted;

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

    const correctPrimes = primes.slice(0, currentIndex);
    let formatted = "";
    for (let i = 0; i < correctPrimes.length; i++) {
      formatted += correctPrimes[i].toString();
      if (i < correctPrimes.length - 1) {
        formatted += ", ";
      }
      if ((i + 1) % 10 === 0) {
        formatted += "<br>";
      }
    }
    document.getElementById("correct-list").innerHTML = formatted;
  }
}

function handleKey(event) {
  if (event.key === "Enter") {
    submitNumber();
  }
}