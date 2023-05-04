const waveSpeedMultiplier = 2;
const Amplitude = 25;
let lastPhaseAngle = 0;
export const WaveRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle));
        dot.Y = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle * waveSpeedMultiplier));
        lastPhaseAngle = newPhaseAngle;
    },
    title: 'To Infinity And Beyond',
    duration: 30,
};
