const relativeSpawnTime = 1.7; // relative because it is also impacted by the "speed/velocity"
let relativeTimeLeft = relativeSpawnTime;
const RandomInRange = (min, max) => min + Math.random() * (max - min);
export const PeekabooRoutine = {
    Execute: function (dot) {
        relativeTimeLeft -= dot.dTime * dot.velocity;
        if (relativeTimeLeft < 0) {
            relativeTimeLeft = relativeSpawnTime;
            // Anywhere on screen, with the dot's edge allowed to touch the viewport edge.
            dot.X = RandomInRange(dot.MinX, dot.MaxX);
            dot.Y = RandomInRange(dot.MinY, dot.MaxY);
            window.dispatchEvent(new CustomEvent("Peekaboo:Jump"));
        }
    },
    title: 'Peeka-boo!',
    duration: 30,
};
