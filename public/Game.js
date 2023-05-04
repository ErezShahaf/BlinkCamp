import { Dot } from "./Dot/Dot.js";
import { FollowRoutineTitle } from "./RoutineTitleFollower.js";
let leftArrowClickEvent;
let rightArrowClickEvent;
let velocityValueChanged;
let radiusValueChanged;
const InitializeScene = () => {
    new Dot(document.getElementById("dot"));
    SetLeftArrowEvent();
    SetRightArrowEvent();
    SetVelocityChangeEvent();
    SetRadiusChangeEvent();
    FollowRoutineTitle();
};
const SetLeftArrowEvent = () => {
    leftArrowClickEvent = new CustomEvent('Game:LeftArrowClick');
    const leftArrow = document.querySelector(".arrow.left");
    leftArrow.addEventListener("click", () => {
        window.dispatchEvent(leftArrowClickEvent);
    });
};
const SetRightArrowEvent = () => {
    rightArrowClickEvent = new CustomEvent('Game:RightArrowClick');
    const rightArrow = document.querySelector(".arrow.right");
    rightArrow.addEventListener("click", () => {
        window.dispatchEvent(rightArrowClickEvent);
    });
};
const SetVelocityChangeEvent = () => {
    const velocitySlider = document.getElementById("velocityslider");
    velocitySlider.addEventListener("input", () => {
        velocityValueChanged = new CustomEvent('Game:VelocityValueChanged', {
            detail: {
                velocity: velocitySlider.value
            }
        });
        window.dispatchEvent(velocityValueChanged);
    });
};
const SetRadiusChangeEvent = () => {
    const radiusSlider = document.getElementById("sizeslider");
    radiusSlider.addEventListener("input", () => {
        radiusValueChanged = new CustomEvent('Game:RadiusValueChanged', {
            detail: {
                radius: radiusSlider.value
            }
        });
        window.dispatchEvent(radiusValueChanged);
    });
};
InitializeScene();
