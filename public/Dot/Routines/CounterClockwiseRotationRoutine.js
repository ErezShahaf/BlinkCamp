const Amplitude = 25;
let lastPhaseAngle = 0;
export const CounterClockwiseRotationRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle));
        dot.Y = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle));
        lastPhaseAngle = newPhaseAngle % (2 * Math.PI);
    },
    title: 'Counter Clockwise Rotation',
    duration: 15,
};
