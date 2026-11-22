// Settings panel: movement settings (speed, size, range) and the "Reset to defaults" button.
// Settings are remembered in localStorage (when available) so they survive a reload.

import { RegisterPopover, ClosePopover } from "./Menus.js";

const storageKeys = {
    range: "blinkcamp.range",
    speed: "blinkcamp.speed",
    size: "blinkcamp.size",
};

const defaults = {
    range: 100,
    speed: 3,
    size: 2,
};

const minRangePercent = 20;
const maxRangePercent = 100;

// Fraction (0.2 - 1) of the available travel distance the dot uses. 1 = edge to edge.
let rangeFraction = 1;

export const GetRangeFraction = (): number => rangeFraction;

const Load = (key: string): string | null => {
    try { return localStorage.getItem(key); } catch { return null; }
};

const Save = (key: string, value: string): void => {
    try { localStorage.setItem(key, value); } catch { /* storage unavailable (private mode etc.) - settings just won't persist */ }
};

const ApplyRange = (percent: number, slider: HTMLInputElement, label: HTMLElement): void => {
    const clamped = Math.min(maxRangePercent, Math.max(minRangePercent, Math.round(percent)));
    rangeFraction = clamped / 100;
    slider.value = String(clamped);
    label.textContent = `${clamped}%`;
    window.dispatchEvent(new CustomEvent("Game:RangeValueChanged"));
};

// Speed and size sliders already notify the game on "input"; setting a value goes through the same path.
const SetSlider = (slider: HTMLInputElement, value: number): void => {
    slider.value = String(value);
    slider.dispatchEvent(new Event("input"));
};

const RememberSlider = (slider: HTMLInputElement, key: string): void => {
    const saved = Number(Load(key));
    if (saved > 0) {
        SetSlider(slider, saved);
    }
    slider.addEventListener("input", () => Save(key, slider.value));
};

export const InitializeSettings = (): void => {
    const rangeSlider = document.getElementById("rangeslider") as HTMLInputElement;
    const rangeLabel = document.getElementById("rangevalue")!;
    const speedSlider = document.getElementById("velocityslider") as HTMLInputElement;
    const sizeSlider = document.getElementById("sizeslider") as HTMLInputElement;

    const savedRange = Number(Load(storageKeys.range));
    ApplyRange(savedRange > 0 ? savedRange : maxRangePercent, rangeSlider, rangeLabel);

    rangeSlider.addEventListener("input", () => {
        ApplyRange(Number(rangeSlider.value), rangeSlider, rangeLabel);
        Save(storageKeys.range, rangeSlider.value);
    });

    RememberSlider(speedSlider, storageKeys.speed);
    RememberSlider(sizeSlider, storageKeys.size);

    window.addEventListener("Game:ResetSettings", () => {
        SetSlider(speedSlider, defaults.speed);
        SetSlider(sizeSlider, defaults.size);
        ApplyRange(defaults.range, rangeSlider, rangeLabel);
        Save(storageKeys.range, String(defaults.range));
    });

    const panel = document.getElementById("settingspanel");
    const settingsButton = document.getElementById("settingsbutton");
    if (panel && settingsButton) {
        RegisterPopover(settingsButton, panel, {
            onOpen: () => panel.querySelector<HTMLElement>("input, button:not(#settingsclose)")?.focus(),
        });
        document.getElementById("settingsclose")?.addEventListener("click", () => ClosePopover(true));
    }

    // Every settings module listens for Game:ResetSettings and restores its own defaults.
    const resetButton = document.getElementById("resetsettings");
    if (resetButton) {
        const label = resetButton.querySelector(".label") ?? resetButton;
        const originalText = label.textContent;
        let restoreTimer: number | undefined;
        resetButton.addEventListener("click", () => {
            window.dispatchEvent(new CustomEvent("Game:ResetSettings"));
            label.textContent = "Defaults restored";
            resetButton.classList.add("done");
            window.clearTimeout(restoreTimer);
            restoreTimer = window.setTimeout(() => {
                label.textContent = originalText;
                resetButton.classList.remove("done");
            }, 1800);
        });
    }
};
