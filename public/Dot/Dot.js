import { GameElement } from "../Engine/GameElement.js";
import "../Utils/NumberUtils.js";
import RoutineManager from "./DotRoutineManager.js";
import { GetRangeFraction } from "../Settings.js";
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
            this.ClampToScreen();
        });
        window.addEventListener('Game:RangeValueChanged', () => this.ClampToScreen());
        // Keep the dot inside the viewport when the window is resized.
        window.addEventListener('resize', () => this.ClampToScreen());
    }
    // Note: "--radius" is the dot's full width/height in vw units (see .dot in styles.css).
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
    // Half of the dot's size, in the units X is measured in (vw).
    get HalfSizeX() {
        return this.Radius / 2;
    }
    // Half of the dot's size, in the units Y is measured in (vh). The dot is sized in vw, so convert.
    get HalfSizeY() {
        return (this.Radius / 2) * (window.innerWidth / window.innerHeight);
    }
    // How far from the center the dot may travel. At a range of 100% the dot's edge just touches
    // the screen edge; lower ranges (Range slider) keep it closer to the center.
    // Recomputed every frame from the current window size, so resizing is handled automatically.
    get AmplitudeX() {
        return Math.max(0, this.halfScreen - this.HalfSizeX) * GetRangeFraction();
    }
    get AmplitudeY() {
        return Math.max(0, this.halfScreen - this.HalfSizeY) * GetRangeFraction();
    }
    get MinX() { return this.halfScreen - this.AmplitudeX; }
    get MaxX() { return this.halfScreen + this.AmplitudeX; }
    get MinY() { return this.halfScreen - this.AmplitudeY; }
    get MaxY() { return this.halfScreen + this.AmplitudeY; }
    ClampToScreen() {
        this.X = Math.min(Math.max(this.X, this.MinX), this.MaxX);
        this.Y = Math.min(Math.max(this.Y, this.MinY), this.MaxY);
    }
    Update(dTime) {
        this.dTime = dTime;
        RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].Execute(this);
    }
}
