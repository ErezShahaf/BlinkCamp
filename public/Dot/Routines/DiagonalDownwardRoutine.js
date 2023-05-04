const Amplitude = 25;
let lastPhaseAngle = 0;
export const DiagonalDownwardRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle));
        dot.Y = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle));
        lastPhaseAngle = newPhaseAngle;
    },
    title: 'Diagonal Downward',
    duration: 15,
};
