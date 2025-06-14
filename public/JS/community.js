    function animateCount(target, elementId) {
      let count = 0;
      const el = document.getElementById(elementId);
      const interval = setInterval(() => {
        if (count < target) {
          count++;
          el.textContent = `${count} people in Sengkang pledged this week`;
        } else {
          clearInterval(interval);
        }
      }, 30);
    }
    window.onload = () => animateCount(35, 'pledge-count');