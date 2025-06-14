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
      // Gradient fill from purple to pink to grey
      ring.style.background = `conic-gradient(#6a0dad ${currentPercent * 0.5}%, #b0004e ${currentPercent}%, #eee ${currentPercent}%)`;
      text.textContent = `${currentPercent}%`;
    }
  }, interval);

  lastProgressPercent = targetPercent;
}

// Initialize on page load
window.onload = updateProgressRing;
