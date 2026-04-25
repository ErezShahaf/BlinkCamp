import RoutineManager from "./Dot/DotRoutineManager.js";

export const SubscribeToRoutineMenu = (): void => {
    const trigger = document.getElementById("routine-trigger") as HTMLButtonElement | null;
    const menu = document.getElementById("routine-menu") as HTMLUListElement | null;
    if (!trigger || !menu) return;

    BuildMenuItems(menu);
    UpdateActiveItem(menu);

    trigger.addEventListener("click", (event: MouseEvent) => {
        event.stopPropagation();
        ToggleMenu(trigger, menu);
    });

    menu.addEventListener("click", (event: MouseEvent) => {
        const target = (event.target as HTMLElement).closest("li[data-routine-index]") as HTMLLIElement | null;
        if (!target) return;
        const index = Number(target.dataset.routineIndex);
        const routineSelected = new CustomEvent("Game:RoutineSelected", { detail: { index } });
        window.dispatchEvent(routineSelected);
        CloseMenu(trigger, menu);
    });

    document.addEventListener("mousedown", (event: MouseEvent) => {
        if (trigger.getAttribute("aria-expanded") !== "true") return;
        const target = event.target as Node;
        if (trigger.contains(target) || menu.contains(target)) return;
        CloseMenu(trigger, menu);
    });

    document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
            CloseMenu(trigger, menu);
            trigger.focus();
        }
    });

    window.addEventListener("DotRoutineManager:RoutineChanged", () => {
        UpdateActiveItem(menu);
    });
};

const BuildMenuItems = (menu: HTMLUListElement): void => {
    menu.innerHTML = "";
    RoutineManager.activeDotRoutines.forEach((routine, index) => {
        const item = document.createElement("li");
        item.setAttribute("role", "option");
        item.dataset.routineIndex = index.toString();
        item.textContent = routine?.title ?? `Routine ${index + 1}`;
        menu.appendChild(item);
    });
};

const UpdateActiveItem = (menu: HTMLUListElement): void => {
    const items = menu.querySelectorAll<HTMLLIElement>("li[data-routine-index]");
    items.forEach(item => {
        const isActive = Number(item.dataset.routineIndex) === RoutineManager.currentRoutineIndex;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", isActive ? "true" : "false");
    });
};

const ToggleMenu = (trigger: HTMLButtonElement, menu: HTMLUListElement): void => {
    if (trigger.getAttribute("aria-expanded") === "true") {
        CloseMenu(trigger, menu);
    } else {
        OpenMenu(trigger, menu);
    }
};

const OpenMenu = (trigger: HTMLButtonElement, menu: HTMLUListElement): void => {
    trigger.setAttribute("aria-expanded", "true");
    menu.hidden = false;
};

const CloseMenu = (trigger: HTMLButtonElement, menu: HTMLUListElement): void => {
    trigger.setAttribute("aria-expanded", "false");
    menu.hidden = true;
};
