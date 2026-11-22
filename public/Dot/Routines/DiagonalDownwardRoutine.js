let lastPhaseAngle = 0;
export const DiagonalDownwardRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen + (dot.AmplitudeX * Math.sin(newPhaseAngle));
        dot.Y = dot.halfScreen + (dot.AmplitudeY * Math.sin(newPhaseAngle));
        lastPhaseAngle = newPhaseAngle;
    },
    title: 'Diagonal Downward',
    duration: 15,
};
