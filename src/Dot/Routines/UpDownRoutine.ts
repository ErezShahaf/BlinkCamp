import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

const Amplitude = 25;
let lastPhaseAngle:number = 0;
export const UpDownRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    const newPhaseAngle:number = dot.dTime * dot.velocity + lastPhaseAngle;
    dot.X = dot.halfScreen;
    dot.Y = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle));
    lastPhaseAngle = newPhaseAngle;
  },
  title: 'Yo-yo',
  duration: 15,
};
