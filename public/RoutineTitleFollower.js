import RoutineManager from "./Dot/DotRoutineManager.js";
let routineNameText;
routineNameText = document.querySelector(".routinename");
export const FollowRoutineTitle = () => {
    UpdateTitle(); // Load the first title
    window.addEventListener('DotRoutineManager:RoutineChanged', () => {
        UpdateTitle();
    });
};
const UpdateTitle = () => {
    routineNameText.innerHTML = RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].title;
};
