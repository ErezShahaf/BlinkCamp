import { IGameElement } from "./IGameElement.js";
export abstract class GameElement implements IGameElement
{
    gameElementInstance: GameElement | null;
    htmlElement: HTMLElement;
    constructor(htmlElement:HTMLElement, gameElementInstance: GameElement | null)
    {
        this.htmlElement = htmlElement;
        this.gameElementInstance = gameElementInstance;
        window.addEventListener('GameLoop:Update', (event: Event) => {
            const dTime = (event as CustomEvent).detail.dTime;
            this.Update(dTime);
          });
    }

    // Position is cached here: reading it back via getComputedStyle every frame forces style recalculation.
    private x:number = NaN;
    private y:number = NaN;

    get X():number 
    {
        if (Number.isNaN(this.x))
        {
            this.x = parseFloat(getComputedStyle(this.htmlElement).getPropertyValue("--x"));
        }
        return this.x;
    }

    set X(value:number) 
    {
        this.x = value;
        this.htmlElement.style.setProperty("--x", value.toString());
    }

    get Y():number 
    {
        if (Number.isNaN(this.y))
        {
            this.y = parseFloat(getComputedStyle(this.htmlElement).getPropertyValue("--y"));
        }
        return this.y;
    }

    set Y(value:number) 
    {
        this.y = value;
        this.htmlElement.style.setProperty("--y", value.toString());
    }

    Update(dTime:number):void 
    {
        this.gameElementInstance?.Update?.(dTime);
    }
}