// In-memory history loaded from localStorage (or starts empty)
let workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];

/**
 * Utility: Parse an input value as a number using the provided parser.
 * If the input is an empty string, returns null.
 */
function parseInputValue(id, parseFn = parseInt) {
  const value = document.getElementById(id).value;
  return value === "" ? null : parseFn(value);
}

/**
 * Helper Functions for Health Metric Feedback
 */
function getGlucoseFeedback(glucose) {
  if (glucose > 100) return "<span>A bit high—try a low-carb snack post-workout (e.g., nuts).</span>";
  if (glucose < 70) return "<span>Low—eat a small carb (e.g., fruit) before exercising.</span>";
  return "<span>Perfect range—keep it steady!</span>";
}

function getCholesterolFeedback(cholesterol) {
  if (cholesterol > 200) return "<span>Above ideal—add cardio tomorrow and oats to breakfast.</span>";
  if (cholesterol < 150) return "<span>Low end—healthy fats (e.g., avocado) can help.</span>";
  return "<span>Solid levels—great job!</span>";
}

function getVitaminDFeedback(vitaminD) {
  if (vitaminD < 30) return "<span>Low—get 10 mins sunlight or add fish. May slow recovery.</span>";
  if (vitaminD > 100) return "<span>High—ease up on supplements if taking them.</span>";
  return "<span>Optimal—supports strong workouts!</span>";
}

function getIronFeedback(iron) {
  if (iron < 30) return "<span>Low—add red meat or spinach; fatigue might hit otherwise. Stick to moderate reps.</span>";
  if (iron > 150) return "<span>High—watch intake, consult your doc if unsure.</span>";
  return "<span>Good range—plenty of energy for lifts!</span>";
}

function getTestosteroneFeedback(testosterone) {
  if (testosterone < 300) return "<span>Low—focus on compound lifts (e.g., squats) and zinc-rich foods.</span>";
  if (testosterone > 1000) return "<span>High—great for gains, but check with your doc if unexpected.</span>";
  return "<span>Solid—perfect for muscle-building!</span>";
}

function getCRPFeedback(crp) {
  if (crp > 3) return "<span>Elevated—inflammation’s up. Ease up on intensity, add anti-inflammatory foods (e.g., berries).</span>";
  if (crp < 1) return "<span>Low—minimal inflammation, full speed ahead!</span>";
  return "<span>Normal—keep your routine steady.</span>";
}

function getSleepFeedback(sleep) {
  return sleep < 6 ? "<span>Low—aim for 7+ to boost energy." : "Perfect for recovery!</span>";
}

/**
 * Generates a feedback string based on the workout object.
 */
function generateFeedback(workout) {
  let feedback = `<div class="feedback-heading">${workout.exercise} - ${workout.date}</div>
                  <div class="feedback-result">You did ${workout.sets} sets of ${workout.reps} reps—nice effort!</div> `;

  // Exercise-specific feedback
  if (workout.exercise === "push-ups" || workout.exercise === "squats") {
    if (workout.effort === "easy" && workout.reps >= 10) {
      feedback += `<div class="feedback-info">Since it felt easy, try ${workout.reps + 2} reps or add a set.</div>`;
    } else if (workout.effort === "hard" && workout.reps > 8) {
      feedback += `<div class="feedback-info">It was tough—stick to ${workout.reps} or drop to ${workout.reps - 2}.</div>`;
    } else {
      feedback += `<div class="feedback-info">Good pace—keep at ${workout.reps} reps.</div>`;
    }
  } else if (workout.exercise === "plank") {
    if (workout.effort === "easy" && workout.reps >= 30) {
      feedback += `<div class="feedback-info">Great hold! Try ${workout.reps + 10} seconds next time.</div>`;
    } else if (workout.effort === "hard" && workout.reps > 20) {
      feedback += `<div class="feedback-info">Solid effort—hold ${workout.reps - 5} seconds if too tough.</div>`;
    } else {
      feedback += `<div class="feedback-info">Keep at ${workout.reps} seconds to build endurance.</div>`;
    }
  }

  // Blood test and health metrics feedback
  if (workout.glucose !== null) {
    feedback += `<div class="result-row"><span class="result-heading">Glucose (${workout.glucose} mg/dL):</span> ${getGlucoseFeedback(workout.glucose)}</div>`;
  }
  if (workout.cholesterol !== null) {
    feedback += `<div class="result-row"><span class="result-heading">Cholesterol (${workout.cholesterol} mg/dL):</span> ${getCholesterolFeedback(workout.cholesterol)}</div>`;
  }
  if (workout.vitaminD !== null) {
    feedback += `<div class="result-row"><span class="result-heading">Vitamin D (${workout.vitaminD} ng/mL):</span> ${getVitaminDFeedback(workout.vitaminD)}</div>`;
  }
  if (workout.iron !== null) {
    feedback += `<div class="result-row"><span class="result-heading">Iron (${workout.iron} ng/mL):</span> ${getIronFeedback(workout.iron)}</div>`;
  }
  if (workout.testosterone !== null) {
    feedback += `<div class="result-row"><span class="result-heading">Testosterone (${workout.testosterone} ng/dL):</span> ${getTestosteroneFeedback(workout.testosterone)}</div>`;
  }
  if (workout.crp !== null) {
    feedback += `<div class="result-row"><span class="result-heading">CRP (${workout.crp} mg/L):</span> ${getCRPFeedback(workout.crp)}</div>`;
  }
  if (workout.sleep !== null) {
    feedback += `<div class="result-row"><span class="result-heading">Sleep (${workout.sleep} hrs):</span> ${getSleepFeedback(workout.sleep)}</div>`;
  }

  // Progress check: find the most recent previous workout for the same exercise
  const previousWorkout = [...workoutHistory]
    .reverse()
    .find(w => w.exercise === workout.exercise && w.date < workout.date);
  if (previousWorkout) {
    if (previousWorkout.reps < workout.reps || previousWorkout.sets < workout.sets) {
      feedback += `<div><span>Progress:</span> Improvement from ${previousWorkout.reps} reps and ${previousWorkout.sets} sets—awesome!</div>`;
    }
  }

  return feedback;
}

/**
 * Opens the modal with the given feedback.
 */
function openModal(feedback) {
  const modalOverlay = document.getElementById("modalOverlay");
  const modal = document.getElementById("modalPrimary");
  const modalFeedback = document.getElementById("modalFeedback");

  modalFeedback.innerHTML = feedback;
  modalOverlay.classList.add("active");
  modal.classList.add("active");
}

/**
 * Closes the modal.
 */
function closeModal() {
  const modalOverlay = document.getElementById("modalOverlay");
  const modal = document.getElementById("modalPrimary");

  modalOverlay.classList.remove("active");
  modal.classList.remove("active");
}

/**
 * Main event handler for workout form submission.
 */
function analyzeWorkout(event) {
  event.preventDefault();

  // Build the workout object using our parseInputValue utility
  const workout = {
    date: document.getElementById("date").value,
    exercise: document.getElementById("exercise").value,
    reps: parseInputValue("reps", parseInt),
    sets: parseInputValue("sets", parseInt),
    effort: document.getElementById("effort").value,
    sleep: parseInputValue("sleep", parseInt),
    glucose: parseInputValue("glucose", parseInt),
    cholesterol: parseInputValue("cholesterol", parseInt),
    vitaminD: parseInputValue("vitaminD", parseInt),
    iron: parseInputValue("iron", parseInt),
    testosterone: parseInputValue("testosterone", parseInt),
    crp: parseInputValue("crp", parseFloat)
  };

  // Store the workout and persist to localStorage
  workoutHistory.push(workout);
  localStorage.setItem("workoutHistory", JSON.stringify(workoutHistory));

  // Generate feedback and open modal
  const feedback = generateFeedback(workout);
  openModal(feedback);

  // Reset the form after a short delay
  setTimeout(() => document.getElementById("workoutForm").reset(), 1000);
}

// Close modal on click of "x" or overlay
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("modalOverlay").addEventListener("click", (e) => {
  if (e.target.id === "modalOverlay") {
    closeModal();
  }
});
