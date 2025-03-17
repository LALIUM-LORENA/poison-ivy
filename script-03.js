let workoutHistory = [];

function analyzeWorkout(event) {
    event.preventDefault();

    const exercise = document.getElementById("exercise").value;
    const reps = parseInt(document.getElementById("reps").value);
    const sets = parseInt(document.getElementById("sets").value);
    const effort = document.getElementById("effort").value;
    const sleep = parseInt(document.getElementById("sleep").value) || null;
    const date = document.getElementById("date").value;
    const glucose = parseInt(document.getElementById("glucose").value) || null;
    const cholesterol = parseInt(document.getElementById("cholesterol").value) || null;
    const vitaminD = parseInt(document.getElementById("vitaminD").value) || null;
    const iron = parseInt(document.getElementById("iron").value) || null;
    const testosterone = parseInt(document.getElementById("testosterone").value) || null;
    const crp = parseFloat(document.getElementById("crp").value) || null;

    const workout = { date, exercise, reps, sets, effort, sleep, glucose, cholesterol, vitaminD, iron, testosterone, crp };
    workoutHistory.push(workout);

    let feedback = `<strong>${exercise} - ${date}</strong><br>`;
    feedback += `You did ${sets} sets of ${reps} reps—great work! `;

    if (exercise === "push-ups" || exercise === "squats") {
        if (effort === "easy" && reps >= 10) feedback += `Since it’s easy, try ${reps + 2} reps. `;
        else if (effort === "hard" && reps > 8) feedback += `Tough one—stick to ${reps} or drop to ${reps - 2}. Our fitness consultants can perfect your form! `;
        else feedback += `Solid pace—keep at ${reps} reps. `;
    } else if (exercise === "plank") {
        if (effort === "easy" && reps >= 30) feedback += `Great hold! Try ${reps + 10} seconds. `;
        else if (effort === "hard" && reps > 20) feedback += `Strong effort—hold ${reps - 5} seconds if tough. A Method to Great trainer can help! `;
        else feedback += `Keep at ${reps} seconds. `;
    }

    if (glucose !== null) {
        if (glucose > 100) feedback += `<br><strong>Glucose (${glucose} mg/dL):</strong> High—cut carbs today. Our nutrition meal plans can balance this—learn more at Method to Great! `;
        else if (glucose < 70) feedback += `<br><strong>Glucose (${glucose} mg/dL):</strong> Low—eat a carb (e.g., fruit). Try our Power Glucose supplement! `;
        else feedback += `<br><strong>Glucose (${glucose} mg/dL):</strong> Perfect—keep it up! `;
    }

    if (cholesterol !== null) {
        if (cholesterol > 200) feedback += `<br><strong>Cholesterol (${cholesterol} mg/dL):</strong> High—add cardio. Our Power Omega-3 supports heart health—check it out! `;
        else if (cholesterol < 150) feedback += `<br><strong>Cholesterol (${cholesterol} mg/dL):</strong> Low—add healthy fats. A nutrition plan can optimize this! `;
        else feedback += `<br><strong>Cholesterol (${cholesterol} mg/dL):</strong> Solid—nice job! `;
    }

    if (vitaminD !== null) {
        if (vitaminD < 30) feedback += `<br><strong>Vitamin D (${vitaminD} ng/mL):</strong> Low—get sunlight. Our Power Vitamin D3 can boost you—available now! `;
        else if (vitaminD > 100) feedback += `<br><strong>Vitamin D (${vitaminD} ng/mL):</strong> High—ease supplements. A consultant can adjust this! `;
        else feedback += `<br><strong>Vitamin D (${vitaminD} ng/mL):</strong> Optimal—strong foundation! `;
    }

    if (iron !== null) {
        if (iron < 30) feedback += `<br><strong>Iron (${iron} ng/mL):</strong> Low—eat spinach. Our Power Iron supplement can help—see Method to Great! `;
        else if (iron > 150) feedback += `<br><strong>Iron (${iron} ng/mL):</strong> High—watch intake. A nutritionist can guide you! `;
        else feedback += `<br><strong>Iron (${iron} ng/mL):</strong> Good—energy’s set! `;
    }

    if (testosterone !== null) {
        if (testosterone < 300) feedback += `<br><strong>Testosterone (${testosterone} ng/dL):</strong> Low—lift heavy. Our Power Test Boost can assist—check it out! `;
        else if (testosterone > 1000) feedback += `<br><strong>Testosterone (${testosterone} ng/dL):</strong> High—great for gains. A pro can confirm this! `;
        else feedback += `<br><strong>Testosterone (${testosterone} ng/dL):</strong> Solid—muscle-ready! `;
    }

    if (crp !== null) {
        if (crp > 3) feedback += `<br><strong>CRP (${crp} mg/L):</strong> High—inflammation’s up. Ease off, add berries. Our Power Anti-Inflame supplement can support you! `;
        else feedback += `<br><strong>CRP (${crp} mg/L):</strong> Normal—keep steady! `;
    }

    if (sleep !== null && sleep < 6) feedback += `<br><strong>Sleep (${sleep} hrs):</strong> Low—aim for 7+. A nutritionist can suggest calming options! `;

    feedback += `<br><small><em>Ranges are estimates. Consult a pro for precision. Elevate your journey with Method to Great’s meal plans, fitness consultancy, and power supplements—visit us soon!</em></small>`;

    document.getElementById("feedback").innerHTML = feedback;
}

document.getElementById("workoutForm").addEventListener("submit", function() {
    setTimeout(() => document.getElementById("workoutForm").reset(), 1000);
});
