import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";
import {GetRandomNumberInBetween} from "../../Utils/NumberUtils.js"

const relativeSpawnTime:number = 1.7; // relative because it is also impacted by the "speed/velocity"
let relativeTimeLeft = relativeSpawnTime;
const maxXandY = 25;
export const PeekabooRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    relativeTimeLeft -= dot.dTime * dot.velocity;
    if(relativeTimeLeft < 0)
    {
        relativeTimeLeft = relativeSpawnTime;
        dot.X = GetRandomNumberInBetween(-maxXandY,maxXandY) + dot.halfScreen;
        dot.Y = GetRandomNumberInBetween(-maxXandY,maxXandY) + dot.halfScreen;
    }
  },
  title: 'Peeka-boo!',
  duration: 30,
};