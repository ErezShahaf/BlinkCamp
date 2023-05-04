import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

const Amplitude = 25;
let lastPhaseAngle:number = 0;
export const CounterClockwiseRotationRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    const newPhaseAngle:number = dot.dTime * dot.velocity + lastPhaseAngle;
    dot.X = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle));
    dot.Y = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle));
    lastPhaseAngle = newPhaseAngle % (2 * Math.PI);
  },
  title: 'Counter Clockwise Rotation',
  duration: 15,
};

