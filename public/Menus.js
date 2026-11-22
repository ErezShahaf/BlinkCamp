// Popovers (routine menu, timer menu, settings panel): only one is open at a time,
// clicking outside closes it, and Escape closes it and returns focus to its button.
let openPopover = null;
const SetOpen = (popover, isOpen) => {
    popover.panel.classList.toggle("open", isOpen);
    popover.panel.inert = !isOpen;
    popover.trigger.setAttribute("aria-expanded", String(isOpen));
};
export const ClosePopover = (restoreFocus = false) => {
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
const OpenPopover = (popover) => {
    var _a;
    ClosePopover();
    openPopover = popover;
    SetOpen(popover, true);
    (_a = popover.onOpen) === null || _a === void 0 ? void 0 : _a.call(popover);
};
export const RegisterPopover = (trigger, panel, options = {}) => {
    const popover = Object.assign({ trigger, panel }, options);
    SetOpen(popover, false);
    trigger.addEventListener("click", () => {
        if (openPopover === popover) {
            ClosePopover();
        }
        else if (!popover.canOpen || popover.canOpen()) {
            OpenPopover(popover);
        }
    });
};
document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (openPopover && !openPopover.panel.contains(target) && !openPopover.trigger.contains(target)) {
        ClosePopover();
    }
});
// Arrow-key navigation between the items of a menu.
export const EnableMenuKeyboard = (menu, itemSelector) => {
    menu.addEventListener("keydown", (event) => {
        const items = Array.from(menu.querySelectorAll(itemSelector));
        const index = items.indexOf(document.activeElement);
        let next = -1;
        if (event.key === "ArrowDown") {
            next = (index + 1) % items.length;
        }
        else if (event.key === "ArrowUp") {
            next = (index - 1 + items.length) % items.length;
        }
        else if (event.key === "Home") {
            next = 0;
        }
        else if (event.key === "End") {
            next = items.length - 1;
        }
        if (next >= 0) {
            event.preventDefault();
            items[next].focus();
        }
    });
};
