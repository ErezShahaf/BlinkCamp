import RoutineManager from "./Dot/DotRoutineManager.js";

const ITEM_SELECTOR = "li[data-routine-index]";

export const SubscribeToRoutineMenu = (): void => {
    const trigger = document.getElementById("routine-trigger") as HTMLButtonElement | null;
    const menu = document.getElementById("routine-menu") as HTMLUListElement | null;
    if (!trigger || !menu) return;
    new RoutineMenu(trigger, menu);
};

class RoutineMenu {
    private trigger: HTMLButtonElement;
    private menu: HTMLUListElement;
    private focusedIndex: number = -1;
    private outsideMouseDownHandler: ((event: MouseEvent) => void) | null = null;

    constructor(trigger: HTMLButtonElement, menu: HTMLUListElement) {
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
            if (item) this.SelectIndex(Number(item.dataset.routineIndex));
        });
        this.menu.addEventListener("mousemove", event => {
            const item = this.GetItemFromEvent(event);
            if (item) this.SetFocusedIndex(Number(item.dataset.routineIndex), false);
        });

        window.addEventListener("DotRoutineManager:RoutineChanged", () => this.UpdateActiveItem());
    }

    private get IsOpen(): boolean {
        return this.trigger.getAttribute("aria-expanded") === "true";
    }

    private get LastIndex(): number {
        return RoutineManager.activeDotRoutines.length - 1;
    }

    private OpenMenu(): void {
        if (this.IsOpen) return;
        this.trigger.setAttribute("aria-expanded", "true");
        this.menu.hidden = false;
        this.SetFocusedIndex(RoutineManager.currentRoutineIndex, true);
        this.AttachOutsideMouseDown();
    }

    private CloseMenu(): void {
        if (!this.IsOpen) return;
        this.trigger.setAttribute("aria-expanded", "false");
        this.menu.hidden = true;
        this.ClearFocusedIndex();
        this.DetachOutsideMouseDown();
    }

    private ToggleMenu(): void {
        if (this.IsOpen) this.CloseMenu();
        else this.OpenMenu();
    }

    private SelectIndex(index: number): void {
        const event = new CustomEvent("Game:RoutineSelected", {
            detail: { index },
        });
        window.dispatchEvent(event);
        this.CloseMenu();
    }

    private SetFocusedIndex(index: number, scrollIntoView: boolean): void {
        this.focusedIndex = index;
        const items = this.GetItems();
        items.forEach((item, i) => item.classList.toggle("focused", i === index));
        const focused = items[index];
        if (focused) {
            this.trigger.setAttribute("aria-activedescendant", focused.id);
            if (scrollIntoView) focused.scrollIntoView({ block: "nearest" });
        } else {
            this.trigger.removeAttribute("aria-activedescendant");
        }
    }

    private ClearFocusedIndex(): void {
        this.focusedIndex = -1;
        this.GetItems().forEach(item => item.classList.remove("focused"));
        this.trigger.removeAttribute("aria-activedescendant");
    }

    private GetItems(): NodeListOf<HTMLLIElement> {
        return this.menu.querySelectorAll<HTMLLIElement>(ITEM_SELECTOR);
    }

    private GetItemFromEvent(event: Event): HTMLLIElement | null {
        return (event.target as HTMLElement).closest(ITEM_SELECTOR) as HTMLLIElement | null;
    }

    private BuildMenuItems(): void {
        const items = RoutineManager.activeDotRoutines.map((routine, index) => {
            const li = document.createElement("li");
            li.id = `routine-option-${index}`;
            li.setAttribute("role", "option");
            li.dataset.routineIndex = index.toString();
            li.textContent = routine?.title ?? `Routine ${index + 1}`;
            return li;
        });
        this.menu.replaceChildren(...items);
    }

    private UpdateActiveItem(): void {
        this.GetItems().forEach(item => {
            const isActive = Number(item.dataset.routineIndex) === RoutineManager.currentRoutineIndex;
            item.classList.toggle("active", isActive);
            item.setAttribute("aria-selected", isActive ? "true" : "false");
        });
    }

    private AttachOutsideMouseDown(): void {
        if (this.outsideMouseDownHandler) return;
        this.outsideMouseDownHandler = (event: MouseEvent) => {
            const target = event.target as Node;
            if (this.trigger.contains(target) || this.menu.contains(target)) return;
            this.CloseMenu();
        };
        document.addEventListener("mousedown", this.outsideMouseDownHandler);
    }

    private DetachOutsideMouseDown(): void {
        if (!this.outsideMouseDownHandler) return;
        document.removeEventListener("mousedown", this.outsideMouseDownHandler);
        this.outsideMouseDownHandler = null;
    }

    private HandleTriggerKeydown(event: KeyboardEvent): void {
        const open = this.IsOpen;
        const last = this.LastIndex;

        switch (event.key) {
            case "ArrowDown":
            case "Down":
                event.preventDefault();
                if (!open) this.OpenMenu();
                else this.SetFocusedIndex(this.focusedIndex < last ? this.focusedIndex + 1 : 0, true);
                return;

            case "ArrowUp":
            case "Up":
                event.preventDefault();
                if (!open) this.OpenMenu();
                else this.SetFocusedIndex(this.focusedIndex > 0 ? this.focusedIndex - 1 : last, true);
                return;

            case "Home":
                if (!open) return;
                event.preventDefault();
                this.SetFocusedIndex(0, true);
                return;

            case "End":
                if (!open) return;
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
                if (open) this.CloseMenu();
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

    private IsTypeAheadKey(event: KeyboardEvent): boolean {
        return event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
    }

    private FindByPrefix(char: string): number {
        const lower = char.toLowerCase();
        const len = RoutineManager.activeDotRoutines.length;
        const start = this.focusedIndex < 0 ? 0 : (this.focusedIndex + 1) % len;
        for (let i = 0; i < len; i++) {
            const idx = (start + i) % len;
            const title = RoutineManager.activeDotRoutines[idx]?.title ?? "";
            if (title.toLowerCase().startsWith(lower)) return idx;
        }
        return -1;
    }
}
