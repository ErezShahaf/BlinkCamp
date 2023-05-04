import { Dot } from "./Dot/Dot.js";
import { FollowRoutineTitle } from "./RoutineTitleFollower.js";

let leftArrowClickEvent:CustomEvent;
let rightArrowClickEvent:CustomEvent;
let velocityValueChanged:CustomEvent;
let radiusValueChanged:CustomEvent;
const InitializeScene = ():void  => 
{
    new Dot(document.getElementById("dot")!);
    SetLeftArrowEvent();
    SetRightArrowEvent();
    SetVelocityChangeEvent();
    SetRadiusChangeEvent();
    FollowRoutineTitle();
}

const SetLeftArrowEvent = () :void => 
{
    leftArrowClickEvent = new CustomEvent('Game:LeftArrowClick');
    const leftArrow: HTMLDivElement = document.querySelector(".arrow.left") as HTMLDivElement;
    leftArrow.addEventListener("click", () => {
        window.dispatchEvent(leftArrowClickEvent);
      });
}

const SetRightArrowEvent = () : void => 
{
    rightArrowClickEvent = new CustomEvent('Game:RightArrowClick');
    const rightArrow = document.querySelector(".arrow.right") as HTMLDivElement;
    rightArrow.addEventListener("click", () => {
        window.dispatchEvent(rightArrowClickEvent);
    });
}

const SetVelocityChangeEvent = () : void => 
{
    const velocitySlider = document.getElementById("velocityslider") as HTMLInputElement;
    velocitySlider.addEventListener("input", () => {
    velocityValueChanged = new CustomEvent('Game:VelocityValueChanged', {
        detail: {
          velocity: velocitySlider.value
        }
      });
      window.dispatchEvent(velocityValueChanged);
    });
}

const SetRadiusChangeEvent = () : void => 
{
    const radiusSlider = document.getElementById("sizeslider") as HTMLInputElement;
    radiusSlider.addEventListener("input", () => {
    radiusValueChanged = new CustomEvent('Game:RadiusValueChanged', {
        detail: {
          radius: radiusSlider.value
        }
      });
      window.dispatchEvent(radiusValueChanged);
    });
}

InitializeScene();