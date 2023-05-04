import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

const randomPhaseAngleInRadians = Math.random() * 2 * Math.PI;
const elasticCollisionMultiplier = 0.2;
let velocityX:number = Math.cos(randomPhaseAngleInRadians) * elasticCollisionMultiplier;
let velocityY:number = Math.sin(randomPhaseAngleInRadians) * elasticCollisionMultiplier;
export const ElasticCollisionRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    dot.X += velocityX * dot.velocity;
    dot.Y += velocityY * dot.velocity;

    if(dot.Y + dot.Radius >= 100 || dot.Y - dot.Radius <= 0)
    {
        velocityY = -velocityY;
        dot.Y += velocityY * dot.velocity * dot.dTime;
    }
    if(dot.X + dot.Radius >= 100 || dot.X - dot.Radius <= 0)
    {
        velocityX = -velocityX;
        dot.X += velocityX * dot.velocity * dot.dTime;
    }
  },
  title: 'DVD',
  duration: 30,
};