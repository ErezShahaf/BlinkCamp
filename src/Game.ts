import { Dot } from "./Dot/Dot.js";
import { SubscribeToRoutineChangedEvent } from "./RoutineTitleFollower.js";
import { SubscribeToNotificationsButtonClick } from "./PushNotifications.js";

const InitializeScene = ():void  => 
{
    new Dot(document.getElementById("dot")!);
    // TODO
    // Creat UIEventDispatcher class (component base type) and move them there, and change the name of this class to GameScene.
    SetLeftArrowEvent();
    SetRightArrowEvent();
    SetVelocityChangeEvent();
    SetRadiusChangeEvent();
    // SetReminderButtonEvent();

    // TODO
    // Create a component base class which has awake and update methods, and instantiate those classes instead.
    SubscribeToRoutineChangedEvent();
    SubscribeToNotificationsButtonClick();
}

const SetLeftArrowEvent = () :void => 
{
    const leftArrowClickEvent = new CustomEvent('Game:LeftArrowClick');
    const leftArrow: HTMLDivElement = document.querySelector(".arrow.left") as HTMLDivElement;
    leftArrow.addEventListener("click", () => {
        window.dispatchEvent(leftArrowClickEvent);
      });
}

const SetRightArrowEvent = () : void => 
{
    const rightArrowClickEvent = new CustomEvent('Game:RightArrowClick');
    const rightArrow = document.querySelector(".arrow.right") as HTMLDivElement;
    rightArrow.addEventListener("click", () => {
        window.dispatchEvent(rightArrowClickEvent);
    });
}

const SetVelocityChangeEvent = () => {
  const velocitySlider = document.getElementById("velocityslider") as HTMLInputElement;
  const velocityValueChanged = new CustomEvent('Game:VelocityValueChanged', {
    detail: {
      velocity: velocitySlider.value
    }
  });

  velocitySlider.addEventListener("input", () => {
    velocityValueChanged.detail.velocity = velocitySlider.value;
    window.dispatchEvent(velocityValueChanged);
  });
};

const SetRadiusChangeEvent = () => {
  const radiusSlider = document.getElementById("sizeslider") as HTMLInputElement;
  const radiusValueChanged = new CustomEvent('Game:RadiusValueChanged', {
    detail: {
      radius: radiusSlider.value
    }
  });

  radiusSlider.addEventListener("input", () => {
    radiusValueChanged.detail.radius = radiusSlider.value;
    window.dispatchEvent(radiusValueChanged);
  });
};


const SetReminderButtonEvent = () : void => 
{
    const notificationsClickEvent = new CustomEvent('Game:NotificationsButtonClick');
    const button = document.getElementById("notifications-button") as HTMLDivElement;
    button.addEventListener("click", () => {
        window.dispatchEvent(notificationsClickEvent);
    });
}

InitializeScene();