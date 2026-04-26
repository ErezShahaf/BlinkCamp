// Wires up the two ways to exit zen mode:
// - Clicking the "Exit Zen" button
// - Pressing Escape
//
// Both routes uncheck the zen-mode toggle and dispatch its `change` event so
// every other listener (body class toggle, persistence) reacts the same way
// it would to a manual click in the settings panel.

export const SubscribeToZenModeExit = (): void =>
{
    const zenToggle = document.getElementById("zenmode") as HTMLInputElement | null;
    const exitButton = document.getElementById("zen-exit") as HTMLButtonElement | null;
    if (!zenToggle) return;

    const ExitZen = (): void => {
        if (!zenToggle.checked) return;
        zenToggle.checked = false;
        zenToggle.dispatchEvent(new Event("change"));
    };

    exitButton?.addEventListener("click", ExitZen);

    window.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key !== "Escape" && event.key !== "Esc") return;
        if (!document.body.classList.contains("zen")) return;
        event.preventDefault();
        ExitZen();
    });
};
