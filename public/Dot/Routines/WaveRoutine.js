const yMultiplier = 2;
const waveRoutineMultiplier = 0.65;
let lastPhaseAngle = 0;
export const WaveRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen + (dot.AmplitudeX * Math.cos(newPhaseAngle * waveRoutineMultiplier));
        dot.Y = dot.halfScreen + (dot.AmplitudeY * Math.sin(newPhaseAngle * yMultiplier * waveRoutineMultiplier));
        lastPhaseAngle = newPhaseAngle;
    },
    title: 'To Infinity And Beyond',
    duration: 15,
};
