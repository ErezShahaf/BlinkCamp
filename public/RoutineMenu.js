import RoutineManager from "./Dot/DotRoutineManager.js";
let trigger = null;
let menu = null;
let focusedIndex = -1;
export const SubscribeToRoutineMenu = () => {
    trigger = document.getElementById("routine-trigger");
    menu = document.getElementById("routine-menu");
    if (!trigger || !menu)
        return;
    BuildMenuItems();
    UpdateActiveItem();
    trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        ToggleMenu();
    });
    trigger.addEventListener("keydown", HandleTriggerKeydown);
    menu.addEventListener("click", (event) => {
        const item = event.target.closest("li[data-routine-index]");
        if (!item)
            return;
        SelectIndex(Number(item.dataset.routineIndex));
    });
    menu.addEventListener("mousemove", (event) => {
        const item = event.target.closest("li[data-routine-index]");
        if (!item)
            return;
        SetFocusedIndex(Number(item.dataset.routineIndex), false);
    });
    document.addEventListener("mousedown", (event) => {
        if (!IsOpen())
            return;
        const target = event.target;
        if (trigger.contains(target) || menu.contains(target))
            return;
        CloseMenu();
    });
    window.addEventListener("DotRoutineManager:RoutineChanged", () => {
        UpdateActiveItem();
    });
};
const HandleTriggerKeydown = (event) => {
    const open = IsOpen();
    const lastIndex = RoutineManager.activeDotRoutines.length - 1;
    switch (event.key) {
        case "ArrowDown":
        case "Down":
            event.preventDefault();
            if (!open) {
                OpenMenu();
                return;
            }
            SetFocusedIndex(focusedIndex < lastIndex ? focusedIndex + 1 : 0, true);
            return;
        case "ArrowUp":
        case "Up":
            event.preventDefault();
            if (!open) {
                OpenMenu();
                return;
            }
            SetFocusedIndex(focusedIndex > 0 ? focusedIndex - 1 : lastIndex, true);
            return;
        case "Home":
            if (!open)
                return;
            event.preventDefault();
            SetFocusedIndex(0, true);
            return;
        case "End":
            if (!open)
                return;
            event.preventDefault();
            SetFocusedIndex(lastIndex, true);
            return;
        case "Enter":
            if (open && focusedIndex >= 0) {
                event.preventDefault();
                SelectIndex(focusedIndex);
            }
            return;
        case " ":
        case "Spacebar":
            if (open && focusedIndex >= 0) {
                event.preventDefault();
                SelectIndex(focusedIndex);
            }
            return;
        case "Escape":
        case "Esc":
            if (open) {
                event.preventDefault();
                CloseMenu();
            }
            return;
        case "Tab":
            if (open)
                CloseMenu();
            return;
        default:
            // Single-character keys: type-ahead jump to next match.
            if (open && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
                const target = FindByPrefix(event.key);
                if (target !== -1) {
                    event.preventDefault();
                    SetFocusedIndex(target, true);
                }
            }
    }
};
const FindByPrefix = (char) => {
    var _a, _b;
    const lower = char.toLowerCase();
    const len = RoutineManager.activeDotRoutines.length;
    const start = focusedIndex < 0 ? 0 : (focusedIndex + 1) % len;
    for (let i = 0; i < len; i++) {
        const idx = (start + i) % len;
        const title = (_b = (_a = RoutineManager.activeDotRoutines[idx]) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : "";
        if (title.toLowerCase().startsWith(lower))
            return idx;
    }
    return -1;
};
const SelectIndex = (index) => {
    const routineSelected = new CustomEvent("Game:RoutineSelected", { detail: { index } });
    window.dispatchEvent(routineSelected);
    CloseMenu();
};
const SetFocusedIndex = (index, scrollIntoView) => {
    if (!menu || !trigger)
        return;
    focusedIndex = index;
    const items = menu.querySelectorAll("li[data-routine-index]");
    items.forEach((item, i) => {
        item.classList.toggle("focused", i === index);
    });
    const focused = items[index];
    if (focused) {
        trigger.setAttribute("aria-activedescendant", focused.id);
        if (scrollIntoView)
            focused.scrollIntoView({ block: "nearest" });
    }
    else {
        trigger.removeAttribute("aria-activedescendant");
    }
};
const ClearFocusedIndex = () => {
    if (!menu || !trigger)
        return;
    focusedIndex = -1;
    menu.querySelectorAll("li[data-routine-index]").forEach(item => {
        item.classList.remove("focused");
    });
    trigger.removeAttribute("aria-activedescendant");
};
const ToggleMenu = () => {
    if (IsOpen())
        CloseMenu();
    else
        OpenMenu();
};
const IsOpen = () => {
    return (trigger === null || trigger === void 0 ? void 0 : trigger.getAttribute("aria-expanded")) === "true";
};
const OpenMenu = () => {
    if (!trigger || !menu)
        return;
    trigger.setAttribute("aria-expanded", "true");
    menu.hidden = false;
    SetFocusedIndex(RoutineManager.currentRoutineIndex, true);
};
const CloseMenu = () => {
    if (!trigger || !menu)
        return;
    trigger.setAttribute("aria-expanded", "false");
    menu.hidden = true;
    ClearFocusedIndex();
};
const BuildMenuItems = () => {
    if (!menu)
        return;
    menu.innerHTML = "";
    RoutineManager.activeDotRoutines.forEach((routine, index) => {
        var _a;
        const item = document.createElement("li");
        item.id = `routine-option-${index}`;
        item.setAttribute("role", "option");
        item.dataset.routineIndex = index.toString();
        item.textContent = (_a = routine === null || routine === void 0 ? void 0 : routine.title) !== null && _a !== void 0 ? _a : `Routine ${index + 1}`;
        menu.appendChild(item);
    });
};
const UpdateActiveItem = () => {
    if (!menu)
        return;
    const items = menu.querySelectorAll("li[data-routine-index]");
    items.forEach(item => {
        const isActive = Number(item.dataset.routineIndex) === RoutineManager.currentRoutineIndex;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", isActive ? "true" : "false");
    });
};
