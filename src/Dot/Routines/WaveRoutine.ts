import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

const yMultiplier:number = 2;
const waveRoutineMultiplier:number = 0.65;
let lastPhaseAngle:number = 0;

export const WaveRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    const newPhaseAngle:number = dot.dTime * dot.velocity + lastPhaseAngle;
    dot.X = dot.halfScreen + (dot.AmplitudeX * Math.cos(newPhaseAngle * waveRoutineMultiplier));
    dot.Y = dot.halfScreen + (dot.AmplitudeY * Math.sin(newPhaseAngle * yMultiplier * waveRoutineMultiplier));
    lastPhaseAngle = newPhaseAngle;
  },
  title: 'To Infinity And Beyond',
  duration: 15,
};