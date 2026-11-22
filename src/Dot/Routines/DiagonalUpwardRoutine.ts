import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

let lastPhaseAngle:number = 0;
export const DiagonalUpwardRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    const newPhaseAngle:number = dot.dTime * dot.velocity + lastPhaseAngle;
    dot.X = dot.halfScreen + (-dot.AmplitudeX * Math.sin(newPhaseAngle));
    dot.Y = dot.halfScreen + (dot.AmplitudeY * Math.sin(newPhaseAngle));
    lastPhaseAngle = newPhaseAngle;
  },
  title: 'Diagonal Upward',
  duration: 15,
};