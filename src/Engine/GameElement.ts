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

    get X():number 
    {
        return parseFloat(getComputedStyle(this.htmlElement).getPropertyValue("--x"));
    }

    set X(value:number) 
    {
        this.htmlElement.style.setProperty("--x", value.toString());
    }

    get Y():number 
    {
        return parseFloat(getComputedStyle(this.htmlElement).getPropertyValue("--y"));
    }

    set Y(value:number) 
    {
        this.htmlElement.style.setProperty("--y", value.toString());
    }

    Update(dTime:number):void 
    {
        this.gameElementInstance?.Update?.(dTime);
    }
}