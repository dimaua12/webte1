const SEMESTER_START = new Date(2026, 8, 14);
const SEMESTER_END = new Date(2026, 11, 20, 23, 59);

const menuButton = document.querySelector(".menu-button");
const mainNav = document.querySelector(".main-nav");

if (menuButton && mainNav) {
  menuButton.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

const lessonCells = document.querySelectorAll(".schedule-table .lesson");

if (lessonCells.length > 0) {
  const lessonStatus = document.getElementById("lesson-status");
  const filterStatus = document.getElementById("filter-status");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const semesterProgress = document.getElementById("semester-progress");
  const semesterPercent = document.getElementById("semester-percent");

  function timeInMinutes(time) {
    const parts = time.split(":");
    return Number(parts[0]) * 60 + Number(parts[1]);
  }

  function updateLessonStatus() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    let currentLesson = null;
    let nextLesson = null;
    let nextDate = null;

    lessonCells.forEach(function (cell) {
      cell.classList.remove("is-current");
      const day = Number(cell.dataset.day);
      const start = timeInMinutes(cell.dataset.start);
      const end = timeInMinutes(cell.dataset.end);

      if (day === now.getDay() && currentTime >= start && currentTime <= end) {
        currentLesson = cell;
      }

      let daysUntil = (day - now.getDay() + 7) % 7;
      if (daysUntil === 0 && start <= currentTime) {
        daysUntil = 7;
      }

      const lessonDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntil, Math.floor(start / 60), start % 60);
      if (nextDate === null || lessonDate < nextDate) {
        nextDate = lessonDate;
        nextLesson = cell;
      }
    });

    if (currentLesson) {
      currentLesson.classList.add("is-current");
      const name = currentLesson.querySelector(".lesson-content").firstChild.textContent.trim();
      lessonStatus.textContent = "Práve prebieha: " + name + ".";
    } else {
      const name = nextLesson.querySelector(".lesson-content").firstChild.textContent.trim();
      const date = nextDate.toLocaleDateString("sk-SK", { weekday: "long", day: "numeric", month: "numeric" });
      lessonStatus.textContent = "Teraz nemám vyučovanie. Najbližšia hodina: " + name + " v " + date + " o " + nextLesson.dataset.start + ".";
    }
  }

  function updateSemesterProgress() {
    const now = new Date();
    const elapsed = now - SEMESTER_START;
    const duration = SEMESTER_END - SEMESTER_START;
    const percent = Math.max(0, Math.min(100, Math.round(elapsed / duration * 100)));
    semesterProgress.value = percent;
    semesterPercent.textContent = percent + " %";
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.dataset.filter;
      let visibleCount = 0;

      filterButtons.forEach(function (item) {
        item.setAttribute("aria-pressed", String(item === button));
      });

      lessonCells.forEach(function (cell) {
        const visible = filter === "all" || cell.classList.contains(filter);
        cell.classList.toggle("is-filtered", !visible);
        if (visible) {
          visibleCount += 1;
        }
      });

      filterStatus.hidden = visibleCount > 0;
      filterStatus.textContent = visibleCount === 0 ? "Pre tento filter nemám žiadnu hodinu." : "";
    });
  });

  updateLessonStatus();
  updateSemesterProgress();
  setInterval(updateLessonStatus, 60000);
}
