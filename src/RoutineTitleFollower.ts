import RoutineManager from "./Dot/DotRoutineManager.js";
let routineNameText:HTMLElement;
routineNameText = document.getElementById("current-routine-label") as HTMLElement;

export const SubscribeToRoutineChangedEvent = () : void =>
{
    UpdateTitle(); // Load the first title
    window.addEventListener('DotRoutineManager:RoutineChanged', () => {
        UpdateTitle();
    })
}

const UpdateTitle = () : void =>
{
    routineNameText.textContent = RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].title;
}