import RoutineManager from "./Dot/DotRoutineManager.js";
let routineNameText:HTMLElement;
routineNameText = document.querySelector(".routinename") as HTMLInputElement;

export const SubscribeToRoutineChangedEvent = () : void => 
{
    UpdateTitle(); // Load the first title
    window.addEventListener('DotRoutineManager:RoutineChanged', () => {
        UpdateTitle();
    })
}

const UpdateTitle = () : void => 
{
    routineNameText.innerHTML = RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].title;
}