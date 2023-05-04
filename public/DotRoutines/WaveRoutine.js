const waveSpeedMultiplier = 2;
const Amplitude = 25;
export const WaveRoutine = {
    Execute: function (dot) {
        dot.X = dot.halfScreen + (Amplitude * Math.cos(performance.now() / 1000 * dot.velocity));
        dot.Y = dot.halfScreen + (Amplitude * Math.sin(performance.now() / 1000 * dot.velocity * waveSpeedMultiplier));
    },
    title: 'To Infinity And Beyond',
    duration: 30,
};
