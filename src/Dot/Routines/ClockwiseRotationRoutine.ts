import { Dot } from "../Dot";
import { IDotRoutine } from "../IDotRoutine.js";
const Amplitude = 25;
let lastPhaseAngle: number = 0;
export const ClockwiseRotationRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    const newPhaseAngle:number = dot.dTime * dot.velocity + lastPhaseAngle;
    dot.X = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle));
    dot.Y = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle));
    lastPhaseAngle = newPhaseAngle % (2 * Math.PI);
  },
  title: 'Clockwise Rotation',
  duration: 15,
};