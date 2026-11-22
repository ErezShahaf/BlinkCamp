import { GameElement } from "../Engine/GameElement.js";
import { IsSessionRunning } from "../SessionTimer.js";
import "../Utils/NumberUtils.js";
import RoutineManager from "./DotRoutineManager.js";
import { GetRangeFraction } from "../Settings.js";

export class Dot extends GameElement
{
    dotElement: HTMLElement;
    velocity:number = 3;
    dTime:number = 0;
    halfScreen:number = 50;
    // Cached so routines can read it every frame without forcing a style recalculation.
    private radius:number = NaN;

    constructor(dotElement:HTMLElement)
    {
        // Pass the parent class a reference which will then be this new object.
        let gameElementInstance: GameElement | null = null;
        super(dotElement, gameElementInstance);
        gameElementInstance = this;
        this.dotElement = dotElement;

        window.addEventListener('Game:VelocityValueChanged', (event: Event) => {
            this.velocity= (event as CustomEvent).detail.velocity;
          });
        
        window.addEventListener('Game:RadiusValueChanged', (event: Event) => {
            this.Radius = (event as CustomEvent).detail.radius;
            this.ClampToScreen();
          });

        window.addEventListener('Game:RangeValueChanged', () => this.ClampToScreen());

        // Keep the dot inside the viewport when the window is resized.
        window.addEventListener('resize', () => this.ClampToScreen());
    }

    // Note: "--radius" is the dot's full width/height in vw units (see .dot in styles.css).
    get Radius():number
    {
        if (Number.isNaN(this.radius))
        {
            this.radius = parseFloat(getComputedStyle(this.dotElement).getPropertyValue("--radius"));
        }
        return this.radius;
    }

    set Radius(value:number)
    {
        this.radius = Number(value);
        this.dotElement.style.setProperty("--radius", this.radius.toString());
    }

    // Half of the dot's size, in the units X is measured in (vw).
    get HalfSizeX():number
    {
        return this.Radius / 2;
    }

    // Half of the dot's size, in the units Y is measured in (vh). The dot is sized in vw, so convert.
    get HalfSizeY():number
    {
        return (this.Radius / 2) * (window.innerWidth / window.innerHeight);
    }

    // How far from the center the dot may travel. At a range of 100% the dot's edge just touches
    // the screen edge; lower ranges (Range slider) keep it closer to the center.
    // Recomputed every frame from the current window size, so resizing is handled automatically.
    get AmplitudeX():number
    {
        return Math.max(0, this.halfScreen - this.HalfSizeX) * GetRangeFraction();
    }

    get AmplitudeY():number
    {
        return Math.max(0, this.halfScreen - this.HalfSizeY) * GetRangeFraction();
    }

    get MinX():number { return this.halfScreen - this.AmplitudeX; }
    get MaxX():number { return this.halfScreen + this.AmplitudeX; }
    get MinY():number { return this.halfScreen - this.AmplitudeY; }
    get MaxY():number { return this.halfScreen + this.AmplitudeY; }

    ClampToScreen():void
    {
        this.X = Math.min(Math.max(this.X, this.MinX), this.MaxX);
        this.Y = Math.min(Math.max(this.Y, this.MinY), this.MaxY);
    }

    Update(dTime:number):void 
    {
        // Paused, or a timed session has finished: leave the dot where it is.
        if (!IsSessionRunning())
        {
            return;
        }
        this.dTime = dTime;
        RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].Execute(this);
    }
}