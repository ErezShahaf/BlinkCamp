import { DirectionChangingRotationsRoutine } from './Routines/DirectionChangingRotationsRoutine.js';
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
import { IDotRoutine } from "./IDotRoutine.js";


let RoutineChanged = new CustomEvent('DotRoutineManager:RoutineChanged');

const RoutineManager: { activeDotRoutines: Array<IDotRoutine>, currentRoutineIndex: number} = {
    activeDotRoutines: [
        CounterClockwiseRotationRoutine,
        ClockwiseRotationRoutine,
        DirectionChangingRotationsRoutine,
        ElasticCollisionRoutine,
        LeftRightRoutine,
        UpDownRoutine,
        DiagonalUpwardRoutine,
        DiagonalDownwardRoutine,
        WaveRoutine,
        InverseWaveRoutine,
        PeekabooRoutine
    ],
    currentRoutineIndex: 0,
};


window.addEventListener('Game:LeftArrowClick', () => {
    let newIndex = RoutineManager.currentRoutineIndex - 1;
    newIndex = newIndex < 0 ? RoutineManager.activeDotRoutines.length -1 : newIndex;
    RoutineManager.currentRoutineIndex = newIndex;
    window.dispatchEvent(RoutineChanged);
})

window.addEventListener('Game:RightArrowClick', () => {
    RoutineManager.currentRoutineIndex = (RoutineManager.currentRoutineIndex + 1) % RoutineManager.activeDotRoutines.length;
    window.dispatchEvent(RoutineChanged);
})


export default RoutineManager