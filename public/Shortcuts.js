// Keyboard shortcuts and full screen.
//
//   P (or Space)  pause / resume          S  stop: pause and rewind the session
//   Up / Down     previous / next routine F  full screen on / off
//   Z             Zen mode                Esc  close menus, leave Zen (see Zen.ts)
//
// Space is handled by SessionTimer.ts. Shortcuts never fire while a key is held with
// Ctrl / Cmd / Alt (so browser shortcuts keep working), while typing, or - for the arrow
// keys - while a slider or menu has focus, since those use the arrows themselves.
import { TogglePause, StopSession } from "./SessionTimer.js";
import { ToggleZen } from "./Zen.js";
let fullscreenButton = null;
const IsFullscreen = () => document.fullscreenElement !== null;
export const ToggleFullscreen = () => {
    if (!document.fullscreenEnabled) {
        return;
    }
    if (IsFullscreen()) {
        document.exitFullscreen().catch(() => { });
    }
    else {
        document.documentElement.requestFullscreen().catch(() => { });
    }
};
const RenderFullscreenButton = () => {
    if (!fullscreenButton) {
        return;
    }
    const isOn = IsFullscreen();
    const label = isOn ? "Exit full screen (F)" : "Full screen (F)";
    fullscreenButton.dataset.state = isOn ? "on" : "off";
    fullscreenButton.setAttribute("aria-pressed", String(isOn));
    fullscreenButton.setAttribute("aria-label", label);
    fullscreenButton.title = label;
};
// Typing into a field: no letter shortcuts.
const IsTextEntry = (element) => element.isContentEditable
    || element.tagName === "TEXTAREA"
    || element.tagName === "SELECT"
    || (element.tagName === "INPUT" && !["range", "checkbox", "color", "button"].includes(element.type));
// Sliders, menus and other inputs use the arrow keys themselves.
const OwnsArrowKeys = (element) => element.tagName === "INPUT" || element.tagName === "SELECT" || element.closest("[role=menu]") !== null;
export const InitializeShortcuts = () => {
    fullscreenButton = document.getElementById("fullscreenbutton");
    if (fullscreenButton) {
        if (document.fullscreenEnabled) {
            fullscreenButton.addEventListener("click", ToggleFullscreen);
        }
        else {
            fullscreenButton.hidden = true; // e.g. iPhone Safari
        }
    }
    document.addEventListener("fullscreenchange", RenderFullscreenButton);
    RenderFullscreenButton();
    window.addEventListener("keydown", (event) => {
        if (event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        const target = event.target;
        if (IsTextEntry(target)) {
            return;
        }
        switch (event.key) {
            case "p":
            case "P":
                TogglePause();
                break;
            case "s":
            case "S":
                StopSession();
                break;
            case "f":
            case "F":
                ToggleFullscreen();
                break;
            case "z":
            case "Z":
                ToggleZen();
                break;
            case "ArrowUp":
                if (OwnsArrowKeys(target)) {
                    return;
                }
                window.dispatchEvent(new CustomEvent("Game:LeftArrowClick"));
                break;
            case "ArrowDown":
                if (OwnsArrowKeys(target)) {
                    return;
                }
                window.dispatchEvent(new CustomEvent("Game:RightArrowClick"));
                break;
            default:
                return;
        }
        event.preventDefault();
    });
};
