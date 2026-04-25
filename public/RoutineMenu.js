import RoutineManager from "./Dot/DotRoutineManager.js";
export const SubscribeToRoutineMenu = () => {
    const trigger = document.getElementById("routine-trigger");
    const menu = document.getElementById("routine-menu");
    if (!trigger || !menu)
        return;
    BuildMenuItems(menu);
    UpdateActiveItem(menu);
    trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        ToggleMenu(trigger, menu);
    });
    menu.addEventListener("click", (event) => {
        const target = event.target.closest("li[data-routine-index]");
        if (!target)
            return;
        const index = Number(target.dataset.routineIndex);
        const routineSelected = new CustomEvent("Game:RoutineSelected", { detail: { index } });
        window.dispatchEvent(routineSelected);
        CloseMenu(trigger, menu);
    });
    document.addEventListener("mousedown", (event) => {
        if (trigger.getAttribute("aria-expanded") !== "true")
            return;
        const target = event.target;
        if (trigger.contains(target) || menu.contains(target))
            return;
        CloseMenu(trigger, menu);
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
            CloseMenu(trigger, menu);
            trigger.focus();
        }
    });
    window.addEventListener("DotRoutineManager:RoutineChanged", () => {
        UpdateActiveItem(menu);
    });
};
const BuildMenuItems = (menu) => {
    menu.innerHTML = "";
    RoutineManager.activeDotRoutines.forEach((routine, index) => {
        var _a;
        const item = document.createElement("li");
        item.setAttribute("role", "option");
        item.dataset.routineIndex = index.toString();
        item.textContent = (_a = routine === null || routine === void 0 ? void 0 : routine.title) !== null && _a !== void 0 ? _a : `Routine ${index + 1}`;
        menu.appendChild(item);
    });
};
const UpdateActiveItem = (menu) => {
    const items = menu.querySelectorAll("li[data-routine-index]");
    items.forEach(item => {
        const isActive = Number(item.dataset.routineIndex) === RoutineManager.currentRoutineIndex;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", isActive ? "true" : "false");
    });
};
const ToggleMenu = (trigger, menu) => {
    if (trigger.getAttribute("aria-expanded") === "true") {
        CloseMenu(trigger, menu);
    }
    else {
        OpenMenu(trigger, menu);
    }
};
const OpenMenu = (trigger, menu) => {
    trigger.setAttribute("aria-expanded", "true");
    menu.hidden = false;
};
const CloseMenu = (trigger, menu) => {
    trigger.setAttribute("aria-expanded", "false");
    menu.hidden = true;
};
