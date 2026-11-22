import { IDotRoutine } from '../IDotRoutine.js';
import { Dot } from "../Dot.js";

let lastPhaseAngle:number = 0;
export const DiagonalDownwardRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    const newPhaseAngle:number = dot.dTime * dot.velocity + lastPhaseAngle;
    dot.X = dot.halfScreen + (dot.AmplitudeX * Math.sin(newPhaseAngle));
    dot.Y = dot.halfScreen + (dot.AmplitudeY * Math.sin(newPhaseAngle));
    lastPhaseAngle = newPhaseAngle;
  },
  title: 'Diagonal Downward',
  duration: 15,
};
