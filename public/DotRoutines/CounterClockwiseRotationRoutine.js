const Amplitude = 25;
export const CounterClockwiseRotationRoutine = {
    Execute: function (dot) {
        dot.X = dot.halfScreen + (Amplitude * Math.sin(performance.now() / 1000 * dot.velocity));
        dot.Y = dot.halfScreen + (Amplitude * Math.cos(performance.now() / 1000 * dot.velocity));
    },
    title: 'Counter Clockwise Rotation',
    duration: 15,
};
