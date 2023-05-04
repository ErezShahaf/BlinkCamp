import { IDotRoutine } from '../IDotRoutine.js';
import { Dot } from "../Dot.js";

const Amplitude = 25;
let lastPhaseAngle:number = 0;
export const DiagonalDownwardRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    const newPhaseAngle:number = dot.dTime * dot.velocity + lastPhaseAngle;
    dot.X = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle));
    dot.Y = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle));
    lastPhaseAngle = newPhaseAngle;
  },
  title: 'Diagonal Downward',
  duration: 15,
};
