const yMultiplier = 2;
const Amplitude = 25;
const waveRoutineMultiplier = 0.65;
let lastPhaseAngle = 0;
export const WaveRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle * waveRoutineMultiplier));
        dot.Y = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle * yMultiplier * waveRoutineMultiplier));
        lastPhaseAngle = newPhaseAngle;
    },
    title: 'To Infinity And Beyond',
    duration: 15,
};
