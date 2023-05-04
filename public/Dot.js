import { GameElement } from "./GameElement.js";
import "./Utils/NumberUtils.js";
import RoutineManager from "./DotRoutineManager.js";
export class Dot extends GameElement {
    constructor(dotElement) {
        // Pass the parent class a reference which will then be this new object.
        let gameElementInstance = null;
        super(dotElement, gameElementInstance);
        this.velocity = 3;
        this.dTime = 0;
        this.halfScreen = 50;
        gameElementInstance = this;
        this.dotElement = dotElement;
    }
    get Radius() {
        return parseFloat(getComputedStyle(this.dotElement).getPropertyValue("--radius"));
    }
    set Radius(value) {
        this.dotElement.style.setProperty("--radius", value.toString());
    }
    Update(dTime) {
        this.dTime = dTime;
        RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].Execute(this);
    }
}
