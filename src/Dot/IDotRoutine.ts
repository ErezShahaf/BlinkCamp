import { Dot } from "./Dot.js";

export interface IDotRoutine
{
    Execute(dot:Dot):void;
    title:string;
    duration:number;
}