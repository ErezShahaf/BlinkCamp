export class GameElement {
    constructor(htmlElement, gameElementInstance) {
        this.htmlElement = htmlElement;
        this.gameElementInstance = gameElementInstance;
        window.addEventListener('GameLoop:Update', (event) => {
            const dTime = event.detail.dTime;
            this.Update(dTime);
        });
    }
    get X() {
        return parseFloat(getComputedStyle(this.htmlElement).getPropertyValue("--x"));
    }
    set X(value) {
        this.htmlElement.style.setProperty("--x", value.toString());
    }
    get Y() {
        return parseFloat(getComputedStyle(this.htmlElement).getPropertyValue("--y"));
    }
    set Y(value) {
        this.htmlElement.style.setProperty("--y", value.toString());
    }
    Update(dTime) {
        var _a, _b;
        (_b = (_a = this.gameElementInstance) === null || _a === void 0 ? void 0 : _a.Update) === null || _b === void 0 ? void 0 : _b.call(_a, dTime);
    }
}
