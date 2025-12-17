document.addEventListener("DOMContentLoaded", function () {

  let totalGlasses = localStorage.getItem("goal")
    ? parseInt(localStorage.getItem("goal"))
    : 8;

  const glassSize = 250;

  let filledGlasses = localStorage.getItem("filled")
    ? parseInt(localStorage.getItem("filled"))
    : 0;

  let streak = localStorage.getItem("streak")
    ? parseInt(localStorage.getItem("streak"))
    : 0;

  const glassesContainer = document.getElementById("glasses");
  const progress = document.getElementById("progress");
  const info = document.getElementById("info");
  const message = document.getElementById("message");
  const goalText = document.getElementById("goalText");
  const goalInput = document.getElementById("goalInput");
  const streakText = document.getElementById("streak");

  goalInput.value = totalGlasses;

  function createGlasses() {
    glassesContainer.innerHTML = "";
    for (let i = 0; i < totalGlasses; i++) {
      const glass = document.createElement("div");
      glass.className = "glass";
      glass.innerText = "250ml";
      glass.addEventListener("click", () => fillGlass(i));
      glassesContainer.appendChild(glass);
    }
  }

  function fillGlass(index) {
    const glasses = document.querySelectorAll(".glass");

    glasses.forEach((glass, i) => {
      if (i <= index) {
        glass.classList.add("filled");
      } else {
        glass.classList.remove("filled");
      }
    });

    filledGlasses = index + 1;
    localStorage.setItem("filled", filledGlasses);

    updateTracker();
  }

  function updateTracker() {
    const consumed = filledGlasses * glassSize;
    const total = totalGlasses * glassSize;
    const remaining = total - consumed;
    const percent = (filledGlasses / totalGlasses) * 100;

    progress.style.width = percent + "%";
    info.innerText = `Consumed: ${consumed} ml | Remaining: ${remaining} ml`;
    goalText.innerText = `Daily Goal: ${totalGlasses} Glasses (${total} ml)`;

    if (percent === 100) {
      message.innerText = "🎉 Daily Goal Achieved!";
      message.style.color = "green";
      updateStreak();
    } else if (percent >= 75) {
      message.innerText = "👍 Almost there!";
      message.style.color = "blue";
    } else if (percent >= 50) {
      message.innerText = "🙂 Good progress!";
      message.style.color = "orange";
    } else {
      message.innerText = "⚠️ Drink more water!";
      message.style.color = "red";
    }

    streakText.innerText = `🔥 Streak: ${streak} days`;
  }

  function updateStreak() {
    const today = new Date().toDateString();
    const lastDay = localStorage.getItem("lastCompleted");

    if (lastDay !== today) {
      streak++;
      localStorage.setItem("streak", streak);
      localStorage.setItem("lastCompleted", today);
    }
  }

  window.setGoal = function () {
    totalGlasses = parseInt(goalInput.value);
    localStorage.setItem("goal", totalGlasses);
    filledGlasses = 0;
    localStorage.setItem("filled", 0);
    createGlasses();
    updateTracker();
  };

  window.resetTracker = function () {
    filledGlasses = 0;
    localStorage.setItem("filled", 0);
    progress.style.width = "0%";
    message.innerText = "⚠️ Drink more water!";
    message.style.color = "red";
    document.querySelectorAll(".glass")
      .forEach(g => g.classList.remove("filled"));
    updateTracker();
  };

  // INITIAL LOAD
  createGlasses();
  if (filledGlasses > 0) {
    fillGlass(filledGlasses - 1);
  } else {
    updateTracker();
  }

});
