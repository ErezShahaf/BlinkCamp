// Sound cues, synthesized with the Web Audio API (no audio files to load).
// The user's eyes are on the dot, so sound tells them what happened without looking at the controls.
//
//   Session end only (default): a calm chime when a timed session finishes.
//   All cues: also session start, "one minute left" and Shuffle switching routines.
//   Peek-a-boo clicks (opt-in): a tiny click each time the dot jumps.
//
// The completion card still appears, so sound is never the only signal.
const storageKeys = {
    mode: "blinkcamp.soundMode",
    volume: "blinkcamp.soundVolume",
    peekaboo: "blinkcamp.peekabooClicks",
};
const defaults = {
    mode: "end",
    volume: 70,
    peekaboo: false,
};
let mode = defaults.mode;
let volumePercent = defaults.volume;
let peekabooClicks = defaults.peekaboo;
let context = null;
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
// Browsers only allow audio after the user has interacted with the page, so the context is
// created (or resumed) on the first click or key press. Starting a timed session counts.
const GetContext = () => {
    if (!context) {
        const AudioContextClass = window.AudioContext
            || window.webkitAudioContext;
        if (!AudioContextClass) {
            return null;
        }
        context = new AudioContextClass();
    }
    if (context.state === "suspended") {
        context.resume();
    }
    return context;
};
// One note with a soft attack and a natural decay.
const Tone = (ac, output, frequency, start, duration, peak, type = "sine") => {
    const oscillator = ac.createOscillator();
    const gain = ac.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
};
// A bell-like note: the fundamental plus two quieter, faster-fading overtones.
const Bell = (ac, output, frequency, start, duration, peak) => {
    Tone(ac, output, frequency, start, duration, peak);
    Tone(ac, output, frequency * 2.76, start, duration * 0.45, peak * 0.16);
    Tone(ac, output, frequency * 5.4, start, duration * 0.2, peak * 0.05);
};
const notes = { C5: 523.25, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, G6: 1567.98, A6: 1760 };
export const PlayCue = (cue) => {
    const ac = GetContext();
    if (!ac || volumePercent <= 0) {
        return;
    }
    const output = ac.createGain();
    // Perceived loudness is roughly logarithmic, so square the slider value.
    output.gain.value = Math.pow(volumePercent / 100, 2);
    output.connect(ac.destination);
    const t = ac.currentTime + 0.02;
    switch (cue) {
        case "complete": // calm rising arpeggio, resolving on a high C
            Bell(ac, output, notes.C5, t, 1.6, 0.32);
            Bell(ac, output, notes.E5, t + 0.18, 1.6, 0.28);
            Bell(ac, output, notes.G5, t + 0.36, 1.8, 0.26);
            Bell(ac, output, notes.C6, t + 0.6, 2.4, 0.2);
            break;
        case "start": // single soft note
            Bell(ac, output, notes.G5, t, 0.7, 0.2);
            break;
        case "oneMinute": // two gentle notes
            Bell(ac, output, notes.A5, t, 0.5, 0.18);
            Bell(ac, output, notes.A5, t + 0.22, 0.6, 0.16);
            break;
        case "shuffle": // quiet wooden "tock"
            Tone(ac, output, notes.C6, t, 0.14, 0.14);
            Tone(ac, output, notes.G6, t, 0.07, 0.05);
            break;
        case "peekaboo": // tiny click
            Tone(ac, output, notes.A6, t, 0.045, 0.06, "triangle");
            break;
    }
};
const ShouldPlay = (cue) => {
    if (mode === "off") {
        return false;
    }
    if (cue === "complete") {
        return true;
    }
    if (cue === "peekaboo") {
        return peekabooClicks;
    }
    return mode === "all";
};
export const InitializeSound = () => {
    const modeButtons = Array.from(document.querySelectorAll(".soundmode"));
    const volumeSlider = document.getElementById("soundvolume");
    const volumeLabel = document.getElementById("soundvolumevalue");
    const peekabooToggle = document.getElementById("peekabooclicks");
    const testButton = document.getElementById("soundtest");
    const dependentFields = Array.from(document.querySelectorAll(".soundonly"));
    const Render = () => {
        modeButtons.forEach(button => {
            const selected = button.dataset.mode === mode;
            button.classList.toggle("selected", selected);
            button.setAttribute("aria-pressed", String(selected));
        });
        if (volumeSlider) {
            volumeSlider.value = String(volumePercent);
        }
        if (volumeLabel) {
            volumeLabel.textContent = `${volumePercent}%`;
        }
        if (peekabooToggle) {
            peekabooToggle.checked = peekabooClicks;
        }
        // Volume and Peek-a-boo clicks do nothing while sound is off.
        dependentFields.forEach(field => {
            field.classList.toggle("disabled", mode === "off");
            field.querySelectorAll("input").forEach(input => { input.disabled = mode === "off"; });
        });
    };
    // Restore saved settings.
    const savedMode = Load(storageKeys.mode);
    mode = savedMode === "off" || savedMode === "all" || savedMode === "end" ? savedMode : defaults.mode;
    const savedVolume = Load(storageKeys.volume);
    volumePercent = savedVolume !== null && !Number.isNaN(Number(savedVolume)) ? Number(savedVolume) : defaults.volume;
    peekabooClicks = Load(storageKeys.peekaboo) === "true";
    Render();
    modeButtons.forEach(button => {
        button.addEventListener("click", () => {
            mode = button.dataset.mode;
            Save(storageKeys.mode, mode);
            Render();
        });
    });
    volumeSlider === null || volumeSlider === void 0 ? void 0 : volumeSlider.addEventListener("input", () => {
        volumePercent = Number(volumeSlider.value);
        Save(storageKeys.volume, String(volumePercent));
        Render();
    });
    // Let people hear the new level when they let go of the slider.
    volumeSlider === null || volumeSlider === void 0 ? void 0 : volumeSlider.addEventListener("change", () => PlayCue("start"));
    peekabooToggle === null || peekabooToggle === void 0 ? void 0 : peekabooToggle.addEventListener("change", () => {
        peekabooClicks = peekabooToggle.checked;
        Save(storageKeys.peekaboo, String(peekabooClicks));
    });
    // The test always plays (even when sound is off), so people can preview the chime.
    testButton === null || testButton === void 0 ? void 0 : testButton.addEventListener("click", () => PlayCue("complete"));
    const On = (eventName, cue) => {
        window.addEventListener(eventName, () => {
            if (ShouldPlay(cue)) {
                PlayCue(cue);
            }
        });
    };
    On("Session:Complete", "complete");
    On("Session:Started", "start");
    On("Session:OneMinuteLeft", "oneMinute");
    On("Shuffle:RoutineChanged", "shuffle");
    On("Peekaboo:Jump", "peekaboo");
    window.addEventListener("Game:ResetSettings", () => {
        mode = defaults.mode;
        volumePercent = defaults.volume;
        peekabooClicks = defaults.peekaboo;
        Save(storageKeys.mode, mode);
        Save(storageKeys.volume, String(volumePercent));
        Save(storageKeys.peekaboo, String(peekabooClicks));
        Render();
    });
    // Unlock audio on the first interaction so the end chime can play later.
    const Unlock = () => { GetContext(); };
    window.addEventListener("pointerdown", Unlock, { once: true, capture: true });
    window.addEventListener("keydown", Unlock, { once: true, capture: true });
};
