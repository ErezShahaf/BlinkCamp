export class GameElement {
    constructor(htmlElement, gameElementInstance) {
        // Position is cached here: reading it back via getComputedStyle every frame forces style recalculation.
        this.x = NaN;
        this.y = NaN;
        this.htmlElement = htmlElement;
        this.gameElementInstance = gameElementInstance;
        window.addEventListener('GameLoop:Update', (event) => {
            const dTime = event.detail.dTime;
            this.Update(dTime);
        });
    }
    get X() {
        if (Number.isNaN(this.x)) {
            this.x = parseFloat(getComputedStyle(this.htmlElement).getPropertyValue("--x"));
        }
        return this.x;
    }
    set X(value) {
        this.x = value;
        this.htmlElement.style.setProperty("--x", value.toString());
    }
    get Y() {
        if (Number.isNaN(this.y)) {
            this.y = parseFloat(getComputedStyle(this.htmlElement).getPropertyValue("--y"));
        }
        return this.y;
    }
    set Y(value) {
        this.y = value;
        this.htmlElement.style.setProperty("--y", value.toString());
    }
    Update(dTime) {
        var _a, _b;
        (_b = (_a = this.gameElementInstance) === null || _a === void 0 ? void 0 : _a.Update) === null || _b === void 0 ? void 0 : _b.call(_a, dTime);
    }
}
