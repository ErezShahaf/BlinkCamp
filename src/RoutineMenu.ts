import RoutineManager from "./Dot/DotRoutineManager.js";

let trigger: HTMLButtonElement | null = null;
let menu: HTMLUListElement | null = null;
let focusedIndex: number = -1;

export const SubscribeToRoutineMenu = (): void => {
    trigger = document.getElementById("routine-trigger") as HTMLButtonElement | null;
    menu = document.getElementById("routine-menu") as HTMLUListElement | null;
    if (!trigger || !menu) return;

    BuildMenuItems();
    UpdateActiveItem();

    trigger.addEventListener("click", (event: MouseEvent) => {
        event.stopPropagation();
        ToggleMenu();
    });

    trigger.addEventListener("keydown", HandleTriggerKeydown);

    menu.addEventListener("click", (event: MouseEvent) => {
        const item = (event.target as HTMLElement).closest("li[data-routine-index]") as HTMLLIElement | null;
        if (!item) return;
        SelectIndex(Number(item.dataset.routineIndex));
    });

    menu.addEventListener("mousemove", (event: MouseEvent) => {
        const item = (event.target as HTMLElement).closest("li[data-routine-index]") as HTMLLIElement | null;
        if (!item) return;
        SetFocusedIndex(Number(item.dataset.routineIndex), false);
    });

    document.addEventListener("mousedown", (event: MouseEvent) => {
        if (!IsOpen()) return;
        const target = event.target as Node;
        if (trigger!.contains(target) || menu!.contains(target)) return;
        CloseMenu();
    });

    window.addEventListener("DotRoutineManager:RoutineChanged", () => {
        UpdateActiveItem();
    });
};

const HandleTriggerKeydown = (event: KeyboardEvent): void => {
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
            if (!open) return;
            event.preventDefault();
            SetFocusedIndex(0, true);
            return;
        case "End":
            if (!open) return;
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
            if (open) CloseMenu();
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

const FindByPrefix = (char: string): number => {
    const lower = char.toLowerCase();
    const len = RoutineManager.activeDotRoutines.length;
    const start = focusedIndex < 0 ? 0 : (focusedIndex + 1) % len;
    for (let i = 0; i < len; i++) {
        const idx = (start + i) % len;
        const title = RoutineManager.activeDotRoutines[idx]?.title ?? "";
        if (title.toLowerCase().startsWith(lower)) return idx;
    }
    return -1;
};

const SelectIndex = (index: number): void => {
    const routineSelected = new CustomEvent("Game:RoutineSelected", { detail: { index } });
    window.dispatchEvent(routineSelected);
    CloseMenu();
};

const SetFocusedIndex = (index: number, scrollIntoView: boolean): void => {
    if (!menu || !trigger) return;
    focusedIndex = index;
    const items = menu.querySelectorAll<HTMLLIElement>("li[data-routine-index]");
    items.forEach((item, i) => {
        item.classList.toggle("focused", i === index);
    });
    const focused = items[index];
    if (focused) {
        trigger.setAttribute("aria-activedescendant", focused.id);
        if (scrollIntoView) focused.scrollIntoView({ block: "nearest" });
    } else {
        trigger.removeAttribute("aria-activedescendant");
    }
};

const ClearFocusedIndex = (): void => {
    if (!menu || !trigger) return;
    focusedIndex = -1;
    menu.querySelectorAll<HTMLLIElement>("li[data-routine-index]").forEach(item => {
        item.classList.remove("focused");
    });
    trigger.removeAttribute("aria-activedescendant");
};

const ToggleMenu = (): void => {
    if (IsOpen()) CloseMenu();
    else OpenMenu();
};

const IsOpen = (): boolean => {
    return trigger?.getAttribute("aria-expanded") === "true";
};

const OpenMenu = (): void => {
    if (!trigger || !menu) return;
    trigger.setAttribute("aria-expanded", "true");
    menu.hidden = false;
    SetFocusedIndex(RoutineManager.currentRoutineIndex, true);
};

const CloseMenu = (): void => {
    if (!trigger || !menu) return;
    trigger.setAttribute("aria-expanded", "false");
    menu.hidden = true;
    ClearFocusedIndex();
};

const BuildMenuItems = (): void => {
    if (!menu) return;
    menu.innerHTML = "";
    RoutineManager.activeDotRoutines.forEach((routine, index) => {
        const item = document.createElement("li");
        item.id = `routine-option-${index}`;
        item.setAttribute("role", "option");
        item.dataset.routineIndex = index.toString();
        item.textContent = routine?.title ?? `Routine ${index + 1}`;
        menu!.appendChild(item);
    });
};

const UpdateActiveItem = (): void => {
    if (!menu) return;
    const items = menu.querySelectorAll<HTMLLIElement>("li[data-routine-index]");
    items.forEach(item => {
        const isActive = Number(item.dataset.routineIndex) === RoutineManager.currentRoutineIndex;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", isActive ? "true" : "false");
    });
};
