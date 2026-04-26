// Persists user settings to localStorage and replays them at startup.
// Listens to the same Game:* events the rest of the app dispatches, so
// no other module needs to know persistence exists.
const STORAGE_KEY = "blinkcamp.settings";
const ReadSettings = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    }
    catch (_a) {
        return {};
    }
};
const WriteSettings = (next) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    catch (_a) {
        // localStorage may be unavailable (private mode, quota exceeded, etc.) — ignore.
    }
};
const UpdateSetting = (key, value) => {
    const current = ReadSettings();
    current[key] = value;
    WriteSettings(current);
};
export const SubscribeToSettingsPersistence = () => {
    window.addEventListener("Game:VelocityValueChanged", (event) => {
        UpdateSetting("velocity", event.detail.velocity);
    });
    window.addEventListener("Game:RadiusValueChanged", (event) => {
        UpdateSetting("size", event.detail.radius);
    });
    window.addEventListener("Game:ColorValueChanged", (event) => {
        UpdateSetting("color", event.detail.color);
    });
    window.addEventListener("Game:ShapeValueChanged", (event) => {
        UpdateSetting("shape", event.detail.shape);
    });
    window.addEventListener("Game:ZenModeChanged", (event) => {
        UpdateSetting("zen", event.detail.enabled);
    });
    window.addEventListener("Game:RoutinePickerChanged", (event) => {
        UpdateSetting("routineUi", event.detail.value);
    });
};
// Re-applies saved values by mutating the form controls and dispatching
// the same events the user would, so all listeners (Dot, body class, etc.)
// react identically to the live-input case.
export const LoadAndApplySettings = () => {
    const saved = ReadSettings();
    ApplyInputValue("velocityslider", saved.velocity, "input");
    ApplyInputValue("sizeslider", saved.size, "input");
    ApplyInputValue("colorpicker", saved.color, "input");
    ApplyInputValue("shapeselect", saved.shape, "change");
    ApplyInputValue("routinepicker", saved.routineUi, "change");
    if (saved.zen) {
        const zen = document.getElementById("zenmode");
        if (zen) {
            zen.checked = true;
            zen.dispatchEvent(new Event("change"));
        }
    }
};
const ApplyInputValue = (id, value, eventName) => {
    if (value === undefined)
        return;
    const el = document.getElementById(id);
    if (!el)
        return;
    el.value = value;
    el.dispatchEvent(new Event(eventName));
};
// Clears persisted settings and resets each control to its HTML-declared
// default. Dispatches the same input/change events a user edit would so
// every listener (Dot, body class, persistence) reacts identically.
export const ResetToDefaults = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    }
    catch (_a) {
        // Ignore storage errors; the visual reset below still runs.
    }
    ResetControl("velocityslider", "input");
    ResetControl("sizeslider", "input");
    ResetControl("colorpicker", "input");
    ResetControl("shapeselect", "change");
    ResetControl("routinepicker", "change");
    const zen = document.getElementById("zenmode");
    if (zen) {
        zen.checked = zen.defaultChecked;
        zen.dispatchEvent(new Event("change"));
    }
};
const ResetControl = (id, eventName) => {
    var _a, _b;
    const el = document.getElementById(id);
    if (!el)
        return;
    if (el instanceof HTMLSelectElement) {
        const defaultOption = Array.from(el.options).find(option => option.defaultSelected);
        el.value = defaultOption ? defaultOption.value : ((_b = (_a = el.options[0]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "");
    }
    else {
        el.value = el.defaultValue;
    }
    el.dispatchEvent(new Event(eventName));
};
