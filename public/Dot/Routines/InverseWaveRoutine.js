const xMultiplier = 2;
const Amplitude = 25;
const waveRoutineMultiplier = 0.5;
let lastPhaseAngle = 0;
export const InverseWaveRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.Y = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle * waveRoutineMultiplier));
        dot.X = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle * xMultiplier * waveRoutineMultiplier));
        lastPhaseAngle = newPhaseAngle;
    },
    title: '888哈哈',
    duration: 15,
};
