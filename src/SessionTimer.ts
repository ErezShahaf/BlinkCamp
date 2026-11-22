// Session timer: optional auto-stopping session length (2 / 5 / 10 min) or "Free" (no limit, the original behaviour).
// The dot only moves while the session is running, i.e. not paused and not completed.

// 0 means "Free": no time limit, the timer just counts up.
type SessionPresetSeconds = 0 | 120 | 300 | 600;

// A frame longer than this (e.g. after the tab was hidden) is not counted as exercise time.
const maxCountedFrameSeconds = 0.25;

const state = {
    presetSeconds: 0 as SessionPresetSeconds,
    elapsedSeconds: 0,
    isPaused: false,
    isComplete: false,
};

import { RegisterPopover, ClosePopover, EnableMenuKeyboard } from "./Menus.js";

let timerText: HTMLElement;
let modeLabel: HTMLElement | null;
let progressFill: HTMLElement;
let pauseButton: HTMLButtonElement;
let presetButtons: HTMLButtonElement[];
let completeOverlay: HTMLElement;
let completeSummary: HTMLElement;
let dotElement: HTMLElement;

export const IsSessionRunning = (): boolean => !state.isPaused && !state.isComplete;

// Countdowns round up (so 00:00 means the session is over); the Free count-up rounds down.
const FormatTime = (totalSeconds: number, roundUp: boolean): string => {
    const seconds = Math.max(0, roundUp ? Math.ceil(totalSeconds) : Math.floor(totalSeconds));
    const minutes = Math.floor(seconds / 60);
    const pad = (n: number): string => (n < 10 ? "0" : "") + n;
    return `${pad(minutes)}:${pad(seconds % 60)}`;
};

const Render = (): void => {
    const isTimed = state.presetSeconds > 0;
    timerText.textContent = isTimed
        ? FormatTime(state.presetSeconds - state.elapsedSeconds, true)
        : FormatTime(state.elapsedSeconds, false);
    timerText.title = isTimed ? "Time left in this session" : "Time elapsed (no limit)";

    const progress = isTimed ? Math.min(1, state.elapsedSeconds / state.presetSeconds) : 0;
    progressFill.style.transform = `scaleX(${progress})`;
    progressFill.parentElement!.classList.toggle("hidden", !isTimed);

    if (modeLabel) {
        modeLabel.textContent = isTimed ? `${state.presetSeconds / 60} min` : "Free";
    }

    // The button shows a play icon while paused and a pause icon while running (see styles.css).
    const pauseLabel = state.isPaused ? "Resume (P or Space)" : "Pause (P or Space)";
    pauseButton.dataset.state = state.isPaused ? "paused" : "running";
    pauseButton.setAttribute("aria-label", pauseLabel);
    pauseButton.title = pauseLabel;
    pauseButton.disabled = state.isComplete;

    presetButtons.forEach(button => {
        const selected = Number(button.dataset.seconds) === state.presetSeconds;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-checked", String(selected));
    });

    dotElement.classList.toggle("resting", state.isPaused || state.isComplete);
    completeOverlay.classList.toggle("hidden", !state.isComplete);
};

const StartSession = (presetSeconds: SessionPresetSeconds): void => {
    state.presetSeconds = presetSeconds;
    state.elapsedSeconds = 0;
    state.isPaused = false;
    state.isComplete = false;
    Render();
    if (presetSeconds > 0) {
        window.dispatchEvent(new CustomEvent("Session:Started", { detail: { presetSeconds } }));
    }
};

export const TogglePause = (): void => {
    if (state.isComplete) {
        return;
    }
    state.isPaused = !state.isPaused;
    Render();
};

// Stop: pause and rewind the current session to its start (same length). Press P / Space to begin again.
export const StopSession = (): void => {
    state.elapsedSeconds = 0;
    state.isPaused = true;
    state.isComplete = false;
    Render();
};

const CompleteSession = (): void => {
    state.elapsedSeconds = state.presetSeconds;
    state.isComplete = true;
    const minutes = state.presetSeconds / 60;
    completeSummary.textContent = `You finished a ${minutes}-minute session. Rest your eyes for a moment.`;
    Render();
    window.dispatchEvent(new CustomEvent("Session:Complete"));
};

const Tick = (dTime: number): void => {
    if (!IsSessionRunning()) {
        return;
    }
    const previousWholeSeconds = Math.floor(state.elapsedSeconds);
    const previousSecondsLeft = state.presetSeconds - state.elapsedSeconds;
    state.elapsedSeconds += Math.min(dTime, maxCountedFrameSeconds);

    // Heads-up when a timed session crosses its last minute.
    const secondsLeft = state.presetSeconds - state.elapsedSeconds;
    if (state.presetSeconds > 60 && previousSecondsLeft > 60 && secondsLeft <= 60) {
        window.dispatchEvent(new CustomEvent("Session:OneMinuteLeft"));
    }

    if (state.presetSeconds > 0 && state.elapsedSeconds >= state.presetSeconds) {
        CompleteSession();
        return;
    }
    // Only touch the DOM when the displayed second changes; the progress bar animates via CSS.
    if (Math.floor(state.elapsedSeconds) !== previousWholeSeconds) {
        Render();
    }
};

export const InitializeSessionTimer = (): void => {
    timerText = document.getElementById("sessiontime")!;
    modeLabel = document.getElementById("sessionmode");
    progressFill = document.getElementById("sessionprogressfill")!;
    pauseButton = document.getElementById("sessionpause") as HTMLButtonElement;
    presetButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".sessionpreset"));
    completeOverlay = document.getElementById("sessioncomplete")!;
    completeSummary = document.getElementById("sessioncompletesummary")!;
    dotElement = document.getElementById("dot")!;

    presetButtons.forEach(button => {
        button.addEventListener("click", () => {
            StartSession(Number(button.dataset.seconds) as SessionPresetSeconds);
            ClosePopover();
            button.blur(); // so Space toggles pause instead of re-clicking this button
        });
    });

    // Session length menu (Free / 2 / 5 / 10 min), opened from the time readout.
    const sessionMenu = document.getElementById("sessionmenu");
    const timeButton = document.getElementById("sessiontimebutton");
    if (sessionMenu && timeButton) {
        EnableMenuKeyboard(sessionMenu, ".sessionpreset, .menuaction");
        RegisterPopover(timeButton, sessionMenu, {
            onOpen: () => sessionMenu.querySelector<HTMLElement>(".sessionpreset.selected")?.focus(),
        });
    }

    pauseButton.addEventListener("click", () => {
        TogglePause();
        pauseButton.blur();
    });

    document.getElementById("sessionrestart")!.addEventListener("click", () => StartSession(state.presetSeconds));
    document.getElementById("sessionstop")?.addEventListener("click", () => {
        StopSession();
        ClosePopover();
    });
    document.getElementById("sessionfree")!.addEventListener("click", () => StartSession(0));

    window.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.code !== "Space" || event.repeat) {
            return;
        }
        const target = event.target as HTMLElement;
        if (target.tagName === "BUTTON" || target.tagName === "A") {
            return; // let Space activate the focused control
        }
        event.preventDefault();
        TogglePause();
    });

    window.addEventListener("GameLoop:Update", (event: Event) => {
        Tick((event as CustomEvent).detail.dTime);
    });

    Render();
};
