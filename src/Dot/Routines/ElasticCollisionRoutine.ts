import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

const randomPhaseAngleInRadians = Math.random() * 2 * Math.PI;
const elasticCollisionMultiplier = 0.17;
let velocityX:number = Math.cos(randomPhaseAngleInRadians) * elasticCollisionMultiplier;
let velocityY:number = Math.sin(randomPhaseAngleInRadians) * elasticCollisionMultiplier;
export const ElasticCollisionRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    let x = dot.X + velocityX * dot.velocity;
    let y = dot.Y + velocityY * dot.velocity;

    // Bounce when the dot's edge reaches the screen edge. Clamp to the bounds so the dot
    // never ends up partly off-screen (or stuck flipping direction outside them after a resize).
    if(y >= dot.MaxY || y <= dot.MinY)
    {
        velocityY = y >= dot.MaxY ? -Math.abs(velocityY) : Math.abs(velocityY);
        y = Math.min(Math.max(y, dot.MinY), dot.MaxY);
    }
    if(x >= dot.MaxX || x <= dot.MinX)
    {
        velocityX = x >= dot.MaxX ? -Math.abs(velocityX) : Math.abs(velocityX);
        x = Math.min(Math.max(x, dot.MinX), dot.MaxX);
    }

    dot.X = x;
    dot.Y = y;
  },
  title: 'DVD',
  duration: 30,
};
