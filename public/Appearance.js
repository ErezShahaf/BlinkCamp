// Appearance settings: color theme, dot color and dot shape.
// Remembered in localStorage (when available) so they survive a reload.
const themes = ["classic", "midnight", "forest", "paper", "contrast"];
const shapes = ["circle", "square", "diamond", "ring"];
const storageKeys = {
    theme: "blinkcamp.theme",
    dotColor: "blinkcamp.dotColor",
    shape: "blinkcamp.dotShape",
};
const root = document.documentElement;
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
        if (value === null) {
            localStorage.removeItem(key);
        }
        else {
            localStorage.setItem(key, value);
        }
    }
    catch ( /* storage unavailable (private mode etc.) - settings just won't persist */_a) { /* storage unavailable (private mode etc.) - settings just won't persist */ }
};
const MarkSelected = (buttons, attribute, value) => {
    buttons.forEach(button => {
        const selected = button.getAttribute(attribute) === value;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
};
const ApplyTheme = (theme, swatches, colorInput) => {
    if (theme === "classic") {
        root.removeAttribute("data-theme");
    }
    else {
        root.setAttribute("data-theme", theme);
    }
    MarkSelected(swatches, "data-theme", theme);
    // Show whichever dot color is in effect: the custom one, or the theme's own.
    colorInput.value = root.style.getPropertyValue("--dot-color").trim()
        || getComputedStyle(root).getPropertyValue("--dot-color").trim();
};
const ApplyDotColor = (color) => {
    if (color) {
        root.style.setProperty("--dot-color", color);
    }
    else {
        root.style.removeProperty("--dot-color");
    }
};
const ApplyShape = (shape, dot, shapeButtons) => {
    shapes.forEach(s => dot.classList.toggle(`shape-${s}`, s === shape && s !== "circle"));
    MarkSelected(shapeButtons, "data-shape", shape);
};
export const InitializeAppearance = () => {
    const swatches = Array.from(document.querySelectorAll(".themeswatch"));
    const shapeButtons = Array.from(document.querySelectorAll(".shapebutton"));
    const colorInput = document.getElementById("dotcolor");
    const dot = document.getElementById("dot");
    // Restore saved settings.
    const savedTheme = Load(storageKeys.theme);
    const savedShape = Load(storageKeys.shape);
    ApplyDotColor(Load(storageKeys.dotColor));
    ApplyTheme(savedTheme && themes.includes(savedTheme) ? savedTheme : "classic", swatches, colorInput);
    ApplyShape(savedShape && shapes.includes(savedShape) ? savedShape : "circle", dot, shapeButtons);
    swatches.forEach(swatch => {
        swatch.addEventListener("click", () => {
            // Picking a theme also resets the dot to that theme's own color.
            ApplyDotColor(null);
            Save(storageKeys.dotColor, null);
            ApplyTheme(swatch.dataset.theme, swatches, colorInput);
            Save(storageKeys.theme, swatch.dataset.theme);
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
            ApplyShape(button.dataset.shape, dot, shapeButtons);
            Save(storageKeys.shape, button.dataset.shape);
        });
    });
};
