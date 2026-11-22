// User-adjustable settings. Remembered in localStorage (when available) so they survive a reload.

const storageKeys = {
    range: "blinkcamp.range",
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

export const InitializeSettings = (): void => {
    const rangeSlider = document.getElementById("rangeslider") as HTMLInputElement;
    const rangeLabel = document.getElementById("rangevalue")!;

    const savedRange = Number(Load(storageKeys.range));
    ApplyRange(savedRange > 0 ? savedRange : maxRangePercent, rangeSlider, rangeLabel);

    rangeSlider.addEventListener("input", () => {
        ApplyRange(Number(rangeSlider.value), rangeSlider, rangeLabel);
        Save(storageKeys.range, rangeSlider.value);
    });
};
