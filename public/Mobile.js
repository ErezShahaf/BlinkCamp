// Touch screens: the dock covers a large share of a phone screen, so while a session is running
// it fades out after a few seconds without a touch, giving the dot the whole screen.
// A tap anywhere brings it back. It stays visible while paused, while a menu is open,
// in Zen mode (which hides it anyway) and when a session finishes.
import { IsSessionRunning } from "./SessionTimer.js";
import { IsPopoverOpen } from "./Menus.js";
const hideAfterMs = 3000;
const hintStorageKey = "blinkcamp.tapHintShown";
let hideTimer;
let hint = null;
const IsTouchScreen = () => window.matchMedia("(pointer: coarse)").matches;
const AreControlsHidden = () => document.body.classList.contains("controls-hidden");
const ShowHintOnce = () => {
    try {
        if (localStorage.getItem(hintStorageKey)) {
            return;
        }
        localStorage.setItem(hintStorageKey, "1");
    }
    catch ( /* storage unavailable: show the hint this time anyway */_a) { /* storage unavailable: show the hint this time anyway */ }
    hint = document.createElement("div");
    hint.className = "taphint";
    hint.setAttribute("role", "status");
    hint.textContent = "Tap anywhere to show the controls";
    document.body.appendChild(hint);
    window.setTimeout(() => hint === null || hint === void 0 ? void 0 : hint.classList.add("leaving"), 2600);
    window.setTimeout(() => { hint === null || hint === void 0 ? void 0 : hint.remove(); hint = null; }, 3200);
};
const ScheduleHide = () => {
    window.clearTimeout(hideTimer);
    if (!IsTouchScreen()) {
        return;
    }
    hideTimer = window.setTimeout(() => {
        const canHide = IsSessionRunning() && !IsPopoverOpen() && !document.body.classList.contains("zen");
        if (canHide) {
            document.body.classList.add("controls-hidden");
            ShowHintOnce();
        }
        else {
            ScheduleHide(); // check again later (e.g. once a menu closes)
        }
    }, hideAfterMs);
};
const ShowControls = () => {
    document.body.classList.remove("controls-hidden");
    ScheduleHide();
};
export const InitializeMobile = () => {
    // Any touch brings the controls back. While they are hidden they ignore taps,
    // so the first tap never presses a button by accident.
    window.addEventListener("pointerdown", ShowControls, { capture: true });
    window.addEventListener("keydown", ShowControls, { capture: true });
    window.addEventListener("Session:Complete", ShowControls);
    ScheduleHide();
};
