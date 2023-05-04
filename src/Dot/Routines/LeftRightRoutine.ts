import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

const Amplitude = 25;
let lastPhaseAngle:number = 0;

export const LeftRightRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    const newPhaseAngle:number = dot.dTime * dot.velocity + lastPhaseAngle;
    dot.X = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle));
    dot.Y = dot.halfScreen;
    lastPhaseAngle = newPhaseAngle;
  },
  title: 'Left Right Left',
  duration: 15,
};
