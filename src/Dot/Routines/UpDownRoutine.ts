import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

let lastPhaseAngle:number = 0;
export const UpDownRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    const newPhaseAngle:number = dot.dTime * dot.velocity + lastPhaseAngle;
    dot.X = dot.halfScreen;
    dot.Y = dot.halfScreen + (dot.AmplitudeY * Math.cos(newPhaseAngle));
    lastPhaseAngle = newPhaseAngle;
  },
  title: 'Yo-yo',
  duration: 15,
};
