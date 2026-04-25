import RoutineManager from "./Dot/DotRoutineManager.js";
const ITEM_SELECTOR = "li[data-routine-index]";
export const SubscribeToRoutineMenu = () => {
    const trigger = document.getElementById("routine-trigger");
    const menu = document.getElementById("routine-menu");
    if (!trigger || !menu)
        return;
    new RoutineMenu(trigger, menu);
};
class RoutineMenu {
    constructor(trigger, menu) {
        this.focusedIndex = -1;
        this.outsideMouseDownHandler = null;
        this.trigger = trigger;
        this.menu = menu;
        this.BuildMenuItems();
        this.UpdateActiveItem();
        this.trigger.addEventListener("click", event => {
            event.stopPropagation();
            this.ToggleMenu();
        });
        this.trigger.addEventListener("keydown", event => this.HandleTriggerKeydown(event));
        this.menu.addEventListener("click", event => {
            const item = this.GetItemFromEvent(event);
            if (item)
                this.SelectIndex(Number(item.dataset.routineIndex));
        });
        this.menu.addEventListener("mousemove", event => {
            const item = this.GetItemFromEvent(event);
            if (item)
                this.SetFocusedIndex(Number(item.dataset.routineIndex), false);
        });
        window.addEventListener("DotRoutineManager:RoutineChanged", () => this.UpdateActiveItem());
    }
    get IsOpen() {
        return this.trigger.getAttribute("aria-expanded") === "true";
    }
    get LastIndex() {
        return RoutineManager.activeDotRoutines.length - 1;
    }
    OpenMenu() {
        if (this.IsOpen)
            return;
        this.trigger.setAttribute("aria-expanded", "true");
        this.menu.hidden = false;
        this.SetFocusedIndex(RoutineManager.currentRoutineIndex, true);
        this.AttachOutsideMouseDown();
    }
    CloseMenu() {
        if (!this.IsOpen)
            return;
        this.trigger.setAttribute("aria-expanded", "false");
        this.menu.hidden = true;
        this.ClearFocusedIndex();
        this.DetachOutsideMouseDown();
    }
    ToggleMenu() {
        if (this.IsOpen)
            this.CloseMenu();
        else
            this.OpenMenu();
    }
    SelectIndex(index) {
        const event = new CustomEvent("Game:RoutineSelected", {
            detail: { index },
        });
        window.dispatchEvent(event);
        this.CloseMenu();
    }
    SetFocusedIndex(index, scrollIntoView) {
        this.focusedIndex = index;
        const items = this.GetItems();
        items.forEach((item, i) => item.classList.toggle("focused", i === index));
        const focused = items[index];
        if (focused) {
            this.trigger.setAttribute("aria-activedescendant", focused.id);
            if (scrollIntoView)
                focused.scrollIntoView({ block: "nearest" });
        }
        else {
            this.trigger.removeAttribute("aria-activedescendant");
        }
    }
    ClearFocusedIndex() {
        this.focusedIndex = -1;
        this.GetItems().forEach(item => item.classList.remove("focused"));
        this.trigger.removeAttribute("aria-activedescendant");
    }
    GetItems() {
        return this.menu.querySelectorAll(ITEM_SELECTOR);
    }
    GetItemFromEvent(event) {
        return event.target.closest(ITEM_SELECTOR);
    }
    BuildMenuItems() {
        const items = RoutineManager.activeDotRoutines.map((routine, index) => {
            var _a;
            const li = document.createElement("li");
            li.id = `routine-option-${index}`;
            li.setAttribute("role", "option");
            li.dataset.routineIndex = index.toString();
            li.textContent = (_a = routine === null || routine === void 0 ? void 0 : routine.title) !== null && _a !== void 0 ? _a : `Routine ${index + 1}`;
            return li;
        });
        this.menu.replaceChildren(...items);
    }
    UpdateActiveItem() {
        this.GetItems().forEach(item => {
            const isActive = Number(item.dataset.routineIndex) === RoutineManager.currentRoutineIndex;
            item.classList.toggle("active", isActive);
            item.setAttribute("aria-selected", isActive ? "true" : "false");
        });
    }
    AttachOutsideMouseDown() {
        if (this.outsideMouseDownHandler)
            return;
        this.outsideMouseDownHandler = (event) => {
            const target = event.target;
            if (this.trigger.contains(target) || this.menu.contains(target))
                return;
            this.CloseMenu();
        };
        document.addEventListener("mousedown", this.outsideMouseDownHandler);
    }
    DetachOutsideMouseDown() {
        if (!this.outsideMouseDownHandler)
            return;
        document.removeEventListener("mousedown", this.outsideMouseDownHandler);
        this.outsideMouseDownHandler = null;
    }
    HandleTriggerKeydown(event) {
        const open = this.IsOpen;
        const last = this.LastIndex;
        switch (event.key) {
            case "ArrowDown":
            case "Down":
                event.preventDefault();
                if (!open)
                    this.OpenMenu();
                else
                    this.SetFocusedIndex(this.focusedIndex < last ? this.focusedIndex + 1 : 0, true);
                return;
            case "ArrowUp":
            case "Up":
                event.preventDefault();
                if (!open)
                    this.OpenMenu();
                else
                    this.SetFocusedIndex(this.focusedIndex > 0 ? this.focusedIndex - 1 : last, true);
                return;
            case "Home":
                if (!open)
                    return;
                event.preventDefault();
                this.SetFocusedIndex(0, true);
                return;
            case "End":
                if (!open)
                    return;
                event.preventDefault();
                this.SetFocusedIndex(last, true);
                return;
            case "Enter":
            case " ":
            case "Spacebar":
                if (open && this.focusedIndex >= 0) {
                    event.preventDefault();
                    this.SelectIndex(this.focusedIndex);
                }
                return;
            case "Escape":
            case "Esc":
                if (open) {
                    event.preventDefault();
                    this.CloseMenu();
                }
                return;
            case "Tab":
                if (open)
                    this.CloseMenu();
                return;
            default:
                if (open && this.IsTypeAheadKey(event)) {
                    const target = this.FindByPrefix(event.key);
                    if (target !== -1) {
                        event.preventDefault();
                        this.SetFocusedIndex(target, true);
                    }
                }
        }
    }
    IsTypeAheadKey(event) {
        return event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
    }
    FindByPrefix(char) {
        var _a, _b;
        const lower = char.toLowerCase();
        const len = RoutineManager.activeDotRoutines.length;
        const start = this.focusedIndex < 0 ? 0 : (this.focusedIndex + 1) % len;
        for (let i = 0; i < len; i++) {
            const idx = (start + i) % len;
            const title = (_b = (_a = RoutineManager.activeDotRoutines[idx]) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : "";
            if (title.toLowerCase().startsWith(lower))
                return idx;
        }
        return -1;
    }
}
