const Amplitude = 25;
export const UpDownRoutine = {
    Execute: function (dot) {
        dot.X = dot.halfScreen;
        dot.Y = dot.halfScreen + (Amplitude * Math.cos(performance.now() / 1000 * dot.velocity));
    },
    title: 'Yo-yo',
    duration: 15,
};
