// Persists user settings to localStorage and replays them at startup.
// Listens to the same Game:* events the rest of the app dispatches, so
// no other module needs to know persistence exists.

const STORAGE_KEY = "blinkcamp.settings";

interface PersistedSettings {
    velocity?: string;
    size?: string;
    color?: string;
    shape?: string;
    zen?: boolean;
    routineUi?: string;
}

const ReadSettings = (): PersistedSettings => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const WriteSettings = (next: PersistedSettings): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        // localStorage may be unavailable (private mode, quota exceeded, etc.) — ignore.
    }
};

const UpdateSetting = <K extends keyof PersistedSettings>(key: K, value: PersistedSettings[K]): void => {
    const current = ReadSettings();
    current[key] = value;
    WriteSettings(current);
};

export const SubscribeToSettingsPersistence = (): void => {
    window.addEventListener("Game:VelocityValueChanged", (event: Event) => {
        UpdateSetting("velocity", (event as CustomEvent).detail.velocity);
    });
    window.addEventListener("Game:RadiusValueChanged", (event: Event) => {
        UpdateSetting("size", (event as CustomEvent).detail.radius);
    });
    window.addEventListener("Game:ColorValueChanged", (event: Event) => {
        UpdateSetting("color", (event as CustomEvent).detail.color);
    });
    window.addEventListener("Game:ShapeValueChanged", (event: Event) => {
        UpdateSetting("shape", (event as CustomEvent).detail.shape);
    });
    window.addEventListener("Game:ZenModeChanged", (event: Event) => {
        UpdateSetting("zen", (event as CustomEvent).detail.enabled);
    });
    window.addEventListener("Game:RoutinePickerChanged", (event: Event) => {
        UpdateSetting("routineUi", (event as CustomEvent).detail.value);
    });
};

// Re-applies saved values by mutating the form controls and dispatching
// the same events the user would, so all listeners (Dot, body class, etc.)
// react identically to the live-input case.
export const LoadAndApplySettings = (): void => {
    const saved = ReadSettings();

    ApplyInputValue("velocityslider", saved.velocity, "input");
    ApplyInputValue("sizeslider", saved.size, "input");
    ApplyInputValue("colorpicker", saved.color, "input");
    ApplyInputValue("shapeselect", saved.shape, "change");
    ApplyInputValue("routinepicker", saved.routineUi, "change");

    if (saved.zen) {
        const zen = document.getElementById("zenmode") as HTMLInputElement | null;
        if (zen) {
            zen.checked = true;
            zen.dispatchEvent(new Event("change"));
        }
    }
};

const ApplyInputValue = (id: string, value: string | undefined, eventName: string): void => {
    if (value === undefined) return;
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
    if (!el) return;
    el.value = value;
    el.dispatchEvent(new Event(eventName));
};

// Clears persisted settings and resets each control to its HTML-declared
// default. Dispatches the same input/change events a user edit would so
// every listener (Dot, body class, persistence) reacts identically.
export const ResetToDefaults = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Ignore storage errors; the visual reset below still runs.
    }

    ResetControl("velocityslider", "input");
    ResetControl("sizeslider", "input");
    ResetControl("colorpicker", "input");
    ResetControl("shapeselect", "change");
    ResetControl("routinepicker", "change");

    const zen = document.getElementById("zenmode") as HTMLInputElement | null;
    if (zen) {
        zen.checked = zen.defaultChecked;
        zen.dispatchEvent(new Event("change"));
    }
};

const ResetControl = (id: string, eventName: string): void => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
    if (!el) return;

    if (el instanceof HTMLSelectElement) {
        const defaultOption = Array.from(el.options).find(option => option.defaultSelected);
        el.value = defaultOption ? defaultOption.value : (el.options[0]?.value ?? "");
    } else {
        el.value = el.defaultValue;
    }

    el.dispatchEvent(new Event(eventName));
};
