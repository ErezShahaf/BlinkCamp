import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

const relativeSpawnTime:number = 1.7; // relative because it is also impacted by the "speed/velocity"
let relativeTimeLeft = relativeSpawnTime;

const RandomInRange = (min:number, max:number):number => min + Math.random() * (max - min);

export const PeekabooRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    relativeTimeLeft -= dot.dTime * dot.velocity;
    if(relativeTimeLeft < 0)
    {
        relativeTimeLeft = relativeSpawnTime;
        // Anywhere on screen, with the dot's edge allowed to touch the viewport edge.
        dot.X = RandomInRange(dot.MinX, dot.MaxX);
        dot.Y = RandomInRange(dot.MinY, dot.MaxY);
    }
  },
  title: 'Peeka-boo!',
  duration: 30,
};
