function checkTasks(dayNumber) {
  const currentCard = document.querySelector(`.day-card[data-day="${dayNumber}"]`);
  const checkboxes = currentCard.querySelectorAll('input[type="checkbox"]');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);

  if (allChecked) {
    const nextCard = document.querySelector(`.day-card[data-day="${dayNumber + 1}"]`);
    if (nextCard) {
      nextCard.classList.remove('hidden');
    }
  }

  updateProgressRing();
}

let lastProgressPercent = 0;

function updateProgressRing() {
  const totalDays = 7;
  const revealedCards = document.querySelectorAll('.day-card:not(.hidden)');
  let completedDays = 0;

  revealedCards.forEach(card => {
    const checkboxes = card.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    if (allChecked) completedDays++;
  });

  const targetPercent = Math.round((completedDays / totalDays) * 100);

  if (targetPercent === lastProgressPercent) return;

  let currentPercent = lastProgressPercent;
  const ring = document.getElementById('progressRing');
  const text = document.getElementById('progressText');
  const step = 1;
  const interval = 10;

  const animate = setInterval(() => {
    if (currentPercent >= targetPercent) {
      clearInterval(animate);
    } else {
      currentPercent += step;
      ring.style.background = `conic-gradient(orange ${currentPercent}%, #eee ${currentPercent}%)`;
      text.textContent = `${currentPercent}%`;
    }
  }, interval);

  // Update global tracker
  lastProgressPercent = targetPercent;
}


// Initialize with 0% progress
window.onload = updateProgressRing;

