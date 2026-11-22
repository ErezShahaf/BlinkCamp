import { GameElement } from "../Engine/GameElement.js";
import "../Utils/NumberUtils.js";
import RoutineManager from "./DotRoutineManager.js";
export class Dot extends GameElement {
    constructor(dotElement) {
        // Pass the parent class a reference which will then be this new object.
        let gameElementInstance = null;
        super(dotElement, gameElementInstance);
        this.velocity = 3;
        this.dTime = 0;
        this.halfScreen = 50;
        // Cached so routines can read it every frame without forcing a style recalculation.
        this.radius = NaN;
        gameElementInstance = this;
        this.dotElement = dotElement;
        window.addEventListener('Game:VelocityValueChanged', (event) => {
            this.velocity = event.detail.velocity;
        });
        window.addEventListener('Game:RadiusValueChanged', (event) => {
            this.Radius = event.detail.radius;
        });
    }
    get Radius() {
        if (Number.isNaN(this.radius)) {
            this.radius = parseFloat(getComputedStyle(this.dotElement).getPropertyValue("--radius"));
        }
        return this.radius;
    }
    set Radius(value) {
        this.radius = Number(value);
        this.dotElement.style.setProperty("--radius", this.radius.toString());
    }
    Update(dTime) {
        this.dTime = dTime;
        RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].Execute(this);
    }
}
