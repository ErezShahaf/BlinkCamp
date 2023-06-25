import { GetRandomNumberInBetween } from "../../Utils/NumberUtils.js";
const Amplitude = 25;
let lastPhaseAngle = 0;
let currentDirectionChangeTime = 0;
let timePassedSinceLastDirectionChange = 0;
let bHasActiveDirectionChangeTimer = false;
let currentPolarity = 1;
const minTimePerDirectionChange = 0.5;
const maxTimePerDirectionChange = 2;
export const DirectionChangingRotationsRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = currentPolarity * dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle));
        dot.Y = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle));
        lastPhaseAngle = newPhaseAngle % (2 * Math.PI);
        if (bHasActiveDirectionChangeTimer) {
            if (timePassedSinceLastDirectionChange > currentDirectionChangeTime) {
                currentPolarity *= -1;
                bHasActiveDirectionChangeTimer = false;
            }
        }
        else {
            timePassedSinceLastDirectionChange = 0;
            currentDirectionChangeTime = GetRandomNumberInBetween(minTimePerDirectionChange, maxTimePerDirectionChange);
            bHasActiveDirectionChangeTimer = true;
        }
        timePassedSinceLastDirectionChange += dot.dTime;
    },
    title: 'Direction Changing Rotations',
    duration: 15,
};
