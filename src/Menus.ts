// Popovers (routine menu, timer menu, settings panel): only one is open at a time,
// clicking outside closes it, and Escape closes it and returns focus to its button.

type Popover = {
    trigger: HTMLElement;
    panel: HTMLElement;
    canOpen?: () => boolean;
    onOpen?: () => void;
};

let openPopover: Popover | null = null;

const SetOpen = (popover: Popover, isOpen: boolean): void => {
    popover.panel.classList.toggle("open", isOpen);
    popover.panel.inert = !isOpen;
    popover.trigger.setAttribute("aria-expanded", String(isOpen));
};

export const IsPopoverOpen = (): boolean => openPopover !== null;

export const ClosePopover = (restoreFocus = false): boolean => {
    if (!openPopover) {
        return false;
    }
    const popover = openPopover;
    openPopover = null;
    SetOpen(popover, false);
    if (restoreFocus) {
        popover.trigger.focus();
    }
    return true;
};

const OpenPopover = (popover: Popover): void => {
    ClosePopover();
    openPopover = popover;
    SetOpen(popover, true);
    popover.onOpen?.();
};

export const RegisterPopover = (
    trigger: HTMLElement,
    panel: HTMLElement,
    options: { canOpen?: () => boolean; onOpen?: () => void } = {}
): void => {
    const popover: Popover = { trigger, panel, ...options };
    SetOpen(popover, false);
    trigger.addEventListener("click", () => {
        if (openPopover === popover) {
            ClosePopover();
        } else if (!popover.canOpen || popover.canOpen()) {
            OpenPopover(popover);
        }
    });
};

document.addEventListener("pointerdown", (event: PointerEvent) => {
    const target = event.target as Node;
    if (openPopover && !openPopover.panel.contains(target) && !openPopover.trigger.contains(target)) {
        ClosePopover();
    }
});

// Arrow-key navigation between the items of a menu.
export const EnableMenuKeyboard = (menu: HTMLElement, itemSelector: string): void => {
    menu.addEventListener("keydown", (event: KeyboardEvent) => {
        const items = Array.from(menu.querySelectorAll<HTMLElement>(itemSelector));
        const index = items.indexOf(document.activeElement as HTMLElement);
        let next = -1;
        if (event.key === "ArrowDown") { next = (index + 1) % items.length; }
        else if (event.key === "ArrowUp") { next = (index - 1 + items.length) % items.length; }
        else if (event.key === "Home") { next = 0; }
        else if (event.key === "End") { next = items.length - 1; }
        if (next >= 0) {
            event.preventDefault();
            items[next].focus();
        }
    });
};
