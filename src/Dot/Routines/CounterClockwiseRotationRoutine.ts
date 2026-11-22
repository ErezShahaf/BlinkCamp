import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

let lastPhaseAngle:number = 0;
export const CounterClockwiseRotationRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    const newPhaseAngle:number = dot.dTime * dot.velocity + lastPhaseAngle;
    dot.X = dot.halfScreen + (dot.AmplitudeX * Math.sin(newPhaseAngle));
    dot.Y = dot.halfScreen + (dot.AmplitudeY * Math.cos(newPhaseAngle));
    lastPhaseAngle = newPhaseAngle % (2 * Math.PI);
  },
  title: 'Counter Clockwise Rotation',
  duration: 15,
};

