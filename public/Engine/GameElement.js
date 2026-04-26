export class GameElement {
    constructor(htmlElement, gameElementInstance) {
        this.htmlElement = htmlElement;
        this.gameElementInstance = gameElementInstance;
        // Seed the cache from the CSS-declared defaults (or any inline style
        // already applied) so initial reads match what's painted.
        const initialX = parseFloat(getComputedStyle(htmlElement).getPropertyValue("--x"));
        const initialY = parseFloat(getComputedStyle(htmlElement).getPropertyValue("--y"));
        this._x = isNaN(initialX) ? 50 : initialX;
        this._y = isNaN(initialY) ? 50 : initialY;
        window.addEventListener('GameLoop:Update', (event) => {
            const dTime = event.detail.dTime;
            this.Update(dTime);
        });
    }
    get X() {
        return this._x;
    }
    set X(value) {
        this._x = value;
        this.htmlElement.style.setProperty("--x", value.toString());
    }
    get Y() {
        return this._y;
    }
    set Y(value) {
        this._y = value;
        this.htmlElement.style.setProperty("--y", value.toString());
    }
    Update(dTime) {
        var _a, _b;
        (_b = (_a = this.gameElementInstance) === null || _a === void 0 ? void 0 : _a.Update) === null || _b === void 0 ? void 0 : _b.call(_a, dTime);
    }
}
