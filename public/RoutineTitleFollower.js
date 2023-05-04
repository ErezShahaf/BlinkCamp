import RoutineManager from "./Dot/DotRoutineManager.js";
let routineNameText;
routineNameText = document.querySelector(".routinename");
export const FollowRoutineTitle = () => {
    UpdateTitle(); // set first title at load
    window.addEventListener('DotRoutineManager:RoutineChanged', () => {
        UpdateTitle();
    });
};
const UpdateTitle = () => {
    routineNameText.innerHTML = RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].title;
};
