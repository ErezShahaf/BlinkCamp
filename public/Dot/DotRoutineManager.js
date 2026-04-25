import { DirectionChangingRotationsRoutine } from './Routines/DirectionChangingRotationsRoutine.js';
import { DirectionChangingLeftRight } from './Routines/DirectionChangingLeftRight.js';
import { PeekabooRoutine } from './Routines/PeekabooRoutine.js';
import { InverseWaveRoutine } from './Routines/InverseWaveRoutine.js';
import { CounterClockwiseRotationRoutine } from "./Routines/CounterClockwiseRotationRoutine.js";
import { ClockwiseRotationRoutine } from "./Routines/ClockwiseRotationRoutine.js";
import { ElasticCollisionRoutine } from "./Routines/ElasticCollisionRoutine.js";
import { LeftRightRoutine } from "./Routines/LeftRightRoutine.js";
import { UpDownRoutine } from "./Routines/UpDownRoutine.js";
import { DiagonalUpwardRoutine } from "./Routines/DiagonalUpwardRoutine.js";
import { DiagonalDownwardRoutine } from './Routines/DiagonalDownwardRoutine.js';
import { WaveRoutine } from "./Routines/WaveRoutine.js";
let RoutineChanged = new CustomEvent('DotRoutineManager:RoutineChanged');
const RoutineManager = {
    activeDotRoutines: [
        CounterClockwiseRotationRoutine,
        ClockwiseRotationRoutine,
        DirectionChangingRotationsRoutine,
        ElasticCollisionRoutine,
        LeftRightRoutine,
        DirectionChangingLeftRight,
        UpDownRoutine,
        DiagonalUpwardRoutine,
        DiagonalDownwardRoutine,
        WaveRoutine,
        InverseWaveRoutine,
        PeekabooRoutine
    ],
    currentRoutineIndex: 0,
};
window.addEventListener('Game:RoutineSelected', (event) => {
    var _a;
    const requestedIndex = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.index;
    if (typeof requestedIndex !== 'number')
        return;
    if (requestedIndex < 0 || requestedIndex >= RoutineManager.activeDotRoutines.length)
        return;
    if (requestedIndex === RoutineManager.currentRoutineIndex)
        return;
    RoutineManager.currentRoutineIndex = requestedIndex;
    window.dispatchEvent(RoutineChanged);
});
export default RoutineManager;
