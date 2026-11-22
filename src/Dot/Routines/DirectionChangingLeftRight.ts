import { Dot } from "../Dot";
import { IDotRoutine } from "../IDotRoutine.js";
import { GetRandomNumberInBetween } from "../../Utils/NumberUtils.js";

let lastPhaseAngle: number = 0;

let currentDirectionChangeTime: number = 0;
let timePassedSinceLastDirectionChange: number = 0;
let bHasActiveDirectionChangeTimer: boolean = false; 
type DirectionChangePolarity = 1 | -1;
let currentPolarity:DirectionChangePolarity = 1;
const minTimePerDirectionChange: number = 0.5;
const maxTimePerDirectionChange: number = 2;

export const DirectionChangingLeftRight : IDotRoutine = {
  Execute: function(dot: Dot) {
    const newPhaseAngle:number = currentPolarity * dot.dTime * dot.velocity + lastPhaseAngle;
    dot.X = dot.halfScreen + (dot.AmplitudeX * Math.cos(newPhaseAngle));
    dot.Y = dot.halfScreen;
    lastPhaseAngle = newPhaseAngle;

    if(bHasActiveDirectionChangeTimer)
    { 
        if(timePassedSinceLastDirectionChange > currentDirectionChangeTime)
        {
            currentPolarity *= -1;
            bHasActiveDirectionChangeTimer = false;
        }
    }
    else
    {
        timePassedSinceLastDirectionChange = 0;
        currentDirectionChangeTime = GetRandomNumberInBetween(minTimePerDirectionChange,maxTimePerDirectionChange);
        bHasActiveDirectionChangeTimer = true;
    }
    timePassedSinceLastDirectionChange += dot.dTime;
  },
  title: 'Direction Changing Horizontal',
  duration: 15,
};
