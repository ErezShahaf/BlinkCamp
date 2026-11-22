// Routine picker: a dropdown menu of every routine, or the original previous/next arrows
// (chosen in Settings), plus Shuffle mode, which moves to a random routine after each
// routine's own duration.
import RoutineManager, { SelectRoutine } from "./Dot/DotRoutineManager.js";
import { IsSessionRunning } from "./SessionTimer.js";
import { RegisterPopover, ClosePopover, EnableMenuKeyboard } from "./Menus.js";
const storageKeys = {
    mode: "blinkcamp.pickerMode",
    shuffle: "blinkcamp.shuffle",
};
// A frame longer than this (e.g. after the tab was hidden) doesn't count towards the shuffle timer.
const maxCountedFrameSeconds = 0.25;
let mode = "dropdown";
let shuffle = false;
let secondsOnRoutine = 0;
let dock;
let menu;
let shuffleButton;
let modeButtons;
const Load = (key) => {
    try {
        return localStorage.getItem(key);
    }
    catch (_a) {
        return null;
    }
};
const Save = (key, value) => {
    try {
        localStorage.setItem(key, value);
    }
    catch ( /* storage unavailable - setting just won't persist */_a) { /* storage unavailable - setting just won't persist */ }
};
const MenuItems = () => Array.from(menu.querySelectorAll("[role=menuitemradio]"));
const UpdateMenuSelection = () => {
    MenuItems().forEach(item => {
        item.setAttribute("aria-checked", String(Number(item.dataset.index) === RoutineManager.currentRoutineIndex));
    });
};
const BuildMenu = () => {
    RoutineManager.activeDotRoutines.forEach((routine, index) => {
        const item = document.createElement("li");
        item.setAttribute("role", "none");
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("role", "menuitemradio");
        button.dataset.index = String(index);
        button.textContent = routine.title;
        button.addEventListener("click", () => {
            SelectRoutine(index);
            ClosePopover(true);
        });
        item.appendChild(button);
        menu.appendChild(item);
    });
    UpdateMenuSelection();
};
const ApplyMode = (newMode) => {
    mode = newMode;
    dock.dataset.picker = mode;
    if (mode === "arrows") {
        ClosePopover();
    }
    modeButtons.forEach(button => {
        const selected = button.dataset.mode === mode;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
};
const ApplyShuffle = (enabled) => {
    shuffle = enabled;
    secondsOnRoutine = 0;
    shuffleButton.setAttribute("aria-pressed", String(shuffle));
    shuffleButton.title = shuffle
        ? "Shuffle is on: a new random routine starts after each one finishes"
        : "Shuffle routines";
};
const PickRandomRoutine = () => {
    const count = RoutineManager.activeDotRoutines.length;
    if (count < 2) {
        return;
    }
    // Any routine except the current one.
    const offset = 1 + Math.floor(Math.random() * (count - 1));
    SelectRoutine((RoutineManager.currentRoutineIndex + offset) % count);
};
const ShuffleTick = (dTime) => {
    if (!shuffle || !IsSessionRunning()) {
        return;
    }
    secondsOnRoutine += Math.min(dTime, maxCountedFrameSeconds);
    const current = RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex];
    if (secondsOnRoutine >= current.duration) {
        PickRandomRoutine();
    }
};
export const InitializeRoutinePicker = () => {
    dock = document.querySelector(".dock");
    menu = document.getElementById("routinemenu");
    shuffleButton = document.getElementById("shufflebutton");
    modeButtons = Array.from(document.querySelectorAll(".pickermode"));
    const routineButton = document.getElementById("routinebutton");
    BuildMenu();
    EnableMenuKeyboard(menu, "[role=menuitemradio]");
    RegisterPopover(routineButton, menu, {
        canOpen: () => mode === "dropdown",
        onOpen: () => {
            const selected = menu.querySelector("[aria-checked=true]");
            selected === null || selected === void 0 ? void 0 : selected.scrollIntoView({ block: "nearest" });
            selected === null || selected === void 0 ? void 0 : selected.focus();
        },
    });
    document.getElementById("routineprev").addEventListener("click", () => window.dispatchEvent(new CustomEvent("Game:LeftArrowClick")));
    document.getElementById("routinenext").addEventListener("click", () => window.dispatchEvent(new CustomEvent("Game:RightArrowClick")));
    shuffleButton.addEventListener("click", () => {
        ApplyShuffle(!shuffle);
        Save(storageKeys.shuffle, String(shuffle));
    });
    modeButtons.forEach(button => {
        button.addEventListener("click", () => {
            ApplyMode(button.dataset.mode);
            Save(storageKeys.mode, mode);
        });
    });
    window.addEventListener("DotRoutineManager:RoutineChanged", () => {
        secondsOnRoutine = 0;
        UpdateMenuSelection();
    });
    window.addEventListener("GameLoop:Update", (event) => {
        ShuffleTick(event.detail.dTime);
    });
    window.addEventListener("Game:ResetSettings", () => {
        ApplyMode("dropdown");
        ApplyShuffle(false);
        Save(storageKeys.mode, mode);
        Save(storageKeys.shuffle, "false");
    });
    ApplyMode(Load(storageKeys.mode) === "arrows" ? "arrows" : "dropdown");
    ApplyShuffle(Load(storageKeys.shuffle) === "true");
};
