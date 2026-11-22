let lastPhaseAngle = 0;
export const ClockwiseRotationRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen + (dot.AmplitudeX * Math.cos(newPhaseAngle));
        dot.Y = dot.halfScreen + (dot.AmplitudeY * Math.sin(newPhaseAngle));
        lastPhaseAngle = newPhaseAngle % (2 * Math.PI);
    },
    title: 'Clockwise Rotation',
    duration: 15,
};
