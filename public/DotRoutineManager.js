import { CounterClockwiseRotationRoutine } from "./Dot/Routines/CounterClockwiseRotationRoutine.js";
import { ClockwiseRotationRoutine } from "./Dot/Routines/ClockwiseRotationRoutine.js";
import { ElasticCollisionRoutine } from "./Dot/Routines/ElasticCollisionRoutine.js";
import { LeftRightRoutine } from "./Dot/Routines/LeftRightRoutine.js";
import { UpDownRoutine } from "./Dot/Routines/UpDownRoutine.js";
import { DiagonalUpwardRoutine } from "./Dot/Routines/DiagonalUpwardRoutine.js";
import { DiagonalDownwardRoutine } from './Dot/Routines/DiagonalDownwardRoutine.js';
import { WaveRoutine } from "./Dot/Routines/WaveRoutine.js";
const RoutineManager = {
    activeDotRoutines: [
        CounterClockwiseRotationRoutine,
        ClockwiseRotationRoutine,
        ElasticCollisionRoutine,
        LeftRightRoutine,
        UpDownRoutine,
        DiagonalUpwardRoutine,
        DiagonalDownwardRoutine,
        WaveRoutine,
    ],
    currentRoutineIndex: 0,
};
window.addEventListener('Game:LeftArrowClick', () => {
    let newIndex = RoutineManager.currentRoutineIndex - 1;
    newIndex = newIndex < 0 ? RoutineManager.activeDotRoutines.length - 1 : newIndex;
    RoutineManager.currentRoutineIndex = newIndex;
});
window.addEventListener('Game:RightArrowClick', () => {
    RoutineManager.currentRoutineIndex = (RoutineManager.currentRoutineIndex + 1) % RoutineManager.activeDotRoutines.length;
});
export default RoutineManager;
