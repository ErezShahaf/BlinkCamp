const Amplitude = 25;
export const DiagonalUpwardRoutine = {
    Execute: function (dot) {
        dot.X = dot.halfScreen + (Amplitude * -Math.sin(performance.now() / 1000 * dot.velocity));
        dot.Y = dot.halfScreen + (Amplitude * Math.sin(performance.now() / 1000 * dot.velocity));
    },
    title: 'Diagonal Upward',
    duration: 15,
};
