import { GameElement } from "../Engine/GameElement.js";
import "../Utils/NumberUtils.js";
import RoutineManager from "./DotRoutineManager.js";

export class Dot extends GameElement
{
    dotElement: HTMLElement;
    velocity:number = 3;
    dTime:number = 0;
    halfScreen:number = 50;

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
          });
          
    }

    get Radius():number 
    {
        return parseFloat(getComputedStyle(this.dotElement).getPropertyValue("--radius"));
    }

    set Radius(value:number)
    {
        this.dotElement.style.setProperty("--radius", value.toString());
    }

    Update(dTime:number):void 
    {
        this.dTime = dTime;
        RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].Execute(this);
    }
}