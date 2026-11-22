// Appearance settings: color theme, dot color and dot shape.
// Remembered in localStorage (when available) so they survive a reload.

const themes = ["classic", "midnight", "forest", "paper", "contrast"] as const;
type Theme = typeof themes[number];

const shapes = ["circle", "square", "diamond", "ring"] as const;
type Shape = typeof shapes[number];

const storageKeys = {
    theme: "blinkcamp.theme",
    dotColor: "blinkcamp.dotColor",
    shape: "blinkcamp.dotShape",
};

const root = document.documentElement;

const Load = (key: string): string | null => {
    try { return localStorage.getItem(key); } catch { return null; }
};

const Save = (key: string, value: string | null): void => {
    try {
        if (value === null) { localStorage.removeItem(key); } else { localStorage.setItem(key, value); }
    } catch { /* storage unavailable (private mode etc.) - settings just won't persist */ }
};

const MarkSelected = (buttons: HTMLButtonElement[], attribute: string, value: string): void => {
    buttons.forEach(button => {
        const selected = button.getAttribute(attribute) === value;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
};

const ApplyTheme = (theme: Theme, swatches: HTMLButtonElement[], colorInput: HTMLInputElement): void => {
    if (theme === "classic") { root.removeAttribute("data-theme"); } else { root.setAttribute("data-theme", theme); }
    MarkSelected(swatches, "data-theme", theme);
    // Show whichever dot color is in effect: the custom one, or the theme's own.
    colorInput.value = root.style.getPropertyValue("--dot-color").trim()
        || getComputedStyle(root).getPropertyValue("--dot-color").trim();
};

const ApplyDotColor = (color: string | null): void => {
    if (color) { root.style.setProperty("--dot-color", color); } else { root.style.removeProperty("--dot-color"); }
};

const ApplyShape = (shape: Shape, dot: HTMLElement, shapeButtons: HTMLButtonElement[]): void => {
    shapes.forEach(s => dot.classList.toggle(`shape-${s}`, s === shape && s !== "circle"));
    MarkSelected(shapeButtons, "data-shape", shape);
};

export const InitializeAppearance = (): void => {
    const swatches = Array.from(document.querySelectorAll<HTMLButtonElement>(".themeswatch"));
    const shapeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".shapebutton"));
    const colorInput = document.getElementById("dotcolor") as HTMLInputElement;
    const dot = document.getElementById("dot")!;

    // Restore saved settings.
    const savedTheme = Load(storageKeys.theme) as Theme | null;
    const savedShape = Load(storageKeys.shape) as Shape | null;
    ApplyDotColor(Load(storageKeys.dotColor));
    ApplyTheme(savedTheme && themes.includes(savedTheme) ? savedTheme : "classic", swatches, colorInput);
    ApplyShape(savedShape && shapes.includes(savedShape) ? savedShape : "circle", dot, shapeButtons);

    swatches.forEach(swatch => {
        swatch.addEventListener("click", () => {
            // Picking a theme also resets the dot to that theme's own color.
            ApplyDotColor(null);
            Save(storageKeys.dotColor, null);
            ApplyTheme(swatch.dataset.theme as Theme, swatches, colorInput);
            Save(storageKeys.theme, swatch.dataset.theme!);
        });
    });

    window.addEventListener("Game:ResetSettings", () => {
        ApplyDotColor(null);
        ApplyTheme("classic", swatches, colorInput);
        ApplyShape("circle", dot, shapeButtons);
        Save(storageKeys.dotColor, null);
        Save(storageKeys.theme, "classic");
        Save(storageKeys.shape, "circle");
    });

    colorInput.addEventListener("input", () => {
        ApplyDotColor(colorInput.value);
        Save(storageKeys.dotColor, colorInput.value);
    });

    shapeButtons.forEach(button => {
        button.addEventListener("click", () => {
            ApplyShape(button.dataset.shape as Shape, dot, shapeButtons);
            Save(storageKeys.shape, button.dataset.shape!);
        });
    });
};
