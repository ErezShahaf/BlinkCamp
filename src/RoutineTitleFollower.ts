import RoutineManager from "./Dot/DotRoutineManager.js";
let routineNameText:HTMLElement;
routineNameText = document.querySelector(".routinename") as HTMLInputElement;

export const FollowRoutineTitle = () => 
{
    UpdateTitle(); // Load the first title
    window.addEventListener('DotRoutineManager:RoutineChanged', () => {
        UpdateTitle();
    })
}

const UpdateTitle = () => 
{
    routineNameText.innerHTML = RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].title;
}