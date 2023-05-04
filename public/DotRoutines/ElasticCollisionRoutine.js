const randomPhaseAngleInRadians = Math.random() * 2 * Math.PI;
let velocityX = Math.cos(randomPhaseAngleInRadians);
let velocityY = Math.sin(randomPhaseAngleInRadians);
export const ElasticCollisionRoutine = {
    Execute: function (dot) {
        dot.X += velocityX;
        dot.Y += velocityY;
        if (dot.Y + dot.Radius >= 100 || dot.Y - dot.Radius <= 0) {
            velocityY = -velocityY;
            dot.Y += velocityY * dot.dTime;
        }
        if (dot.X + dot.Radius >= 100 || dot.X - dot.Radius <= 0) {
            velocityX = -velocityX;
            dot.X += velocityX * dot.dTime;
        }
    },
    title: 'DVD',
    duration: 30,
};
