const Amplitude = 25;
export const DiagonalDownwardRoutine = {
    Execute: function (dot) {
        dot.X = dot.halfScreen + (Amplitude * Math.sin(performance.now() / 1000 * dot.velocity));
        dot.Y = dot.halfScreen + (Amplitude * Math.sin(performance.now() / 1000 * dot.velocity));
    },
    title: 'Diagonal Downward',
    duration: 15,
};
