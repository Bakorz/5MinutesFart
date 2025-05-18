const fart = new Audio("./sounds/dry-fart.mp3");
const fartButton = document.getElementById("fart-button");
const stopButton = document.getElementById("stop-button");
const progressBar = document.getElementById("timeProgress");
const timeRemaining = document.getElementById("timeRemaining");
let fartInterval;
let progressInterval;

document.addEventListener("DOMContentLoaded", () => {
  // Button click event handlers
  fartButton.addEventListener("click", startFartSound);
  stopButton.addEventListener("click", stopFartSound);
});

function startFartSound() {
  // Clear any existing intervals
  if (fartInterval) clearInterval(fartInterval);
  if (progressInterval) clearInterval(progressInterval);

  // Calculate time until next 5-minute mark on the clock
  const now = new Date();
  const minutesToNext = 5 - (now.getMinutes() % 5);
  const secondsToNext = minutesToNext * 60 - now.getSeconds();
  const msToNext = secondsToNext * 1000 - now.getMilliseconds();
  const totalMs = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Start progress bar updates using real clock time
  updateProgressWithClock();
  progressInterval = setInterval(updateProgressWithClock, 100);

  // Wait until next 5-minute mark, then start the interval
  setTimeout(() => {
    playFartSound();
    updateProgressWithClock();

    fartInterval = setInterval(() => {
      playFartSound();
      updateProgressWithClock();
    }, 5 * 60 * 1000);
  }, msToNext);
}

function updateProgressWithClock() {
  const now = new Date();
  const minutesPart = now.getMinutes() % 5;
  const secondsPart = now.getSeconds();
  const millisecondsPart = now.getMilliseconds();

  const elapsedMs = (minutesPart * 60 + secondsPart) * 1000 + millisecondsPart;
  const totalMs = 5 * 60 * 1000;

  const remaining = totalMs - elapsedMs;
  const progress = (elapsedMs / totalMs) * 100;

  // Update progress bar
  timeProgress.style.width = `${Math.min(progress, 100)}%`;
  timeProgress.setAttribute("aria-valuenow", Math.min(progress, 100));

  // Update time remaining
  const minutesRemaining = Math.floor(remaining / 60000);
  const secondsRemaining = Math.floor((remaining % 60000) / 1000);

  if (minutesRemaining >= 0 && secondsRemaining >= 0) {
    timeRemaining.textContent = `Next fart in: ${minutesRemaining}:${secondsRemaining
      .toString()
      .padStart(2, "0")}`;
  }
}

function playFartSound() {
  fart.currentTime = 0;
  fart.play();
}

function stopFartSound() {
  fart.pause();
  fart.currentTime = 0;
  clearInterval(fartInterval);
  clearInterval(progressInterval);
  fartInterval = null;
  progressInterval = null;
  progressBar.value = 0;
  timeRemaining.textContent = "";
}
