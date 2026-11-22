let lastPhaseAngle = 0;
export const LeftRightRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen + (dot.AmplitudeX * Math.cos(newPhaseAngle));
        dot.Y = dot.halfScreen;
        lastPhaseAngle = newPhaseAngle;
    },
    title: 'Left Right Left',
    duration: 15,
};
