import { ResetToDefaults } from "./SettingsStore.js";

export const SubscribeToSettingsToggle = (): void =>
{
    const trigger = document.getElementById("settings-trigger") as HTMLButtonElement | null;
    const body = document.getElementById("settings-body") as HTMLDivElement | null;
    if (!trigger || !body) return;

    const SetOpen = (open: boolean): void => {
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
        body.hidden = !open;
    };

    trigger.addEventListener("click", () => {
        SetOpen(trigger.getAttribute("aria-expanded") !== "true");
    });

    window.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key !== "Escape" && event.key !== "Esc") return;
        // Zen mode exit takes priority — defer to ZenMode.ts when it's active.
        if (document.body.classList.contains("zen")) return;
        if (trigger.getAttribute("aria-expanded") !== "true") return;
        event.preventDefault();
        const wasFocusInPanel = body.contains(document.activeElement);
        SetOpen(false);
        if (wasFocusInPanel) trigger.focus();
    });
}

export const SubscribeToResetButton = (): void =>
{
    const button = document.getElementById("reset-defaults") as HTMLButtonElement | null;
    if (!button) return;

    button.addEventListener("click", () => {
        ResetToDefaults();
    });
}
