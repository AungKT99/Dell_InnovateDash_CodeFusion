let currentStep = 1;
const totalSteps = 4;

function showStep(step) {
  for (let i = 1; i <= totalSteps; i++) {
    const el = document.getElementById(`step-${i}`);
    el.classList.toggle('hidden', i !== step);
  }

  // Show/hide the Back button
  const backBtn = document.getElementById("backBtn");
  if (step === 1) {
    backBtn.style.display = "none";
  } else {
    backBtn.style.display = "inline-block";
  }
}

function nextStep() {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    } else {
      // Redirect to persona result page
      window.location.href = "persona.html";
    }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

// Make option boxes selectable
document.querySelectorAll('.options').forEach(group => {
  group.addEventListener('click', function (e) {
    if (e.target.classList.contains('option')) {
      // remove selection from all options in this group
      const options = group.querySelectorAll('.option');
      options.forEach(option => option.classList.remove('selected'));

      // mark clicked one as selected
      e.target.classList.add('selected');
    }
  });
});


showStep(currentStep);
