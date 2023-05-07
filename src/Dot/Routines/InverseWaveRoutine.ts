import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

const xMultiplier:number = 2;
const Amplitude:number = 25;
const waveRoutineMultiplier:number = 0.5;
let lastPhaseAngle:number = 0;

export const InverseWaveRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    const newPhaseAngle:number = dot.dTime * dot.velocity + lastPhaseAngle;
    dot.Y = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle * waveRoutineMultiplier));
    dot.X = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle  * xMultiplier* waveRoutineMultiplier));
    lastPhaseAngle = newPhaseAngle;
  },
  title: '888哈哈',
  duration: 15,
};