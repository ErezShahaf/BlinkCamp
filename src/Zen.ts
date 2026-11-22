// Zen mode hides everything except the dot. Leave with Escape or the "Exit Zen" button.
// While in Zen, the exit button and the mouse cursor fade out after a moment without movement.

import { ClosePopover } from "./Menus.js";

const idleDelayMs = 2000;

let isZen = false;
let idleTimer: number | undefined;
let exitButton: HTMLButtonElement;
let zenButton: HTMLButtonElement;

const WakeUp = (): void => {
    document.body.classList.remove("idle");
    window.clearTimeout(idleTimer);
    if (isZen) {
        idleTimer = window.setTimeout(() => document.body.classList.add("idle"), idleDelayMs);
    }
};

const EnterZen = (): void => {
    ClosePopover();
    isZen = true;
    document.body.classList.add("zen");
    exitButton.inert = false;
    WakeUp();
};

const ExitZen = (): void => {
    isZen = false;
    document.body.classList.remove("zen", "idle");
    window.clearTimeout(idleTimer);
    exitButton.inert = true;
    zenButton.focus({ preventScroll: true });
};

export const InitializeZen = (): void => {
    zenButton = document.getElementById("zenbutton") as HTMLButtonElement;
    exitButton = document.getElementById("zenexit") as HTMLButtonElement;
    exitButton.inert = true;

    zenButton.addEventListener("click", EnterZen);
    exitButton.addEventListener("click", ExitZen);

    window.addEventListener("pointermove", WakeUp);

    // Escape closes an open menu first; otherwise it leaves Zen.
    window.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key !== "Escape") {
            return;
        }
        if (ClosePopover(true)) {
            return;
        }
        if (isZen) {
            ExitZen();
        }
    });
};
