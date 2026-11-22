import { Dot } from "./Dot/Dot.js";
import { InitializeAppearance } from "./Appearance.js";
import { SubscribeToRoutineChangedEvent } from "./RoutineTitleFollower.js";
import { InitializeSessionTimer } from "./SessionTimer.js";
import { SubscribeToNotificationsButtonClick } from "./PushNotifications.js";
import { InitializeSettings } from "./Settings.js";
import { InitializeRoutinePicker } from "./RoutinePicker.js";
import { InitializeZen } from "./Zen.js";
import { InitializeSound } from "./Sound.js";

const InitializeScene = ():void  => 
{
    new Dot(document.getElementById("dot")!);
    InitializeAppearance();
    // TODO
    // Creat UIEventDispatcher class (component base type) and move them there, and change the name of this class to GameScene.
    InitializeSessionTimer();
    SetVelocityChangeEvent();
    SetRadiusChangeEvent();
    InitializeSettings();
    InitializeRoutinePicker();
    InitializeZen();
    InitializeSound();
    // SetReminderButtonEvent();

    // TODO
    // Create a component base class which has awake and update methods, and instantiate those classes instead.
    SubscribeToRoutineChangedEvent();
    SubscribeToNotificationsButtonClick();
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