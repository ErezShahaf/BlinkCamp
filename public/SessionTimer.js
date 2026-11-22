// Session timer: optional auto-stopping session length (2 / 5 / 10 min) or "Free" (no limit, the original behaviour).
// The dot only moves while the session is running, i.e. not paused and not completed.
// A frame longer than this (e.g. after the tab was hidden) is not counted as exercise time.
const maxCountedFrameSeconds = 0.25;
const state = {
    presetSeconds: 0,
    elapsedSeconds: 0,
    isPaused: false,
    isComplete: false,
};
let timerText;
let progressFill;
let pauseButton;
let presetButtons;
let completeOverlay;
let completeSummary;
let dotElement;
export const IsSessionRunning = () => !state.isPaused && !state.isComplete;
// Countdowns round up (so 00:00 means the session is over); the Free count-up rounds down.
const FormatTime = (totalSeconds, roundUp) => {
    const seconds = Math.max(0, roundUp ? Math.ceil(totalSeconds) : Math.floor(totalSeconds));
    const minutes = Math.floor(seconds / 60);
    const pad = (n) => (n < 10 ? "0" : "") + n;
    return `${pad(minutes)}:${pad(seconds % 60)}`;
};
const Render = () => {
    const isTimed = state.presetSeconds > 0;
    timerText.textContent = isTimed
        ? FormatTime(state.presetSeconds - state.elapsedSeconds, true)
        : FormatTime(state.elapsedSeconds, false);
    timerText.title = isTimed ? "Time left in this session" : "Time elapsed (no limit)";
    const progress = isTimed ? Math.min(1, state.elapsedSeconds / state.presetSeconds) : 0;
    progressFill.style.transform = `scaleX(${progress})`;
    progressFill.parentElement.classList.toggle("hidden", !isTimed);
    pauseButton.textContent = state.isPaused ? "Resume" : "Pause";
    pauseButton.disabled = state.isComplete;
    pauseButton.setAttribute("aria-pressed", String(state.isPaused));
    presetButtons.forEach(button => {
        const selected = Number(button.dataset.seconds) === state.presetSeconds;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
    dotElement.classList.toggle("resting", state.isPaused || state.isComplete);
    completeOverlay.classList.toggle("hidden", !state.isComplete);
};
const StartSession = (presetSeconds) => {
    state.presetSeconds = presetSeconds;
    state.elapsedSeconds = 0;
    state.isPaused = false;
    state.isComplete = false;
    Render();
};
const TogglePause = () => {
    if (state.isComplete) {
        return;
    }
    state.isPaused = !state.isPaused;
    Render();
};
const CompleteSession = () => {
    state.elapsedSeconds = state.presetSeconds;
    state.isComplete = true;
    const minutes = state.presetSeconds / 60;
    completeSummary.textContent = `You finished a ${minutes}-minute session. Rest your eyes for a moment.`;
    Render();
};
const Tick = (dTime) => {
    if (!IsSessionRunning()) {
        return;
    }
    const previousWholeSeconds = Math.floor(state.elapsedSeconds);
    state.elapsedSeconds += Math.min(dTime, maxCountedFrameSeconds);
    if (state.presetSeconds > 0 && state.elapsedSeconds >= state.presetSeconds) {
        CompleteSession();
        return;
    }
    // Only touch the DOM when the displayed second changes; the progress bar animates via CSS.
    if (Math.floor(state.elapsedSeconds) !== previousWholeSeconds) {
        Render();
    }
};
export const InitializeSessionTimer = () => {
    timerText = document.getElementById("sessiontime");
    progressFill = document.getElementById("sessionprogressfill");
    pauseButton = document.getElementById("sessionpause");
    presetButtons = Array.from(document.querySelectorAll(".sessionpreset"));
    completeOverlay = document.getElementById("sessioncomplete");
    completeSummary = document.getElementById("sessioncompletesummary");
    dotElement = document.getElementById("dot");
    presetButtons.forEach(button => {
        button.addEventListener("click", () => {
            StartSession(Number(button.dataset.seconds));
            button.blur(); // so Space toggles pause instead of re-clicking this button
        });
    });
    pauseButton.addEventListener("click", () => {
        TogglePause();
        pauseButton.blur();
    });
    document.getElementById("sessionrestart").addEventListener("click", () => StartSession(state.presetSeconds));
    document.getElementById("sessionfree").addEventListener("click", () => StartSession(0));
    window.addEventListener("keydown", (event) => {
        if (event.code !== "Space" || event.repeat) {
            return;
        }
        const target = event.target;
        if (target.tagName === "BUTTON" || target.tagName === "A") {
            return; // let Space activate the focused control
        }
        event.preventDefault();
        TogglePause();
    });
    window.addEventListener("GameLoop:Update", (event) => {
        Tick(event.detail.dTime);
    });
    Render();
};
