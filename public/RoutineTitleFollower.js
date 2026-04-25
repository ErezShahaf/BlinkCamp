import RoutineManager from "./Dot/DotRoutineManager.js";
let routineNameText;
routineNameText = document.getElementById("current-routine-label");
export const SubscribeToRoutineChangedEvent = () => {
    UpdateTitle(); // Load the first title
    window.addEventListener('DotRoutineManager:RoutineChanged', () => {
        UpdateTitle();
    });
};
const UpdateTitle = () => {
    routineNameText.textContent = RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].title;
};
