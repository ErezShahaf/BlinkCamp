import { IGameElement } from "./IGameElement.js";
export abstract class GameElement implements IGameElement
{
    gameElementInstance: GameElement | null;
    htmlElement: HTMLElement;
    // Position is cached in JS state so reading X/Y doesn't trigger a forced
    // synchronous layout via getComputedStyle every frame. Writes update
    // both the field and the matching CSS variable.
    private _x: number;
    private _y: number;

    constructor(htmlElement:HTMLElement, gameElementInstance: GameElement | null)
    {
        this.htmlElement = htmlElement;
        this.gameElementInstance = gameElementInstance;

        // Seed the cache from the CSS-declared defaults (or any inline style
        // already applied) so initial reads match what's painted.
        const initialX = parseFloat(getComputedStyle(htmlElement).getPropertyValue("--x"));
        const initialY = parseFloat(getComputedStyle(htmlElement).getPropertyValue("--y"));
        this._x = isNaN(initialX) ? 50 : initialX;
        this._y = isNaN(initialY) ? 50 : initialY;

        window.addEventListener('GameLoop:Update', (event: Event) => {
            const dTime = (event as CustomEvent).detail.dTime;
            this.Update(dTime);
          });
    }

    get X():number 
    {
        return this._x;
    }

    set X(value:number) 
    {
        this._x = value;
        this.htmlElement.style.setProperty("--x", value.toString());
    }

    get Y():number 
    {
        return this._y;
    }

    set Y(value:number) 
    {
        this._y = value;
        this.htmlElement.style.setProperty("--y", value.toString());
    }

    Update(dTime:number):void 
    {
        this.gameElementInstance?.Update?.(dTime);
    }
}