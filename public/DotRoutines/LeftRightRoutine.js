const Amplitude = 25;
export const LeftRightRoutine = {
    Execute: function (dot) {
        dot.X = dot.halfScreen + (Amplitude * Math.sin(performance.now() / 1000 * dot.velocity));
        dot.Y = dot.halfScreen;
    },
    title: 'Left Right Left',
    duration: 15,
};
