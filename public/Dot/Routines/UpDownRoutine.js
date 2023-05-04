const Amplitude = 25;
let lastPhaseAngle = 0;
export const UpDownRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen;
        dot.Y = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle));
        lastPhaseAngle = newPhaseAngle;
    },
    title: 'Yo-yo',
    duration: 15,
};
